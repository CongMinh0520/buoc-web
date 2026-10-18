import { test } from "node:test";
import assert from "node:assert/strict";
import { checkOrderToken, orderResultPath, orderToken } from "../src/server/orders.ts";
import { formatDate, formatVnd } from "../src/lib/format.ts";
import { normalize } from "../src/lib/search.ts";
import { slugify } from "../src/payload/fields.ts";
import { customerTier } from "../src/lib/loyalty.ts";

test("Token trang kết quả: gắn với mã đơn, không dùng chéo được", () => {
  process.env.PAYLOAD_SECRET = "test-secret-0123456789abcdef0123456789";
  const t = orderToken("BU26101500001");
  assert.equal(t.length, 32);
  assert.equal(checkOrderToken("BU26101500001", t), true);
  assert.equal(checkOrderToken("BU26101500002", t), false);
  assert.equal(checkOrderToken("BU26101500001", t.slice(0, -1)), false);
  assert.equal(checkOrderToken("BU26101500001", ""), false);
  assert.match(orderResultPath("BU26101500001"), /^\/dat-hang\/ket-qua\?code=BU26101500001&t=[\w-]{32}$/);
  process.env.PAYLOAD_SECRET = "another-secret-0123456789abcdef012345";
  assert.equal(checkOrderToken("BU26101500001", t), false, "Đổi secret thì token cũ hết hiệu lực");
});

test("Định dạng tiền và ngày theo giờ Việt Nam", () => {
  assert.equal(formatVnd(2450000), "2.450.000 ₫");
  assert.equal(formatDate("2026-10-15T18:00:00Z"), "16/10/2026");
  assert.equal(formatDate(null), "");
});

test("Bỏ dấu tiếng Việt cho tìm kiếm và slug", () => {
  assert.equal(normalize("Giày Đế Khâu"), "giay de khau");
  assert.equal(slugify("Giày Oxford — Hàng Ngang!"), "giay-oxford-hang-ngang");
  assert.equal(slugify("  Sen Hạ '26 "), "sen-ha-26");
});

test("Hạng thành viên theo điểm", () => {
  assert.deepEqual(customerTier(0), { tier: "Bạc", next: "Vàng", nextAt: 2000 });
  assert.equal(customerTier(2000).tier, "Vàng");
  assert.equal(customerTier(5000).next, null);
});
