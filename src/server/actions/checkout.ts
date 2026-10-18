"use server";

import crypto from "node:crypto";
import { z } from "zod";
import { getPayloadClient, getSiteSettings } from "@/lib/cms";
import { getCurrentCustomer } from "@/server/auth";
import { clientIp, rateLimit, TOO_MANY } from "@/server/rate-limit";
import { absUrl } from "@/lib/site-url";
import { checkOrderToken, findOrderByCode, orderResultPath, orderToken } from "@/server/orders";
import { policyVersionSnapshot } from "@/lib/legal";
import { brandMail } from "@/server/mail";
import { createVnpayUrl, vnpayEnabled } from "@/server/payments/vnpay";
import { createMomoPayment, momoEnabled } from "@/server/payments/momo";
import type { ActionResult } from "./auth";
import type { Product as PayloadProduct } from "@/payload-types";

const SHIPPING_FEE = 0; // Miễn phí giao hàng toàn quốc
const MAX_QTY = 5;

const cartItem = z.object({
  slug: z.string().regex(/^[a-z0-9-]{1,120}$/),
  color: z.string().min(1).max(60),
  size: z.string().min(1).max(10),
  qty: z.number().int().min(1).max(MAX_QTY),
});
const cartSchema = z.array(cartItem).min(1, "Giỏ hàng trống").max(20);

export type QuoteLine = {
  slug: string;
  name: string;
  image: string;
  color: string;
  size: string;
  qty: number;
  price: number;
  available: number;
  problem?: string;
};

/** Tính giá & kiểm tồn kho phía server từ dữ liệu mới nhất (không dùng giá gửi từ trình duyệt) */
async function priceCart(items: z.infer<typeof cartSchema>) {
  const payload = await getPayloadClient();
  const slugs = Array.from(new Set(items.map((i) => i.slug)));
  const res = await payload.find({
    collection: "products",
    where: { slug: { in: slugs }, _status: { equals: "published" } },
    limit: slugs.length,
    depth: 1,
    overrideAccess: false,
  });
  const bySlug = new Map(res.docs.map((p) => [p.slug, p as PayloadProduct]));
  const lines: (QuoteLine & { productId?: number })[] = items.map((i) => {
    const p = bySlug.get(i.slug);
    if (!p) return { ...i, name: i.slug, image: "", price: 0, available: 0, problem: "Sản phẩm không còn bán" };
    const v = (p.variants ?? []).find((x) => x.color === i.color && x.size === i.size);
    const img = p.images?.[0]?.image;
    const image = (img?.media && typeof img.media === "object" ? (img.media.sizes?.thumb?.url ?? img.media.url) : img?.url) ?? "";
    const available = v?.stock ?? 0;
    return {
      ...i,
      productId: p.id,
      name: p.name,
      image,
      price: p.price,
      available,
      problem: !v ? "Phân loại không tồn tại" : available < i.qty ? (available === 0 ? "Đã hết hàng" : `Chỉ còn ${available} đôi`) : undefined,
    };
  });
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  return { payload, lines, subtotal, products: bySlug };
}

export async function quoteCartAction(items: unknown): Promise<ActionResult<{ lines: QuoteLine[]; subtotal: number; shippingFee: number; total: number; methods: { vnpay: boolean; momo: boolean } }>> {
  const parsed = cartSchema.safeParse(items);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Giỏ hàng không hợp lệ" };
  const { lines, subtotal } = await priceCart(parsed.data);
  return {
    ok: true,
    data: {
      lines: lines.map(({ productId: _id, ...l }) => (void _id, l)),
      subtotal,
      shippingFee: SHIPPING_FEE,
      total: subtotal + SHIPPING_FEE,
      methods: { vnpay: vnpayEnabled(), momo: momoEnabled() },
    },
  };
}

export async function checkoutProfileAction() {
  const c = await getCurrentCustomer();
  if (!c) return null;
  const addr = c.addresses?.find((a) => a.isDefault) ?? c.addresses?.[0];
  return {
    email: c.email,
    name: addr?.name ?? c.name,
    phone: addr?.phone ?? c.phone ?? "",
    line: addr?.line ?? "",
    ward: addr?.ward ?? "",
    province: addr?.province ?? "",
  };
}

const phone = z
  .string()
  .trim()
  .regex(/^(\+?84|0)\d{9,10}$/, "Số điện thoại không hợp lệ");

