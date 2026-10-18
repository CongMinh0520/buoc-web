"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getPayloadClient } from "@/lib/cms";
import { getCurrentCustomer } from "@/server/auth";
import { rateLimit, TOO_MANY } from "@/server/rate-limit";
import type { ActionResult } from "./auth";
import config from "@payload-config";
import { logout } from "@payloadcms/next/auth";

const phone = z
  .string()
  .trim()
  .regex(/^(\+?84|0)\d{9,10}$/, "Số điện thoại không hợp lệ");
const firstError = (e: z.ZodError) => e.issues[0]?.message ?? "Dữ liệu không hợp lệ";

async function requireCustomer() {
  const c = await getCurrentCustomer();
  if (!c) throw new Error("UNAUTHORIZED");
  return c;
}

export async function updateProfileAction(input: unknown): Promise<ActionResult> {
  const c = await requireCustomer().catch(() => null);
  if (!c) return { ok: false, error: "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại." };
  const parsed = z
    .object({
      name: z.string().trim().min(2, "Vui lòng nhập tên").max(100),
      phone: z.union([phone, z.literal("")]),
      gender: z.enum(["Nữ", "Nam", "Khác"]).optional(),
      birthday: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")]),
      shoeSize: z.string().max(4),
      marketingOptIn: z.boolean(),
    })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const payload = await getPayloadClient();
  const d = parsed.data;
  await payload.update({
    collection: "customers",
    id: c.id,
    user: c,
    overrideAccess: false,
    data: { name: d.name, phone: d.phone || null, gender: d.gender, birthday: d.birthday || null, shoeSize: d.shoeSize, marketingOptIn: d.marketingOptIn },
  });
  if (Boolean(c.marketingOptIn) !== d.marketingOptIn) {
    // Lưu thời điểm khách đổi lựa chọn nhận tin (trường chỉ nhân viên sửa được → ghi bằng quyền hệ thống)
    await payload.update({
      collection: "customers",
      id: c.id,
      overrideAccess: true,
      data: { consent: { ...(c.consent ?? {}), marketingChangedAt: new Date().toISOString() } },
    });
  }
  revalidatePath("/tai-khoan");
  return { ok: true };
}

export async function changePasswordAction(input: { current: string; next: string; confirm: string }): Promise<ActionResult> {
  if (!(await rateLimit("change-password", 5, 600))) return { ok: false, error: TOO_MANY };
  const c = await requireCustomer().catch(() => null);
  if (!c) return { ok: false, error: "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại." };
  const parsed = z
    .object({
      current: z.string().min(1, "Nhập mật khẩu hiện tại"),
      next: z.string().min(8, "Mật khẩu mới cần ít nhất 8 ký tự").max(72).regex(/[A-Za-z]/, "Mật khẩu cần có chữ").regex(/\d/, "Mật khẩu cần có số"),
      confirm: z.string(),
    })
    .refine((d) => d.next === d.confirm, { message: "Mật khẩu xác nhận không khớp" })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const payload = await getPayloadClient();
  try {
    // Xác minh mật khẩu hiện tại bằng một lần đăng nhập (không đặt cookie)
    await payload.login({ collection: "customers", data: { email: c.email, password: parsed.data.current } });
  } catch {
    return { ok: false, error: "Mật khẩu hiện tại không đúng." };
  }
  await payload.update({ collection: "customers", id: c.id, user: c, overrideAccess: false, data: { password: parsed.data.next } });
  return { ok: true };
}

const addressSchema = z.object({
  label: z.string().trim().min(1, "Nhập tên địa chỉ").max(40),
  name: z.string().trim().min(2, "Nhập họ tên người nhận").max(100),
  phone,
  line: z.string().trim().min(5, "Nhập địa chỉ cụ thể").max(200),
  province: z.string().trim().min(2, "Nhập tỉnh / thành phố").max(60),
  ward: z.string().trim().min(2, "Nhập phường / xã").max(60),
  isDefault: z.boolean().optional(),
});

async function writeAddresses(mutate: (list: z.infer<typeof addressSchema>[]) => z.infer<typeof addressSchema>[]): Promise<ActionResult> {
  const c = await requireCustomer().catch(() => null);
  if (!c) return { ok: false, error: "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại." };
  const current = (c.addresses ?? []).map((a) => ({
    label: a.label,
    name: a.name,
    phone: a.phone,
    line: a.line,
    province: a.province,
    ward: a.ward,
    isDefault: Boolean(a.isDefault),
  }));
  let next = mutate(current).slice(0, 10);
  if (next.length && !next.some((a) => a.isDefault)) next = next.map((a, i) => ({ ...a, isDefault: i === 0 }));
  const payload = await getPayloadClient();
  await payload.update({ collection: "customers", id: c.id, user: c, overrideAccess: false, data: { addresses: next } });
  revalidatePath("/tai-khoan/so-dia-chi");
  return { ok: true };
}

