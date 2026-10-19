"use server";

import { z } from "zod";
import { fail } from "@/server/i18n";
import config from "@payload-config";
import { login, logout } from "@payloadcms/next/auth";
import { getPayloadClient } from "@/lib/cms";
import { getCurrentCustomer, toPublicCustomer, type PublicCustomer } from "@/server/auth";
import { checkOtp, issueOtp, issueResetTicket } from "@/server/otp";
import { rateLimit, TOO_MANY } from "@/server/rate-limit";
import { policyVersionSnapshot } from "@/lib/legal";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

const email = z.string().trim().toLowerCase().email("Email không hợp lệ").max(120);
const password = z
  .string()
  .min(8, "Mật khẩu cần ít nhất 8 ký tự")
  .max(72)
  .regex(/[A-Za-z]/, "Mật khẩu cần có chữ")
  .regex(/[0-9]/, "Mật khẩu cần có số");
const otp = z.string().regex(/^\d{6}$/, "Mã OTP gồm 6 chữ số");

const SEND_FAILED = "Không gửi được email xác minh lúc này. Vui lòng thử lại sau ít phút.";
const firstError = (e: z.ZodError) => e.issues[0]?.message ?? "Dữ liệu không hợp lệ";

async function findCustomerByEmail(addr: string) {
  const payload = await getPayloadClient();
  const res = await payload.find({ collection: "customers", where: { email: { equals: addr } }, limit: 1, depth: 0, overrideAccess: true });
  return { payload, customer: res.docs[0] ?? null };
}

export async function meAction(): Promise<PublicCustomer | null> {
  const c = await getCurrentCustomer();
  if (!c) return null;
  const payload = await getPayloadClient();
  const { totalDocs } = await payload.count({ collection: "notifications", where: { and: [{ customer: { equals: c.id } }, { readAt: { exists: false } }] }, overrideAccess: true });
  return { ...toPublicCustomer(c), unread: totalDocs };
}

export async function registerAction(input: {
  name: string;
  email: string;
  password: string;
  confirm: string;
  acceptPrivacy: boolean;
  marketingOptIn: boolean;
}): Promise<ActionResult<{ email: string }>> {
  if (!(await rateLimit("register", 5, 3600))) return fail(TOO_MANY);
  const parsed = z
    .object({
      name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(100),
      email,
      password,
      confirm: z.string(),
      // Luật BVDLCN 2025: đồng ý phải chủ động, tách riêng với nhận tin khuyến mãi
      acceptPrivacy: z.boolean().refine((v) => v, "Vui lòng đồng ý với chính sách bảo mật để tạo tài khoản"),
      marketingOptIn: z.boolean(),
    })
    .refine((d) => d.password === d.confirm, { message: "Mật khẩu xác nhận không khớp" })
    .safeParse(input);
  if (!parsed.success) return fail(firstError(parsed.error));

  const { payload, customer } = await findCustomerByEmail(parsed.data.email);
  if (customer?.emailVerified) {
    // Không tiết lộ email đã tồn tại; hướng dẫn chung
    return fail("Không thể đăng ký với email này. Nếu bạn đã có tài khoản, hãy đăng nhập hoặc dùng Quên mật khẩu.");
  }
  const now = new Date().toISOString();
  const consentData = {
    marketingOptIn: parsed.data.marketingOptIn,
    consent: { privacyAcceptedAt: now, policyVersions: await policyVersionSnapshot(), marketingChangedAt: now },
  };
  const doc =
    customer ??
    (await payload.create({
      collection: "customers",
      overrideAccess: true,
      data: { name: parsed.data.name, email: parsed.data.email, password: parsed.data.password, emailVerified: false, ...consentData },
    }));
  if (customer) {
    await payload.update({
      collection: "customers",
      id: customer.id,
      overrideAccess: true,
      data: { name: parsed.data.name, password: parsed.data.password, ...consentData },
    });
  }
  const sent = await issueOtp(payload, doc.id, parsed.data.email, "verify");
  if (!sent.ok && sent.reason === "send") return fail(SEND_FAILED);
  return { ok: true, data: { email: parsed.data.email } };
}

export async function verifyEmailAction(input: { email: string; code: string }): Promise<ActionResult> {
  if (!(await rateLimit("otp-verify", 10, 600))) return fail(TOO_MANY);
  const parsed = z.object({ email, code: otp }).safeParse(input);
  if (!parsed.success) return fail(firstError(parsed.error));
  const { payload, customer } = await findCustomerByEmail(parsed.data.email);
  if (!customer || !(await checkOtp(payload, customer.id, "verify", parsed.data.code))) {
    return fail("Mã OTP không đúng hoặc đã hết hạn.");
  }
  await payload.update({ collection: "customers", id: customer.id, overrideAccess: true, data: { emailVerified: true } });
  return { ok: true };
}