const orderSchema = z.object({
  items: cartSchema,
  email: z.string().trim().toLowerCase().email("Email không hợp lệ").max(120),
  shipping: z.object({
    name: z.string().trim().min(2, "Vui lòng nhập tên người nhận").max(100),
    phone,
    line: z.string().trim().min(5, "Vui lòng nhập địa chỉ").max(200),
    ward: z.string().trim().min(2, "Vui lòng nhập phường / xã").max(60),
    province: z.string().trim().min(2, "Vui lòng nhập tỉnh / thành phố").max(60),
    note: z.string().trim().max(500).optional(),
  }),
  paymentMethod: z.enum(["cod", "vnpay", "momo"]),
  acceptTerms: z.boolean().refine((v) => v, "Vui lòng đồng ý với điều kiện giao dịch chung trước khi đặt hàng"),
  invoice: z
    .object({
      companyName: z.string().trim().min(2, "Vui lòng nhập tên công ty").max(200),
      taxCode: z
        .string()
        .trim()
        .regex(/^\d{10}(-\d{3})?$/, "Mã số thuế gồm 10 chữ số (hoặc 10 số + 3 số chi nhánh)"),
      address: z.string().trim().min(5, "Vui lòng nhập địa chỉ công ty").max(300),
      email: z.string().trim().toLowerCase().email("Email nhận hóa đơn không hợp lệ").max(120),
    })
    .optional(),
});

/** Mã đơn: <tiền tố trên admin><yyMMdd><4 số ngẫu nhiên>, ví dụ DH2610151234 */
const newCode = (prefix: string) => {
  const d = new Date(Date.now() + 7 * 3600 * 1000);
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  return `${prefix}${ymd}${crypto.randomInt(1000, 10000)}`;
};
/** Nhận mọi tiền tố 2–4 chữ (đổi tiền tố trên admin không làm hỏng việc tra cứu đơn cũ) */
const ORDER_CODE = /^[A-Z]{2,4}\d{8,12}$/;

async function startOnlinePayment(code: string, total: number, method: "vnpay" | "momo"): Promise<ActionResult<{ redirect: string }>> {
  const orderInfo = `Thanh toan don hang ${code}`;
  if (method === "vnpay") {
    const url = createVnpayUrl({
      txnRef: code,
      amount: total,
      orderInfo,
      returnUrl: absUrl("/api/payments/vnpay/return"),
      ipAddr: (await clientIp()).replace("unknown", "127.0.0.1"),
    });
    return { ok: true, data: { redirect: url } };
  }
  try {
    const r = await createMomoPayment({ code, amount: total, orderInfo, redirectUrl: absUrl("/api/payments/momo/return"), ipnUrl: absUrl("/api/payments/momo/ipn") });
    if (r.resultCode === 0 && r.payUrl) return { ok: true, data: { redirect: r.payUrl } };
    return { ok: false, error: `MoMo từ chối giao dịch: ${r.message}` };
  } catch {
    return { ok: false, error: "Không kết nối được MoMo. Vui lòng thử lại hoặc chọn phương thức khác." };
  }
}

export async function placeOrderAction(input: unknown): Promise<ActionResult<{ redirect: string; code: string }>> {
  if (!(await rateLimit("checkout", 10, 600))) return { ok: false, error: TOO_MANY };
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Thông tin chưa hợp lệ" };
  const data = parsed.data;
  if (data.paymentMethod === "vnpay" && !vnpayEnabled()) return { ok: false, error: "VNPay chưa được cấu hình." };
  if (data.paymentMethod === "momo" && !momoEnabled()) return { ok: false, error: "MoMo chưa được cấu hình." };

  const { payload, lines, subtotal, products } = await priceCart(data.items);
  const problem = lines.find((l) => l.problem);
  if (problem) return { ok: false, error: `${problem.name} (${problem.color}, size ${problem.size}): ${problem.problem}. Vui lòng cập nhật giỏ hàng.` };

  // Trừ tồn kho theo từng sản phẩm
  for (const [slug, product] of products) {
    const mine = lines.filter((l) => l.slug === slug);
    const variants = (product.variants ?? []).map((v) => {
      const take = mine.filter((l) => l.color === v.color && l.size === v.size).reduce((s, l) => s + l.qty, 0);
      return take ? { ...v, stock: Math.max(0, (v.stock ?? 0) - take) } : v;
    });
    await payload.update({ collection: "products", id: product.id, overrideAccess: true, data: { variants } });
  }

  const customer = await getCurrentCustomer();
  const total = subtotal + SHIPPING_FEE;
  const { orderPrefix } = await getSiteSettings();
  let code = newCode(orderPrefix);
  for (let i = 0; i < 5 && (await findOrderByCode(payload, code)); i++) code = newCode(orderPrefix);

  await payload.create({
    collection: "orders",
    overrideAccess: true,
    data: {
      code,
      customer: customer?.id,
      email: data.email,
      status: data.paymentMethod === "cod" ? "confirmed" : "pending",
      paymentMethod: data.paymentMethod,
      paymentStatus: "unpaid",
      shipping: data.shipping,
      items: lines.map((l) => ({ product: l.productId, name: l.name, slug: l.slug, image: l.image, color: l.color, size: l.size, price: l.price, qty: l.qty })),
      subtotal,
      shippingFee: SHIPPING_FEE,
      total,
      invoice: data.invoice ? { requested: true, ...data.invoice } : { requested: false },
      consent: { termsAcceptedAt: new Date().toISOString(), policyVersions: await policyVersionSnapshot() },
    },
  });

  // Email xác nhận (ghi ra console nếu chưa cấu hình SMTP)
  const mail = await brandMail();
  payload
    .sendEmail({
      from: mail.from,
      to: data.email,
      subject: `${mail.brandName} đã nhận đơn hàng #${code}`,
      text: `Cảm ơn bạn đã đặt hàng. Mã đơn: ${code}. Tổng cộng: ${total.toLocaleString("vi-VN")} ₫. Xem đơn: ${absUrl(orderResultPath(code))}`,
    })
    .catch(() => {});

  if (data.paymentMethod === "cod") return { ok: true, data: { redirect: orderResultPath(code), code } };
  const pay = await startOnlinePayment(code, total, data.paymentMethod);
  if (!pay.ok) return { ok: true, data: { redirect: `/thanh-toan-that-bai?code=${code}&t=${orderToken(code)}`, code } };
  return { ok: true, data: { redirect: pay.data!.redirect, code } };
}

