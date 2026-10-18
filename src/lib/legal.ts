import { getPolicies } from "./cms";

/**
 * Ghi lại khách đã đồng ý với phiên bản chính sách nào (để kiểm chứng sau này).
 * Dạng: "gia@v2, bao-mat@2026-10-15, …" — dùng trường "Phiên bản" của chính sách, nếu trống thì dùng ngày cập nhật.
 */
export async function policyVersionSnapshot(): Promise<string> {
  const policies = await getPolicies();
  return policies.map((p) => `${p.slug}@${p.version || p.updatedAt.slice(0, 10)}`).join(", ").slice(0, 1000);
}
