import crypto from "node:crypto";
import type { Payload } from "payload";
import { brandMail } from "./mail";

const escapeHtml = (v: string) => v.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]!);

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

export type OtpPurpose = "verify" | "reset" | "reset-ticket";

const secret = () => process.env.PAYLOAD_SECRET || "dev-secret";
const hash = (value: string) => crypto.createHmac("sha256", secret()).update(value).digest("hex");
const safeEqual = (a: string, b: string) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

/** Tạo mã 6 số, lưu bản băm + hạn dùng vào tài khoản, gửi email */
export async function issueOtp(payload: Payload, customerId: number, email: string, purpose: Exclude<OtpPurpose, "reset-ticket">) {
  const current = await payload.findByID({ collection: "customers", id: customerId, showHiddenFields: true, depth: 0 });
  const expires = current.otpExpires ? new Date(current.otpExpires).getTime() : 0;
  if (current.otpPurpose === purpose && expires - (OTP_TTL_MS - RESEND_COOLDOWN_MS) > Date.now()) {
    return { ok: false as const, reason: "cooldown" as const };
  }
  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  await payload.update({
    collection: "customers",
    id: customerId,
    overrideAccess: true,
    data: { otpHash: hash(`${customerId}:${purpose}:${code}`), otpExpires: new Date(Date.now() + OTP_TTL_MS).toISOString(), otpAttempts: 0, otpPurpose: purpose },
  });
  const { brandName, from } = await brandMail();
  const subject = purpose === "verify" ? `Mã xác minh tài khoản ${brandName}` : `Mã đặt lại mật khẩu ${brandName}`;
  const warn = `Mã có hiệu lực trong 10 phút. Không chia sẻ mã này với bất kỳ ai, kể cả nhân viên ${escapeHtml(brandName)}.`;
  try {
    await payload.sendEmail({
      from,
      to: email,
      subject,
      text: `Mã OTP của bạn là ${code}. ${warn}`,
      html: `<p>Mã OTP của bạn là</p><p style="font-size:28px;letter-spacing:6px;font-weight:600">${code}</p><p>${warn}</p>`,
    });
  } catch (err) {
    // Máy chủ email lỗi: không làm sập luồng đăng ký; cho phép gửi lại ngay (bỏ thời gian chờ)
    payload.logger.error({ err, msg: `Không gửi được email OTP (${purpose}) tới ${email}` });
    await payload.update({ collection: "customers", id: customerId, overrideAccess: true, data: { otpHash: null, otpExpires: null, otpPurpose: null } });
    return { ok: false as const, reason: "send" as const };
  }
  if (process.env.NODE_ENV !== "production") payload.logger.info(`[DEV] OTP ${purpose} cho ${email}: ${code}`);
  return { ok: true as const };
}

/** Kiểm tra mã; sai quá 5 lần thì mã bị hủy */
export async function checkOtp(payload: Payload, customerId: number, purpose: OtpPurpose, code: string) {
  const c = await payload.findByID({ collection: "customers", id: customerId, showHiddenFields: true, depth: 0 });
  const expired = !c.otpExpires || new Date(c.otpExpires).getTime() < Date.now();
  if (!c.otpHash || c.otpPurpose !== purpose || expired || (c.otpAttempts ?? 0) >= MAX_ATTEMPTS) return false;
  const ok = safeEqual(c.otpHash, hash(`${customerId}:${purpose}:${code}`));
  await payload.update({
    collection: "customers",
    id: customerId,
    overrideAccess: true,
    data: ok ? { otpHash: null, otpExpires: null, otpAttempts: 0, otpPurpose: null } : { otpAttempts: (c.otpAttempts ?? 0) + 1 },
  });
  return ok;
}

/** Sau khi xác minh OTP đặt lại mật khẩu: cấp "vé" dùng một lần để đổi mật khẩu */
export async function issueResetTicket(payload: Payload, customerId: number) {
  const ticket = crypto.randomBytes(24).toString("base64url");
  await payload.update({
    collection: "customers",
    id: customerId,
    overrideAccess: true,
    data: { otpHash: hash(`${customerId}:reset-ticket:${ticket}`), otpExpires: new Date(Date.now() + OTP_TTL_MS).toISOString(), otpAttempts: 0, otpPurpose: "reset-ticket" },
  });
  return ticket;
}