/** Thử thanh toán lại cho đơn còn chờ (từ trang thất bại) */
export async function retryPaymentAction(input: { code: string; token: string; method: "vnpay" | "momo" }): Promise<ActionResult<{ redirect: string }>> {
  if (!(await rateLimit("retry-pay", 10, 600))) return { ok: false, error: TOO_MANY };
  const parsed = z.object({ code: z.string().regex(ORDER_CODE), token: z.string().max(64), method: z.enum(["vnpay", "momo"]) }).safeParse(input);
  if (!parsed.success || !checkOrderToken(parsed.data.code, parsed.data.token)) return { ok: false, error: "Liên kết không hợp lệ." };
  const payload = await getPayloadClient();
  const order = await findOrderByCode(payload, parsed.data.code);
  if (!order || order.paymentStatus === "paid" || order.status !== "pending") return { ok: false, error: "Đơn hàng không còn chờ thanh toán." };
  if (Date.now() - new Date(order.createdAt).getTime() > 24 * 3600 * 1000) return { ok: false, error: "Đơn hàng đã quá hạn thanh toán. Vui lòng đặt lại." };
  if (parsed.data.method !== order.paymentMethod) {
    await payload.update({ collection: "orders", id: order.id, overrideAccess: true, data: { paymentMethod: parsed.data.method } });
  }
  return startOnlinePayment(order.code, order.total, parsed.data.method);
}

/** Đổi đơn chờ thanh toán sang COD */
export async function switchToCodAction(input: { code: string; token: string }): Promise<ActionResult<{ redirect: string }>> {
  const parsed = z.object({ code: z.string().regex(ORDER_CODE), token: z.string().max(64) }).safeParse(input);
  if (!parsed.success || !checkOrderToken(parsed.data.code, parsed.data.token)) return { ok: false, error: "Liên kết không hợp lệ." };
  const payload = await getPayloadClient();
  const order = await findOrderByCode(payload, parsed.data.code);
  if (!order || order.paymentStatus === "paid" || order.status !== "pending") return { ok: false, error: "Đơn hàng không còn chờ thanh toán." };
  await payload.update({ collection: "orders", id: order.id, overrideAccess: true, data: { paymentMethod: "cod", status: "confirmed", paymentStatus: "unpaid" } });
  return { ok: true, data: { redirect: orderResultPath(order.code) } };
}

/** Tra cứu đơn hàng công khai: cần cả mã đơn và số điện thoại người nhận */
export async function lookupOrderAction(input: { code: string; phone: string }) {
  if (!(await rateLimit("lookup", 15, 600))) return { ok: false as const, error: TOO_MANY };
  const parsed = z.object({ code: z.string().trim().toUpperCase().transform((v) => v.replace(/^#/, "")).pipe(z.string().regex(ORDER_CODE)), phone }).safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và số điện thoại." };
  const payload = await getPayloadClient();
  const order = await findOrderByCode(payload, parsed.data.code);
  const norm = (p: string) => p.replace(/\D/g, "").replace(/^84/, "0");
  if (!order || norm(order.shipping.phone) !== norm(parsed.data.phone)) {
    return { ok: false as const, error: "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và số điện thoại." };
  }
  return {
    ok: true as const,
    data: {
      code: order.code,
      date: order.createdAt,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus ?? "unpaid",
      items: order.items.map((i) => ({ name: i.name, image: i.image ?? "", color: i.color, size: i.size, price: i.price, qty: i.qty })),
      subtotal: order.subtotal,
      shippingFee: order.shippingFee ?? 0,
      total: order.total,
      shipping: { name: order.shipping.name, phone: order.shipping.phone, address: `${order.shipping.line}, ${order.shipping.ward}, ${order.shipping.province}` },
    },
  };
}
