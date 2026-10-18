import { getSiteSettings } from "@/lib/cms";

/**
 * Người gửi email = tên thương hiệu trên admin + địa chỉ EMAIL_FROM_ADDRESS (địa chỉ đã xác minh SPF/DKIM).
 * EMAIL_FROM_NAME (nếu đặt) được ưu tiên hơn tên thương hiệu.
 */
export async function brandMail() {
  const s = await getSiteSettings();
  const name = (process.env.EMAIL_FROM_NAME || s.brandName).replace(/["<>]/g, "");
  const address = process.env.EMAIL_FROM_ADDRESS || "no-reply@example.com";
  return { brandName: s.brandName, from: `"${name}" <${address}>` };
}
