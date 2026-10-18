/**
 * Kiểm thử E2E toàn luồng trên bản build production (npm run build && npm start).
 *
 *   python3 tests/e2e/smtp-sink.py 2525 .mail &               # hộp thư giả để nhận OTP
 *   SMTP_HOST=127.0.0.1 SMTP_PORT=2525 PORT=3100 npm start &
 *   BASE=http://localhost:3100 MAIL_DIR=.mail ADMIN_EMAIL=... ADMIN_PASSWORD=... node tests/e2e/flow.mjs
 *
 * Yêu cầu dữ liệu seed (npm run seed). Mỗi lần chạy tạo một khách hàng mới với email ngẫu nhiên.
 */
import { chromium } from "playwright";
import { readdirSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const BASE = process.env.BASE || "http://localhost:3100";
const MAIL_DIR = process.env.MAIL_DIR || ".mail";
const SHOTS = process.env.SHOTS || "";
const ADMIN = { email: process.env.ADMIN_EMAIL || "admin@buoc.local", password: process.env.ADMIN_PASSWORD || "" };
const DEMO = { email: "minhanh@example.com", password: "Buoc@2026demo" };

const email = `e2e-${Date.now()}@example.com`;
const password = "E2eTest2026";
const phone = "0987654321";
const results = [];
const step = async (name, fn) => {
  const t = Date.now();
  try {
    await fn();
    results.push(["✓", name, Date.now() - t]);
  } catch (e) {
    results.push(["✗", name, Date.now() - t, e.message.split("\n")[0]]);
    throw e;
  }
};

async function waitForMail(to, subjectRe, timeout = 15000) {
  const end = Date.now() + timeout;
  const key = to.replace("@", "_at_");
  while (Date.now() < end) {
    if (existsSync(MAIL_DIR)) {
      const files = readdirSync(MAIL_DIR).filter((f) => f.includes(key)).sort().reverse();
      for (const f of files) {
        const body = readFileSync(join(MAIL_DIR, f), "utf8");
        if (subjectRe.test(body)) return body;
      }
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Không nhận được email "${subjectRe}" gửi ${to}`);
}

// Next 16 giữ bản ẩn của trạng thái route trước (<Activity>), nên chỉ xét phần tử đang hiển thị
const vis = (loc) => loc.filter({ visible: true }).first();

const shot = async (page, name) => {
  if (!SHOTS) return;
  mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: join(SHOTS, `${name}.png`), fullPage: true });
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
// "networkidle" có thể chậm khi ảnh ngoài (Unsplash) tải lâu/bị chặn → nới thời gian chờ điều hướng
page.setDefaultNavigationTimeout(90_000);
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));

let orderCode = "";
try {
  await step("Đăng ký tài khoản + nhận OTP qua email", async () => {
    await page.goto(`${BASE}/tai-khoan`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();
    const dlg = page.getByRole("dialog");
    await dlg.locator('input[name="name"]').fill("Khách E2E");
    await dlg.locator('input[name="email"]').fill(email);
    await dlg.locator('input[name="password"]').fill(password);
    await dlg.locator('input[name="confirm"]').fill(password);
    assert.equal(await dlg.locator("#auth-marketing").isChecked(), false, "Ô nhận tin khuyến mãi phải mặc định không tích");
    // Chưa đồng ý chính sách bảo mật → trình duyệt chặn gửi form (vẫn ở bước đăng ký)
    await dlg.locator('button[type="submit"]').click();
    assert.equal(await dlg.getByLabel("Số OTP thứ 1").count(), 0, "Đăng ký được khi chưa đồng ý chính sách bảo mật");
    await dlg.locator("#auth-acceptPrivacy").check();
    await dlg.locator('button[type="submit"]').click();
    await dlg.getByLabel("Số OTP thứ 1").waitFor();
    const mail = await waitForMail(email, /Mã xác minh/);
    const code = mail.match(/\b(\d{6})\b/)?.[1];
    assert.ok(code, "Email không chứa mã 6 số");
    // OTP sai trước → phải báo lỗi
    for (let i = 0; i < 6; i++) await dlg.getByLabel(`Số OTP thứ ${i + 1}`).fill(String((Number(code[i]) + 1) % 10));
    await dlg.locator('button[type="submit"]').click();
    await dlg.getByRole("alert").waitFor();
    for (let i = 0; i < 6; i++) await dlg.getByLabel(`Số OTP thứ ${i + 1}`).fill(code[i]);
    await dlg.locator('button[type="submit"]').click();
    await vis(dlg.getByText("Xác minh thành công")).waitFor();
  });

  await step("Đăng nhập → trang tài khoản hiển thị dữ liệu thật", async () => {
    const dlg = page.getByRole("dialog");
    await dlg.locator('input[name="email"]').fill(email);
    await dlg.locator('input[name="password"]').fill(password);
    await dlg.locator('button[type="submit"]').click();
    await dlg.waitFor({ state: "detached" });
    await page.locator("#pf-name").waitFor();
    assert.equal(await page.locator("#pf-name").inputValue(), "Khách E2E");
    const cookies = await ctx.cookies();
    const tok = cookies.find((c) => c.name === "payload-token");
    assert.ok(tok?.httpOnly, "Cookie phiên phải là httpOnly");
  });

  await step("Cập nhật hồ sơ + thêm địa chỉ", async () => {
    await page.locator("#pf-phone").fill(phone);
    await page.getByRole("button", { name: "Lưu thông tin" }).click();
    await vis(page.getByText("Đã lưu thông tin.")).waitFor();
    await page.goto(`${BASE}/tai-khoan/so-dia-chi`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Thêm mới địa chỉ" }).click();
    await page.locator('input[name="label"]').fill("Nhà riêng");
    await page.locator('input[name="phone"]').fill(phone);
    await page.locator('input[name="name"]').fill("Khách E2E");
    await page.locator('input[name="line"]').fill("12 Lê Lợi");
    await page.locator('input[name="province"]').fill("TP. Hồ Chí Minh");
    await page.locator('input[name="ward"]').fill("Phường Bến Thành");
    await page.getByRole("button", { name: "Lưu địa chỉ" }).click();
    await vis(page.getByText("12 Lê Lợi, Phường Bến Thành")).waitFor();
    await vis(page.getByText("Mặc định", { exact: true })).waitFor();
    await page.reload({ waitUntil: "networkidle" });
    await vis(page.getByText("12 Lê Lợi, Phường Bến Thành")).waitFor();
    await shot(page, "addresses");
  });

  await step("Thêm sản phẩm còn hàng vào giỏ", async () => {
    await page.goto(`${BASE}/danh-muc/tat-ca`, { waitUntil: "networkidle" });
    const href = await page.locator('a[href^="/san-pham/"]').first().getAttribute("href");
    await page.goto(`${BASE}${href}`, { waitUntil: "networkidle" });
    const size = page.locator('button[aria-label^="Size "]:not([disabled])').first();
    await size.click();
    await page.getByRole("button", { name: "Thêm vào giỏ" }).click();
    await page.waitForFunction(() => (localStorage.getItem("buoc-cart-v1") || "[]").length > 2);
  });

  await step("Thanh toán COD → trang kết quả + email xác nhận", async () => {
    await page.goto(`${BASE}/thanh-toan`, { waitUntil: "networkidle" });
    await page.locator("#co-name").fill("Khách E2E");
    await page.locator("#co-email").fill(email);
    await page.locator("#co-phone").fill(phone);
    await page.locator("#co-line").fill("12 Lê Lợi");
    await page.locator("#co-ward").fill("Phường Bến Thành");
    await page.locator("#co-province").fill("TP. Hồ Chí Minh");
    await page.locator("#co-invoice").check();
    await page.locator("#co-inv-company").fill("Công ty TNHH Thử Nghiệm E2E");
    await page.locator("#co-inv-tax").fill("0312345678");
    await page.locator("#co-inv-email").fill("ketoan@example.com");
    await page.locator("#co-inv-address").fill("1 Nguyễn Huệ, Phường Sài Gòn, TP. Hồ Chí Minh");
    const btn = page.getByRole("button", { name: "Đặt hàng" });
    await btn.waitFor();
    await page.waitForFunction(() => !document.querySelector('button[type="submit"][disabled]'));
    // Chưa tích đồng ý điều khoản → không đặt được
    await btn.click();
    await page.waitForTimeout(800);
    assert.ok(page.url().includes("/thanh-toan"), "Đặt hàng được khi chưa đồng ý điều khoản");
    await page.locator("#co-terms").check();
    await btn.click();
    await page.waitForURL(/\/dat-hang\/ket-qua/);
    // Phần kết quả stream sau khung trang (Suspense) → chờ mã đơn xuất hiện
    await vis(page.getByText(/#[A-Z]{2,4}\d{8,}/)).waitFor({ timeout: 15000 });
    orderCode = (await page.locator("body").innerText()).match(/#([A-Z]{2,4}\d{8,})/)?.[1] ?? "";
    assert.ok(orderCode, "Không thấy mã đơn trên trang kết quả");
    await shot(page, "order-result");
    await waitForMail(email, new RegExp(orderCode));
    // Token sai → không lộ đơn
    const bad = await page.request.get(`${BASE}/dat-hang/ket-qua?code=${orderCode}&t=deadbeef`);
    assert.ok(!(await bad.text()).includes(`#${orderCode}</b>`), "Trang kết quả lộ đơn với token sai");
  });

  await step("Lịch sử đơn hàng chỉ có đơn của mình", async () => {
    await page.goto(`${BASE}/tai-khoan/lich-su-don-hang`, { waitUntil: "networkidle" });
    await vis(page.getByText(`#${orderCode}`)).waitFor();
    assert.equal(await page.getByText("#BU26100412").filter({ visible: true }).count(), 0, "Thấy đơn của khách khác");
  });

  await step("Tra cứu đơn: đúng SĐT thấy đơn, sai SĐT bị từ chối", async () => {
    await page.goto(`${BASE}/tra-cuu-don-hang`, { waitUntil: "networkidle" });
    await page.locator("#lookup-code").fill(orderCode);
    await page.locator("#lookup-phone").fill("0900000000");
    await page.getByRole("button", { name: /tra cứu/i }).click();
    await vis(page.locator("#lookup-error")).waitFor();
    await page.locator("#lookup-phone").fill(phone);
    await page.getByRole("button", { name: /tra cứu/i }).click();
    await vis(page.getByText(orderCode).first()).waitFor();
    await shot(page, "lookup");
  });

  await step("REST API: phân quyền theo chủ sở hữu", async () => {
    // Payload chỉ chấp nhận cookie khi Origin khớp danh sách csrf → giả lập fetch cùng origin
    const O = { Origin: BASE };
    const r = {
      get: (u) => page.request.get(u, { headers: O }),
      patch: (u, o) => page.request.patch(u, { ...o, headers: O }),
      post: (u, o) => page.request.post(u, { ...o, headers: O }),
    };
    const noOrigin = await page.request.get(`${BASE}/api/orders`);
    assert.equal(noOrigin.status(), 403, "Cookie được chấp nhận khi thiếu Origin (CSRF)");
    const own = await (await r.get(`${BASE}/api/orders?limit=100&depth=0`)).json();
    assert.ok(own.docs.length >= 1 && own.docs.every((o) => o.email === email), "Khách đọc được đơn không phải của mình");
    const other = await (await r.get(`${BASE}/api/orders?where[code][equals]=BU26100412`)).json();
    assert.equal(other.docs.length, 0);
    const custs = await (await r.get(`${BASE}/api/customers?limit=100`)).json();
    assert.equal(custs.docs.length, 1);
    assert.ok(!("otpHash" in custs.docs[0]) && !("hash" in custs.docs[0]), "Lộ trường ẩn của khách");
    assert.equal((await r.get(`${BASE}/api/users`)).status(), 403);
    const patch = await r.patch(`${BASE}/api/orders/${own.docs[0].id}`, { data: { paymentStatus: "paid" } });
    assert.ok(patch.status() >= 400, "Khách tự sửa được đơn hàng");
    const pts = await r.patch(`${BASE}/api/customers/${custs.docs[0].id}`, { data: { points: 99999 } });
    const after = await (await r.get(`${BASE}/api/customers/${custs.docs[0].id}`)).json();
    assert.notEqual(after.points, 99999, `Khách tự cộng được điểm (status ${pts.status()})`);
    assert.equal((await r.post(`${BASE}/api/customers/login`, { data: { email, password } })).status(), 404);
    const anon = await browser.newContext();
    assert.equal((await anon.request.get(`${BASE}/api/orders`)).status(), 403);
    await anon.close();
  });

  await step("Đăng xuất", async () => {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Tài khoản" }).click();
    await page.getByRole("button", { name: /đăng xuất/i }).click();
    for (let i = 0; i < 50 && (await ctx.cookies()).some((c) => c.name === "payload-token"); i++) await page.waitForTimeout(200);
    assert.ok(!(await ctx.cookies()).some((c) => c.name === "payload-token"), "Cookie phiên chưa bị xóa sau khi đăng xuất");
    await page.goto(`${BASE}/tai-khoan`, { waitUntil: "networkidle" });
    await vis(page.getByText("Bạn chưa đăng nhập")).waitFor();
  });

  await step("Tải dữ liệu cá nhân + xóa tài khoản (giữ lại đơn hàng)", async () => {
    await page.getByRole("button", { name: "Đăng nhập" }).first().click();
    const dlg = page.getByRole("dialog");
    await dlg.locator('input[name="email"]').fill(email);
    await dlg.locator('input[name="password"]').fill(password);
    await dlg.locator('button[type="submit"]').click();
    await dlg.waitFor({ state: "detached" });
    await page.goto(`${BASE}/tai-khoan`, { waitUntil: "networkidle" });
    const [download] = await Promise.all([page.waitForEvent("download"), vis(page.getByRole("link", { name: "Tải dữ liệu của tôi" })).click()]);
    const exported = JSON.parse(readFileSync(await download.path(), "utf8"));
    assert.equal(exported.profile.email, email);
    assert.ok(exported.profile.consent?.privacyAcceptedAt, "Thiếu bằng chứng đồng ý chính sách bảo mật");
    assert.ok(exported.orders.some((o) => o.code === orderCode && o.invoice?.taxCode === "0312345678"), "Dữ liệu tải về thiếu đơn / hóa đơn");
    assert.ok(!JSON.stringify(exported).includes("otpHash") && !JSON.stringify(exported).includes('"hash"'), "Lộ trường bí mật");
    // Xóa: sai mật khẩu bị từ chối, đúng thì xóa và đăng xuất
    await vis(page.getByRole("button", { name: "Xóa tài khoản" })).click();
    await page.locator("#del-password").fill("SaiMatKhau1");
    await page.locator("#del-confirm").fill("XÓA");
    await page.getByRole("button", { name: "Xóa vĩnh viễn" }).click();
    await vis(page.getByText("Mật khẩu không đúng.")).waitFor();
    await page.locator("#del-password").fill(password);
    await page.getByRole("button", { name: "Xóa vĩnh viễn" }).click();
    await page.waitForURL(`${BASE}/`);
    for (let i = 0; i < 25 && (await ctx.cookies()).some((c) => c.name === "payload-token"); i++) await page.waitForTimeout(200);
    assert.ok(!(await ctx.cookies()).some((c) => c.name === "payload-token"), "Chưa đăng xuất sau khi xóa tài khoản");
    // Không đăng nhập lại được; đơn hàng vẫn tra cứu được (nghĩa vụ lưu giao dịch)
    await page.goto(`${BASE}/tai-khoan`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Đăng nhập" }).first().click();
    await dlg.locator('input[name="email"]').fill(email);
    await dlg.locator('input[name="password"]').fill(password);
    await dlg.locator('button[type="submit"]').click();
    await dlg.getByRole("alert").waitFor();
    await dlg.getByRole("button", { name: "Đóng" }).click();
    await page.goto(`${BASE}/tra-cuu-don-hang`, { waitUntil: "networkidle" });
    await page.locator("#lookup-code").fill(orderCode);
    await page.locator("#lookup-phone").fill(phone);
    await page.getByRole("button", { name: /tra cứu/i }).click();
    await vis(page.getByText(orderCode)).waitFor();
    await page.goto(`${BASE}/tai-khoan`, { waitUntil: "networkidle" });
  });

  await step("Thông báo của khách demo: đánh dấu đã đọc", async () => {
    await page.getByRole("button", { name: "Đăng nhập" }).first().click();
    const dlg = page.getByRole("dialog");
    await dlg.locator('input[name="email"]').fill(DEMO.email);
    await dlg.locator('input[name="password"]').fill(DEMO.password);
    await dlg.locator('button[type="submit"]').click();
    await dlg.waitFor({ state: "detached" });
    await page.goto(`${BASE}/tai-khoan/thong-bao`, { waitUntil: "networkidle" });
    await vis(page.getByText(/thông báo chưa đọc/)).waitFor();
    await shot(page, "notifications");
    await page.getByRole("button", { name: "Đánh dấu tất cả đã đọc" }).click();
    await vis(page.getByText("Không có thông báo chưa đọc")).waitFor();
    await page.reload({ waitUntil: "networkidle" });
    await vis(page.getByText("Không có thông báo chưa đọc")).waitFor();
    await page.goto(`${BASE}/tai-khoan/tich-diem`, { waitUntil: "networkidle" });
    await vis(page.getByText("Lịch sử tích điểm")).waitFor();
    await shot(page, "points");
  });

  if (ADMIN.password) {
    await step("Admin sửa sản phẩm → trang tĩnh cập nhật ngay (on-demand ISR)", async () => {
      const admin = await browser.newContext({ extraHTTPHeaders: { Origin: BASE } });
      const login = await admin.request.post(`${BASE}/api/users/login`, { data: ADMIN });
      assert.equal(login.status(), 200);
      const prods = await (await admin.request.get(`${BASE}/api/products?limit=1&depth=0&where[_status][equals]=published`)).json();
      const p = prods.docs[0];
      const marker = `${p.name} E2E`;
      const upd = await admin.request.patch(`${BASE}/api/products/${p.id}`, { data: { name: marker, _status: "published" } });
      assert.equal(upd.status(), 200);
      // Lần đầu có thể trả bản cũ (stale-while-revalidate), lần sau phải là bản mới
      let html = "";
      for (let i = 0; i < 10 && !html.includes(marker); i++) {
        html = await (await admin.request.get(`${BASE}/san-pham/${p.slug}`)).text();
        if (!html.includes(marker)) await new Promise((r) => setTimeout(r, 500));
      }
      assert.ok(html.includes(marker), "Trang sản phẩm chưa cập nhật sau khi sửa");
      await admin.request.patch(`${BASE}/api/products/${p.id}`, { data: { name: p.name, _status: "published" } });
      // Xóa dòng sản phẩm đang được dùng → bị chặn với thông báo rõ ràng, không phải lỗi 500
      const lines = await (await admin.request.get(`${BASE}/api/lines?limit=1&depth=0`)).json();
      const del = await admin.request.delete(`${BASE}/api/lines/${lines.docs[0].id}`);
      assert.equal(del.status(), 400);
      assert.match(JSON.stringify(await del.json()), /đang được dùng/);
      // Đơn lưu thông tin hóa đơn công ty và bằng chứng đồng ý điều khoản
      const ord = (await (await admin.request.get(`${BASE}/api/orders?where[code][equals]=${orderCode}&depth=0`)).json()).docs[0];
      assert.equal(ord.invoice?.requested, true);
      assert.equal(ord.invoice?.taxCode, "0312345678");
      assert.ok(ord.consent?.termsAcceptedAt && ord.consent?.policyVersions, "Đơn thiếu bằng chứng đồng ý điều khoản");
      assert.equal(ord.customer, null, "Đơn vẫn gắn với tài khoản đã xóa");

      // Đổi tên thương hiệu + nhập thông tin doanh nghiệp trên admin → toàn site cập nhật (không cần build lại)
      const before = (await (await admin.request.get(`${BASE}/api/globals/site-settings?depth=0`)).json());
      const brandTest = "Thương Hiệu Thử E2E";
      const company = { name: "Công ty TNHH Thương Hiệu Thử", address: "1 Lê Duẩn, TP. Hồ Chí Minh", taxCode: "0399999999", registrationNo: "0399999999", registrationIssued: "01/01/2026, Sở Tài chính TP. Hồ Chí Minh", representative: "Nguyễn Văn A", complaintPhone: "0280000000", complaintEmail: "cskh@example.com" };
      const upd2 = await admin.request.post(`${BASE}/api/globals/site-settings`, { data: { brandName: brandTest, wordmark: "thử.", company } });
      assert.equal(upd2.status(), 200, `Không cập nhật được Cài đặt chung (${upd2.status()})`);
      let home = "";
      for (let i = 0; i < 12 && !home.includes(company.name); i++) {
        home = await (await admin.request.get(`${BASE}/gioi-thieu`)).text();
        if (!home.includes(company.name)) await new Promise((r) => setTimeout(r, 500));
      }
      assert.ok(home.includes(company.name) && home.includes("Mã số thuế: 0399999999"), "Footer chưa hiện thông tin doanh nghiệp");
      assert.match(home, new RegExp(`<title>[^<]*${brandTest}`), "Tiêu đề trang chưa đổi theo tên thương hiệu");
      assert.ok(!home.includes("Thương hiệu minh họa"), "Còn dòng 'Thương hiệu minh họa'");
      await admin.request.post(`${BASE}/api/globals/site-settings`, { data: { brandName: before.brandName, wordmark: before.wordmark, company: before.company ?? {} } });

      const adminPage = await admin.newPage();
      await adminPage.goto(`${BASE}/admin`);
      await adminPage.waitForLoadState("networkidle");
      await shot(adminPage, "admin-dashboard");
      await admin.close();
    });
  }
} finally {
  await browser.close();
  for (const [ok, name, ms, err] of results) console.log(`${ok} ${name} (${ms}ms)${err ? `\n    → ${err}` : ""}`);
  if (pageErrors.length) console.log("Lỗi JS trên trang:\n  " + pageErrors.join("\n  "));
}
if (results.some((r) => r[0] === "✗") || pageErrors.length) process.exit(1);
