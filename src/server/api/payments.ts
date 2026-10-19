import { redirect } from "next/navigation";
import { isLocale, localePath, defaultLocale } from "@/i18n/config";
import { getPayloadClient } from "@/lib/cms";
import { findOrderByCode, markOrderPaid, markOrderPaymentFailed, orderResultPath, orderToken } from "@/server/orders";
import { verifyMomo } from "@/server/payments/momo";
import { verifyVnpay } from "@/server/payments/vnpay";

type Tx = { provider: string; ref: string; amount: number; result: string; raw?: unknown };

/**
 * Khách được cổng thanh toán chuyển về: ghi nhận kết quả (idempotent, đối chiếu số tiền) rồi chuyển tới
 * trang kết quả đơn hoặc trang thanh toán thất bại. Nếu IPN chưa tới (vd sandbox/local) thì cập nhật luôn —
 * markOrderPaid an toàn khi cả return và IPN cùng chạy.
 */
async function finishReturn(code: string, success: boolean, tx: Tx): Promise<never> {
  const payload = await getPayloadClient();
  // Quay về đúng ngôn ngữ khách đã dùng khi đặt hàng
  const order = await findOrderByCode(payload, code);
  const lang = isLocale(order?.locale) ? order.locale : defaultLocale;
  if (success) {
    const r = await markOrderPaid(payload, code, tx);
    if (r === "ok" || r === "already") redirect(localePath(lang, orderResultPath(code)));
  } else {
    await markOrderPaymentFailed(payload, code, tx);
  }
  redirect(localePath(lang, `/thanh-toan-that-bai?code=${encodeURIComponent(code)}&t=${orderToken(code)}`));
}

/* ——— VNPay ——— */

/**
 * GET /api/payments/vnpay/ipn — IPN (server-to-server), nguồn sự thật để xác nhận thanh toán.
 * Trả mã RspCode đúng đặc tả để VNPay không gửi lại.
 */
export async function vnpayIpn(req: Request) {
  const v = verifyVnpay(new URL(req.url).searchParams);
  if (!v.ok) return Response.json({ RspCode: "97", Message: "Invalid signature" });

  const payload = await getPayloadClient();
  const order = await findOrderByCode(payload, v.txnRef);
  if (!order) return Response.json({ RspCode: "01", Message: "Order not found" });
  if (Math.round(order.total) !== Math.round(v.amount)) return Response.json({ RspCode: "04", Message: "Invalid amount" });
  if (order.paymentStatus === "paid") return Response.json({ RspCode: "02", Message: "Order already confirmed" });

  const tx = { provider: "vnpay", ref: v.transactionNo, amount: v.amount, result: v.responseCode, raw: v.params };
  if (v.success) await markOrderPaid(payload, v.txnRef, tx);
  else await markOrderPaymentFailed(payload, v.txnRef, tx);
  return Response.json({ RspCode: "00", Message: "Confirm Success" });
}

/** GET /api/payments/vnpay/return — khách quay về sau khi thanh toán; chữ ký được kiểm tra lại */
export async function vnpayReturn(req: Request) {
  const v = verifyVnpay(new URL(req.url).searchParams);
  if (!v.ok || !v.txnRef) redirect("/thanh-toan-that-bai");
  return finishReturn(v.txnRef, v.success, {
    provider: "vnpay",
    ref: v.transactionNo,
    amount: v.amount,
    result: v.responseCode,
    raw: v.params,
  });
}

/* ——— MoMo ——— */

/** POST /api/payments/momo/ipn — IPN của MoMo (JSON). Phản hồi 204 khi đã xử lý. */
export async function momoIpn(req: Request) {
  let body: Record<string, string | number>;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const v = verifyMomo(body);
  if (!v.ok) return new Response(null, { status: 400 });

  const payload = await getPayloadClient();
  const tx = { provider: "momo", ref: v.transId, amount: v.amount, result: v.resultCode, raw: body };
  if (v.success) await markOrderPaid(payload, v.code, tx);
  else await markOrderPaymentFailed(payload, v.code, tx);
  return new Response(null, { status: 204 });
}

/** GET /api/payments/momo/return — khách được MoMo chuyển về (redirectUrl); kiểm tra chữ ký trước khi tin kết quả */
export async function momoReturn(req: Request) {
  const q = Object.fromEntries(new URL(req.url).searchParams.entries());
  const v = verifyMomo(q);
  if (!v.ok || !v.code) redirect("/thanh-toan-that-bai");
  return finishReturn(v.code, v.success, { provider: "momo", ref: v.transId, amount: v.amount, result: v.resultCode, raw: q });
}
