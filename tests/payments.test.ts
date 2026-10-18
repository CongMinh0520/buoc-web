// Chạy: npm test  (node --test --experimental-strip-types)
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createVnpayUrl, verifyVnpay, vnpayDate, vnpaySignData } from "../src/server/payments/vnpay.ts";
import { codeFromMomoOrderId, momoCreateSignature, momoOrderId, momoSign, verifyMomo } from "../src/server/payments/momo.ts";

const VNP_SECRET = "TESTSECRET0123456789ABCDEFGHIJKL";

test("VNPay: chuỗi ký sắp xếp theo khóa, khoảng trắng mã hóa thành +", () => {
  const s = vnpaySignData({ vnp_B: "a b", vnp_A: "x/y&z", vnp_C: "Thanh toán" });
  assert.equal(s, "vnp_A=x%2Fy%26z&vnp_B=a+b&vnp_C=Thanh+to%C3%A1n");
});

test("VNPay: giờ tạo theo GMT+7, định dạng yyyyMMddHHmmss", () => {
  assert.equal(vnpayDate(new Date("2026-10-15T17:30:05Z")), "20261016003005");
});

test("VNPay: URL tạo ra xác thực được, sửa số tiền thì chữ ký sai", () => {
  process.env.VNPAY_TMN_CODE = "TESTTMN1";
  process.env.VNPAY_HASH_SECRET = VNP_SECRET;
  const url = createVnpayUrl({
    txnRef: "BU26101500001",
    amount: 2_450_000,
    orderInfo: "Thanh toan don hang BU26101500001",
    returnUrl: "https://example.com/api/payments/vnpay/return",
    ipAddr: "127.0.0.1",
    now: new Date("2026-10-15T03:00:00Z"),
  });
  const q = new URL(url).searchParams;
  assert.equal(q.get("vnp_Amount"), "245000000", "VNPay nhận số tiền × 100");
  assert.equal(q.get("vnp_ExpireDate"), "20261015101500");

  // Giả lập VNPay gọi lại: thêm tham số kết quả rồi ký lại bằng cùng thuật toán
  const back = new URLSearchParams(q);
  back.delete("vnp_SecureHash");
  back.set("vnp_ResponseCode", "00");
  back.set("vnp_TransactionStatus", "00");
  back.set("vnp_TransactionNo", "14512345");
  const params = Object.fromEntries(back.entries());
  const hash = crypto.createHmac("sha512", VNP_SECRET).update(vnpaySignData(params)).digest("hex");
  back.set("vnp_SecureHash", hash.toUpperCase()); // VNPay có thể trả chữ hoa
  back.set("vnp_SecureHashType", "HmacSHA512");

  const ok = verifyVnpay(back, VNP_SECRET);
  assert.equal(ok.ok, true);
  assert.equal(ok.success, true);
  assert.equal(ok.amount, 2_450_000);
  assert.equal(ok.txnRef, "BU26101500001");

  const tampered = new URLSearchParams(back);
  tampered.set("vnp_Amount", "100");
  assert.equal(verifyVnpay(tampered, VNP_SECRET).ok, false);
  assert.equal(verifyVnpay(back, "wrong-secret").ok, false);
  const noSig = new URLSearchParams(back);
  noSig.delete("vnp_SecureHash");
  assert.equal(verifyVnpay(noSig, VNP_SECRET).ok, false);
});

test("MoMo: chữ ký tạo giao dịch đúng thứ tự trường theo tài liệu", () => {
  const p = {
    accessKey: "F8BBA842ECF85",
    amount: 50000,
    extraData: "",
    ipnUrl: "https://example.com/ipn",
    orderId: "BU1_x",
    orderInfo: "pay with MoMo",
    partnerCode: "MOMO",
    redirectUrl: "https://example.com/return",
    requestId: "BU1_x",
    requestType: "payWithMethod",
  };
  const raw =
    "accessKey=F8BBA842ECF85&amount=50000&extraData=&ipnUrl=https://example.com/ipn&orderId=BU1_x&orderInfo=pay with MoMo" +
    "&partnerCode=MOMO&redirectUrl=https://example.com/return&requestId=BU1_x&requestType=payWithMethod";
  assert.equal(momoCreateSignature(p, "secret"), crypto.createHmac("sha256", "secret").update(raw).digest("hex"));
});

test("MoMo: mã đơn duy nhất mỗi lần và tách lại được mã gốc", () => {
  const a = momoOrderId("BU26101500001");
  assert.match(a, /^BU26101500001_[0-9a-z]+$/);
  assert.equal(codeFromMomoOrderId(a), "BU26101500001");
});

test("MoMo: xác thực IPN, sửa dữ liệu thì chữ ký sai", () => {
  const cfg = { partnerCode: "MOMO", accessKey: "AK", secretKey: "SK", endpoint: "" };
  const body = {
    partnerCode: "MOMO",
    orderId: "BU26101500001_abc",
    requestId: "BU26101500001_abc",
    amount: 2450000,
    orderInfo: "Thanh toan",
    orderType: "momo_wallet",
    transId: 4088878653,
    resultCode: 0,
    message: "Thành công.",
    payType: "qr",
    responseTime: 1760500000000,
    extraData: "",
  };
  const raw =
    `accessKey=AK&amount=${body.amount}&extraData=&message=${body.message}&orderId=${body.orderId}&orderInfo=${body.orderInfo}` +
    `&orderType=${body.orderType}&partnerCode=MOMO&payType=qr&requestId=${body.requestId}&responseTime=${body.responseTime}` +
    `&resultCode=0&transId=${body.transId}`;
  const signed = { ...body, signature: momoSign(raw, "SK") };
  const r = verifyMomo(signed, cfg);
  assert.equal(r.ok, true);
  assert.equal(r.success, true);
  assert.equal(r.code, "BU26101500001");
  assert.equal(r.amount, 2450000);
  assert.equal(verifyMomo({ ...signed, amount: 1000 }, cfg).ok, false);
  assert.equal(verifyMomo({ ...signed, resultCode: 1006 }, cfg).ok, false);
  assert.equal(verifyMomo({ ...body, signature: "" }, cfg).ok, false);
});