export async function resendOtpAction(input: { email: string; purpose: "verify" | "reset" }): Promise<ActionResult> {
  if (!(await rateLimit("otp-send", 5, 3600))) return fail(TOO_MANY);
  const parsed = z.object({ email, purpose: z.enum(["verify", "reset"]) }).safeParse(input);
  if (!parsed.success) return fail(firstError(parsed.error));
  const { payload, customer } = await findCustomerByEmail(parsed.data.email);
  if (customer) {
    const r = await issueOtp(payload, customer.id, parsed.data.email, parsed.data.purpose);
    if (!r.ok) return fail(r.reason === "send" ? SEND_FAILED : "Vui lòng đợi 60 giây trước khi gửi lại mã.");
  }
  return { ok: true };
}

export async function loginAction(input: { email: string; password: string }): Promise<ActionResult<PublicCustomer>> {
  if (!(await rateLimit("login", 10, 600))) return fail(TOO_MANY);
  const parsed = z.object({ email, password: z.string().min(1).max(72) }).safeParse(input);
  if (!parsed.success) return fail("Email hoặc mật khẩu không đúng.");
  try {
    const res = await login({ collection: "customers", config, email: parsed.data.email, password: parsed.data.password });
    const u = res.user as unknown as { id: number; name: string; email: string };
    return { ok: true, data: { id: u.id, name: u.name, email: u.email } };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("xác minh")) return fail(msg);
    if (/locked/i.test(msg)) return fail("Tài khoản tạm khóa do đăng nhập sai nhiều lần. Thử lại sau 10 phút.");
    return fail("Email hoặc mật khẩu không đúng.");
  }
}

export async function logoutAction(): Promise<ActionResult> {
  await logout({ config });
  return { ok: true };
}

export async function forgotPasswordAction(input: { email: string }): Promise<ActionResult<{ email: string }>> {
  if (!(await rateLimit("forgot", 5, 3600))) return fail(TOO_MANY);
  const parsed = z.object({ email }).safeParse(input);
  if (!parsed.success) return fail(firstError(parsed.error));
  const { payload, customer } = await findCustomerByEmail(parsed.data.email);
  // Luôn trả về thành công để không lộ email nào đã đăng ký (lỗi gửi mail chỉ ghi log cho quản trị)
  if (customer) await issueOtp(payload, customer.id, parsed.data.email, "reset");
  return { ok: true, data: { email: parsed.data.email } };
}

export async function verifyResetOtpAction(input: { email: string; code: string }): Promise<ActionResult<{ ticket: string }>> {
  if (!(await rateLimit("otp-verify", 10, 600))) return fail(TOO_MANY);
  const parsed = z.object({ email, code: otp }).safeParse(input);
  if (!parsed.success) return fail(firstError(parsed.error));
  const { payload, customer } = await findCustomerByEmail(parsed.data.email);
  if (!customer || !(await checkOtp(payload, customer.id, "reset", parsed.data.code))) {
    return fail("Mã OTP không đúng hoặc đã hết hạn.");
  }
  return { ok: true, data: { ticket: await issueResetTicket(payload, customer.id) } };
}

export async function resetPasswordAction(input: { email: string; ticket: string; password: string; confirm: string }): Promise<ActionResult> {
  if (!(await rateLimit("reset", 10, 3600))) return fail(TOO_MANY);
  const parsed = z
    .object({ email, ticket: z.string().min(20).max(64), password, confirm: z.string() })
    .refine((d) => d.password === d.confirm, { message: "Mật khẩu xác nhận không khớp" })
    .safeParse(input);
  if (!parsed.success) return fail(firstError(parsed.error));
  const { payload, customer } = await findCustomerByEmail(parsed.data.email);
  if (!customer || !(await checkOtp(payload, customer.id, "reset-ticket", parsed.data.ticket))) {
    return fail("Phiên đặt lại mật khẩu đã hết hạn. Vui lòng làm lại.");
  }
  // Đổi mật khẩu; đồng thời mở khóa nếu tài khoản đang bị khóa do nhập sai
  await payload.update({
    collection: "customers",
    id: customer.id,
    overrideAccess: true,
    data: { password: parsed.data.password, emailVerified: true, loginAttempts: 0, lockUntil: null } as never,
  });
  return { ok: true };
}
