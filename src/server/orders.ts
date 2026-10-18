import crypto from "node:crypto";
import type { Payload } from "payload";
import type { Order } from "@/payload-types";

const secret = () => process.env.PAYLOAD_SECRET || "dev-secret";

/** Mã truy cập trang kết quả đơn hàng (không đoán được, gắn với mã đơn) */
export const orderToken = (code: string) => crypto.createHmac("sha256", secret()).update(`order:${code}`).digest("base64url").slice(0, 32);
export const checkOrderToken = (code: string, token: string) => {
  const expected = orderToken(code);
  return token.length === expected.length && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
};
export const orderResultPath = (code: string) => `/dat-hang/ket-qua?code=${encodeURIComponent(code)}&t=${orderToken(code)}`;

export async function findOrderByCode(payload: Payload, code: string): Promise<Order | null> {
  const res = await payload.find({ collection: "orders", where: { code: { equals: code } }, limit: 1, depth: 0, overrideAccess: true });
  return (res.docs[0] as Order | undefined) ?? null;
}

type TxLog = { provider: string; ref: string; amount: number; result: string; raw?: unknown };

/**
 * Ghi nhận thanh toán thành công — idempotent (gọi lại nhiều lần không sao)
 * và kiểm tra số tiền khớp tổng đơn để chống giả mạo.
 */
export async function markOrderPaid(payload: Payload, code: string, tx: TxLog) {
  const order = await findOrderByCode(payload, code);
  if (!order) return "not-found" as const;
  if (order.paymentStatus === "paid") return "already" as const;
  if (Math.round(tx.amount) !== Math.round(order.total)) return "amount-mismatch" as const;
  await payload.update({
    collection: "orders",
    id: order.id,
    overrideAccess: true,
    data: {
      paymentStatus: "paid",
      status: order.status === "pending" ? "confirmed" : order.status,
      transactions: [...(order.transactions ?? []), { ...tx, at: new Date().toISOString() }] as never,
    },
  });
  return "ok" as const;
}

export async function markOrderPaymentFailed(payload: Payload, code: string, tx: TxLog) {
  const order = await findOrderByCode(payload, code);
  if (!order) return "not-found" as const;
  if (order.paymentStatus === "paid") return "already" as const;
  await payload.update({
    collection: "orders",
    id: order.id,
    overrideAccess: true,
    data: { paymentStatus: "failed", transactions: [...(order.transactions ?? []), { ...tx, at: new Date().toISOString() }] as never },
  });
  return "ok" as const;
}