export async function saveAddressAction(input: { index: number | null; address: unknown }): Promise<ActionResult> {
  const parsed = addressSchema.safeParse(input.address);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const idx = typeof input.index === "number" ? input.index : null;
  return writeAddresses((list) => {
    const a = parsed.data;
    const base = a.isDefault ? list.map((x) => ({ ...x, isDefault: false })) : list;
    if (idx !== null && idx >= 0 && idx < base.length) return base.map((x, i) => (i === idx ? a : x));
    return [...base, a];
  });
}

export async function deleteAddressAction(index: number): Promise<ActionResult> {
  return writeAddresses((list) => list.filter((_, i) => i !== index));
}

export async function setDefaultAddressAction(index: number): Promise<ActionResult> {
  return writeAddresses((list) => list.map((a, i) => ({ ...a, isDefault: i === index })));
}

/** Thông báo: chỉ thao tác trên thông báo của chính khách hàng */
export async function notificationAction(input: { op: "read" | "delete" | "read-all" | "delete-all"; id?: number }): Promise<ActionResult> {
  const c = await requireCustomer().catch(() => null);
  if (!c) return { ok: false, error: "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại." };
  const parsed = z.object({ op: z.enum(["read", "delete", "read-all", "delete-all"]), id: z.number().int().positive().optional() }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Yêu cầu không hợp lệ" };
  const payload = await getPayloadClient();
  const own = { customer: { equals: c.id } };
  const where = parsed.data.id ? { and: [own, { id: { equals: parsed.data.id } }] } : own;
  if (parsed.data.op === "read" || parsed.data.op === "read-all") {
    await payload.update({ collection: "notifications", where: { and: [where, { readAt: { exists: false } }] }, data: { readAt: new Date().toISOString() }, overrideAccess: true });
  } else {
    await payload.delete({ collection: "notifications", where, overrideAccess: true });
  }
  revalidatePath("/tai-khoan/thong-bao");
  return { ok: true };
}

/**
 * Xóa tài khoản theo yêu cầu của khách (Luật BVDLCN 2025 — quyền xóa dữ liệu).
 * Xóa hồ sơ, sổ địa chỉ, điểm, thông báo. Đơn hàng được GIỮ LẠI (không còn gắn với tài khoản) vì pháp luật
 * yêu cầu lưu dữ liệu giao dịch tối thiểu 3 năm (hóa đơn, bảo hành, khiếu nại) — đã nêu trong chính sách bảo mật.
 */
export async function deleteAccountAction(input: { password: string; confirm: string }): Promise<ActionResult> {
  if (!(await rateLimit("delete-account", 5, 3600))) return { ok: false, error: TOO_MANY };
  const c = await requireCustomer().catch(() => null);
  if (!c) return { ok: false, error: "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại." };
  const parsed = z
    .object({ password: z.string().min(1, "Nhập mật khẩu để xác nhận"), confirm: z.string().trim() })
    .refine((d) => d.confirm.toUpperCase() === "XÓA", { message: 'Gõ chữ "XÓA" để xác nhận' })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const payload = await getPayloadClient();
  try {
    await payload.login({ collection: "customers", data: { email: c.email, password: parsed.data.password } });
  } catch {
    return { ok: false, error: "Mật khẩu không đúng." };
  }
  // Đăng xuất TRƯỚC khi xóa: sau khi xóa, Payload không còn nhận ra phiên nên sẽ không xóa cookie
  await logout({ config });
  (await cookies()).delete(`${payload.config.cookiePrefix}-token`);
  const own = { customer: { equals: c.id } };
  await payload.delete({ collection: "notifications", where: own, overrideAccess: true });
  await payload.delete({ collection: "loyalty-transactions", where: own, overrideAccess: true });
  await payload.update({ collection: "orders", where: own, data: { customer: null }, overrideAccess: true, context: { skipStatusHook: true } });
  await payload.delete({ collection: "customers", id: c.id, overrideAccess: true });
  payload.logger.info(`Khách hàng #${c.id} đã tự xóa tài khoản`);
  return { ok: true };
}
