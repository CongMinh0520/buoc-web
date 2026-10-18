# Đưa lên Vercel + Neon Postgres

Thời gian: khoảng 20 phút. Cần tài khoản GitHub, [Vercel](https://vercel.com) và [Neon](https://neon.tech) (đều có gói miễn phí).

## 1. Đẩy code lên GitHub

```bash
git init && git add . && git commit -m "BƯỚC: Next.js + Payload"
git remote add origin git@github.com:<you>/buoc-web.git && git push -u origin main
```

`.env` đã nằm trong `.gitignore`; chỉ `.env.example` được commit.

## 2. Tạo database trên Neon

1. Neon → **New project**, chọn region **Singapore (aws-ap-southeast-1)** để gần người dùng Việt Nam và gần Vercel `sin1`.
2. **Connection string** → bật **Pooled connection** → copy chuỗi dạng
   `postgresql://user:pass@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`.

> Cách khác: Vercel → Storage → **Neon** (Marketplace) tự tạo DB và thêm biến `DATABASE_URL` — code đọc được cả
> `DATABASE_URI` lẫn `DATABASE_URL`, không cần khai báo thêm.

## 3. Tạo project trên Vercel

1. **Add New → Project** → chọn repo. Framework tự nhận Next.js.
2. Build command (`npm run ci` = `payload migrate` rồi `next build`) và region `sin1` (Singapore, cùng region Neon) đã khai báo
   sẵn trong `vercel.json` — không cần chỉnh tay.
3. Nếu chọn region Neon khác Singapore, sửa `regions` trong `vercel.json` cho cùng khu vực (độ trễ DB ảnh hưởng trực tiếp tốc độ trang động).
4. **Environment Variables** (Production + Preview), xem đầy đủ trong `.env.example`:

| Biến | Giá trị |
|---|---|
| `DATABASE_URI` | chuỗi pooled của Neon |
| `PAYLOAD_SECRET` | `openssl rand -base64 48` — **khác nhau** giữa Production và Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://buoc-atelier.vn` (domain chính thức, không có `/` cuối) |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` | SMTP của Resend / Postmark / Amazon SES / Google Workspace… |
| `EMAIL_FROM_ADDRESS` `EMAIL_FROM_NAME` | địa chỉ gửi đã xác minh domain (SPF/DKIM) |
| `BLOB_READ_WRITE_TOKEN` | tự có khi tạo **Storage → Blob** và nối vào project |
| `UPSTASH_REDIS_REST_URL` `UPSTASH_REDIS_REST_TOKEN` | tự có khi thêm **Upstash Redis** từ Marketplace |
| `VNPAY_*`, `MOMO_*` | xem mục 6; bỏ trống thì website chỉ hiện COD |

> **Preview deploy nên dùng DB riêng**: tạo một Neon branch (ví dụ `preview`) và đặt `DATABASE_URI` của môi trường Preview
> trỏ vào branch đó, để migration thử nghiệm không chạm dữ liệu thật.

5. **Deploy**. Lần build đầu tạo toàn bộ bảng qua migration.

## 4. Tạo dữ liệu ban đầu

Chạy seed **một lần** từ máy local, trỏ vào DB production:

```bash
DATABASE_URI="<chuỗi Neon>" PAYLOAD_SECRET="<giống trên Vercel>" NODE_ENV=production \
ALLOW_PROD_SEED=yes SEED_ADMIN_EMAIL=you@company.vn SEED_ADMIN_PASSWORD='<mật khẩu mạnh>' \
npm run seed
```

Trên production, seed **chỉ ghi nội dung CMS** (sản phẩm, bài viết, trang…) và tài khoản admin; không tạo khách mẫu,
không xóa khách hàng hay đơn hàng. Vì seed ghi đè sản phẩm (kể cả tồn kho), chỉ chạy lúc khởi tạo.
Sau đó vào `https://<domain>/admin` → đổi ảnh, nội dung thật → **Publish**. Trang tĩnh tự cập nhật sau vài giây.

Muốn nhập sản phẩm thật từ đầu: bỏ qua seed, tạo admin đầu tiên tại `/admin` (màn hình "Create first user").

## 5. Domain và HTTPS

Vercel → **Domains** → thêm `buoc-atelier.vn` và `www`, trỏ DNS theo hướng dẫn. Sau khi có HTTPS:

- Cập nhật `NEXT_PUBLIC_SITE_URL` đúng domain chính thức rồi **Redeploy** (canonical, sitemap, CSRF, URL trả về thanh toán phụ thuộc biến này).
- Khai báo `https://buoc-atelier.vn/sitemap.xml` trong Google Search Console.

## 6. Cổng thanh toán

URL cần đăng ký với cổng thanh toán:

| Cổng | Return URL (trình duyệt quay về) | IPN URL (server gọi server) |
|---|---|---|
| VNPay | `https://<domain>/api/payments/vnpay/return` | `https://<domain>/api/payments/vnpay/ipn` — khai báo trong trang merchant VNPay |
| MoMo | `https://<domain>/api/payments/momo/return` | `https://<domain>/api/payments/momo/ipn` — gửi kèm trong từng request, không cần khai báo |

- **Sandbox VNPay**: đăng ký tại sandbox.vnpayment.vn/devreg → nhận `vnp_TmnCode` + `vnp_HashSecret`; thẻ test (NCB) có trong email.
- **Sandbox MoMo**: tạo tài khoản business test; dùng app MoMo test để quét QR.
- **Lên production**: đổi `VNPAY_URL` → `https://pay.vnpay.vn/vpcpay.html`, `MOMO_ENDPOINT` → `https://payment.momo.vn/v2/gateway/api/create`
  và thay bằng khóa production.
- IPN là nguồn xác nhận chính; return URL cũng cập nhật đơn (đã kiểm tra chữ ký + số tiền, xử lý idempotent) phòng khi IPN đến chậm.

## 7. Kiểm tra sau khi deploy

- [ ] `/admin` đăng nhập được, tạo/sửa sản phẩm → trang sản phẩm cập nhật trong vài giây.
- [ ] Đăng ký tài khoản → nhận email OTP (kiểm tra cả hộp thư spam).
- [ ] Đặt một đơn COD → nhận email xác nhận → tra cứu bằng mã đơn + SĐT.
- [ ] Thanh toán sandbox VNPay/MoMo → đơn chuyển `Đã xác nhận` / `Đã thanh toán`.
- [ ] `https://<domain>/robots.txt`, `/sitemap.xml` đúng domain; preview URL `*.vercel.app` trả `Disallow: /`.
- [ ] Header bảo mật: kiểm tra trên securityheaders.com.
- [ ] Vercel → **Firewall**: bật Attack Challenge Mode khi bị spam; cân nhắc rule giới hạn tần suất cho `/api/*`.

## Vận hành

- **Đổi schema** (thêm field/collection): sửa code → `npm run migrate:create <tên>` ở local → commit file trong `src/migrations/`
  → deploy (build command tự chạy migrate).
- **Sao lưu**: Neon có point-in-time restore (theo gói); nên bật và thử khôi phục một lần.
- **Ảnh**: ảnh upload qua admin nằm trên Vercel Blob (CDN), tối đa 4 MB/ảnh do giới hạn body request của Vercel — nén ảnh
  trước khi tải (Payload tự tạo bản WebP các cỡ). Cần ảnh gốc lớn hơn: bật `clientUploads: true` cho `vercelBlobStorage`
  trong `payload.config.ts` (trình duyệt tải thẳng lên Blob), chạy `npm run generate:importmap` và thử lại việc tạo ảnh cỡ nhỏ.
  Ảnh Unsplash mẫu lưu dưới dạng URL ngoài, nên thay dần bằng ảnh thật.
- **Đơn chờ thanh toán quá hạn**: thêm Vercel Cron gọi một route hủy đơn `pending` quá 24 giờ để hoàn kho (chưa có sẵn).
