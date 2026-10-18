/**
 * VNPay (phiên bản 2.1.0) — tạo URL thanh toán và xác thực chữ ký HMAC-SHA512.
 * Tài liệu: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
 */
import crypto from "node:crypto";

export const vnpayConfig = () => ({
  tmnCode: process.env.VNPAY_TMN_CODE ?? "",
  hashSecret: process.env.VNPAY_HASH_SECRET ?? "",
  payUrl: process.env.VNPAY_URL ?? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
});

export const vnpayEnabled = () => Boolean(process.env.VNPAY_TMN_CODE && process.env.VNPAY_HASH_SECRET);

/** Sắp xếp tham số theo khóa và mã hóa giống thư viện mẫu của VNPay (khoảng trắng → "+") */
export function vnpaySignData(params: Record<string, string>) {
  return Object.keys(params)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k]).replace(/%20/g, "+")}`)
    .join("&");
}

export const vnpayHash = (data: string, secret: string) => crypto.createHmac("sha512", secret).update(Buffer.from(data, "utf-8")).digest("hex");

/** yyyyMMddHHmmss theo giờ Việt Nam (GMT+7) */
export function vnpayDate(d = new Date()) {
  const t = new Date(d.getTime() + 7 * 3600 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getUTCFullYear()}${p(t.getUTCMonth() + 1)}${p(t.getUTCDate())}${p(t.getUTCHours())}${p(t.getUTCMinutes())}${p(t.getUTCSeconds())}`;
}

export function createVnpayUrl(opts: { txnRef: string; amount: number; orderInfo: string; returnUrl: string; ipAddr: string; now?: Date }) {
  const cfg = vnpayConfig();
  const now = opts.now ?? new Date();
  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: cfg.tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: opts.txnRef,
    vnp_OrderInfo: opts.orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: String(Math.round(opts.amount) * 100),
    vnp_ReturnUrl: opts.returnUrl,
    vnp_IpAddr: opts.ipAddr,
    vnp_CreateDate: vnpayDate(now),
    vnp_ExpireDate: vnpayDate(new Date(now.getTime() + 15 * 60 * 1000)),
  };
  const signData = vnpaySignData(params);
  return `${cfg.payUrl}?${signData}&vnp_SecureHash=${vnpayHash(signData, cfg.hashSecret)}`;
}

/** Kiểm tra chữ ký trên query trả về (Return URL hoặc IPN) */
export function verifyVnpay(query: URLSearchParams, secret = vnpayConfig().hashSecret) {
  const received = query.get("vnp_SecureHash") ?? "";
  const params: Record<string, string> = {};
  query.forEach((v, k) => {
    if (k.startsWith("vnp_") && k !== "vnp_SecureHash" && k !== "vnp_SecureHashType") params[k] = v;
  });
  const expected = vnpayHash(vnpaySignData(params), secret);
  const ok = received.length === expected.length && crypto.timingSafeEqual(Buffer.from(received.toLowerCase()), Buffer.from(expected));
  return {
    ok,
    txnRef: params.vnp_TxnRef ?? "",
    amount: Number(params.vnp_Amount ?? 0) / 100,
    success: params.vnp_ResponseCode === "00" && params.vnp_TransactionStatus === "00",
    transactionNo: params.vnp_TransactionNo ?? "",
    responseCode: params.vnp_ResponseCode ?? "",
    params,
  };
}
