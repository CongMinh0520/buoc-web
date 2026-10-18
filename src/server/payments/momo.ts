/**
 * MoMo (API v2) — tạo giao dịch và xác thực chữ ký HMAC-SHA256.
 * Tài liệu: https://developers.momo.vn/v3/docs/payment/api/wallet/onetime
 */
import crypto from "node:crypto";

export const momoConfig = () => ({
  partnerCode: process.env.MOMO_PARTNER_CODE ?? "",
  accessKey: process.env.MOMO_ACCESS_KEY ?? "",
  secretKey: process.env.MOMO_SECRET_KEY ?? "",
  endpoint: process.env.MOMO_ENDPOINT ?? "https://test-payment.momo.vn/v2/gateway/api/create",
});

export const momoEnabled = () => Boolean(process.env.MOMO_PARTNER_CODE && process.env.MOMO_ACCESS_KEY && process.env.MOMO_SECRET_KEY);

export const momoSign = (raw: string, secret: string) => crypto.createHmac("sha256", secret).update(raw).digest("hex");

/** Mã đơn MoMo phải duy nhất cho mỗi lần thanh toán → thêm hậu tố; tách lại khi nhận kết quả */
export const momoOrderId = (code: string) => `${code}_${Date.now().toString(36)}`;
export const codeFromMomoOrderId = (orderId: string) => orderId.split("_")[0];

export function momoCreateSignature(p: {
  accessKey: string;
  amount: number;
  extraData: string;
  ipnUrl: string;
  orderId: string;
  orderInfo: string;
  partnerCode: string;
  redirectUrl: string;
  requestId: string;
  requestType: string;
}, secret: string) {
  const raw =
    `accessKey=${p.accessKey}&amount=${p.amount}&extraData=${p.extraData}&ipnUrl=${p.ipnUrl}` +
    `&orderId=${p.orderId}&orderInfo=${p.orderInfo}&partnerCode=${p.partnerCode}` +
    `&redirectUrl=${p.redirectUrl}&requestId=${p.requestId}&requestType=${p.requestType}`;
  return momoSign(raw, secret);
}

export async function createMomoPayment(opts: { code: string; amount: number; orderInfo: string; redirectUrl: string; ipnUrl: string }) {
  const cfg = momoConfig();
  const orderId = momoOrderId(opts.code);
  const body = {
    partnerCode: cfg.partnerCode,
    accessKey: cfg.accessKey,
    requestId: orderId,
    amount: Math.round(opts.amount),
    orderId,
    orderInfo: opts.orderInfo,
    redirectUrl: opts.redirectUrl,
    ipnUrl: opts.ipnUrl,
    extraData: "",
    requestType: "payWithMethod",
  };
  const signature = momoCreateSignature(body, cfg.secretKey);
  const { accessKey: _omit, ...rest } = body;
  void _omit;
  const res = await fetch(cfg.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...rest, lang: "vi", autoCapture: true, signature }),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const data = (await res.json()) as { resultCode: number; message: string; payUrl?: string };
  return { orderId, ...data };
}

const RESULT_FIELDS = [
  "accessKey",
  "amount",
  "extraData",
  "message",
  "orderId",
  "orderInfo",
  "orderType",
  "partnerCode",
  "payType",
  "requestId",
  "responseTime",
  "resultCode",
  "transId",
] as const;

/** Xác thực chữ ký kết quả (IPN POST body hoặc query của redirectUrl) */
export function verifyMomo(data: Record<string, string | number | undefined>, cfg = momoConfig()) {
  const values: Record<string, string> = { accessKey: cfg.accessKey };
  for (const k of RESULT_FIELDS) if (k !== "accessKey") values[k] = String(data[k] ?? "");
  const raw = RESULT_FIELDS.map((k) => `${k}=${values[k]}`).join("&");
  const expected = momoSign(raw, cfg.secretKey);
  const received = String(data.signature ?? "");
  const ok = received.length === expected.length && crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
  return {
    ok,
    code: codeFromMomoOrderId(values.orderId),
    orderId: values.orderId,
    amount: Number(values.amount),
    success: values.resultCode === "0",
    transId: values.transId,
    resultCode: values.resultCode,
  };
}
