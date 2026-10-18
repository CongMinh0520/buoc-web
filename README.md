# bước. — website thương mại điện tử (Jamstack: Next.js + Payload CMS)

Website giày thủ công hư cấu **BƯỚC Atelier**, dựng từ Figma "UI MỚI 10/2026" với nội dung, font và ảnh hoàn toàn mới.
Frontend và CMS chạy chung **một** ứng dụng Next.js: trang công khai được prerender tĩnh, admin `/admin` do Payload cung cấp,
dữ liệu nằm trong Postgres.

> Hướng dẫn đưa lên Vercel + Neon: xem **[DEPLOY.md](./DEPLOY.md)**.

## Chạy ở máy local

Cần **Node 20.9+** (đã test Node 22) và **Postgres 15+** — dễ nhất là cài [Docker Desktop](https://www.docker.com/products/docker-desktop/) để chạy Postgres bằng một lệnh.

```bash
npm install
npm run setup      # tạo .env từ .env.example + sinh PAYLOAD_SECRET ngẫu nhiên
npm run db:up      # bật Postgres trong Docker (cổng 5432, user/pass: postgres/postgres, DB: buoc)
npm run seed       # tạo dữ liệu mẫu, in ra mật khẩu admin
npm run dev        # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

- **Không dùng Docker?** Tự cài Postgres (Postgres.app trên macOS, trình cài đặt chính thức trên Windows), tạo database `buoc`
  rồi sửa `DATABASE_URI` trong `.env`. Hoặc dùng luôn một database miễn phí trên Neon.
- **Cổng 5432 đã bị chiếm** (đang có Postgres khác): `DB_PORT=5433 npm run db:up` và đổi cổng trong `DATABASE_URI` thành `5433`.
- Ở local, schema DB tự đồng bộ theo code (Payload "push"). Production dùng migration (`npm run migrate`).
- Không cấu hình SMTP thì ở chế độ dev **mã OTP được in ra terminal** đang chạy `npm run dev` (`[DEV] OTP verify cho …: 123456`).
- Tài khoản mẫu sau khi seed: khách `minhanh@example.com` / `Buoc@2026demo` (3 đơn mẫu, SĐT `0912345678`); admin `admin@buoc.local` / mật khẩu in ra khi seed.
- Mở bằng `http://localhost:3000` (hoặc `127.0.0.1:3000`). Nếu đổi cổng/domain, sửa `NEXT_PUBLIC_SITE_URL` cho khớp (canonical, sitemap, URL thanh toán dùng biến này).
- `npm run build` cần database đang chạy (các trang tĩnh được dựng từ dữ liệu CMS). Khi chạy bản build bằng `npm start`,
  OTP **không** in ra terminal nữa — dùng tài khoản mẫu, hoặc hộp thư giả ở mục Kiểm thử.
- Ảnh mẫu tải từ `images.unsplash.com`, cần có mạng.

| Lệnh | Việc |
|---|---|
| `npm run setup` | Tạo `.env` + sinh `PAYLOAD_SECRET` (chạy lại không ghi đè) |
| `npm run db:up` / `db:down` | Bật / tắt Postgres trong Docker (dữ liệu giữ trong volume `buoc-pg`) |
| `npm run dev` / `build` / `start` | Phát triển / build / chạy bản production |
| `npm run seed` | Xóa và tạo lại dữ liệu mẫu (production: chỉ nội dung CMS, cần `ALLOW_PROD_SEED=yes`) |
| `npm run migrate` · `migrate:create <tên>` | Chạy / tạo migration khi đổi schema collection |
| `npm run generate:types` · `generate:importmap` | Sinh lại `payload-types.ts` / import map của admin sau khi sửa config |
| `npm test` | Unit test (chữ ký VNPay/MoMo, token đơn, định dạng…) |
| `npm run lint` | ESLint |

### Gỡ lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| `relation "…" does not exist` khi `dev`/`build` | Database chưa có bảng: chạy `npm run seed` (local) hoặc `npm run migrate` (production) |
| `ECONNREFUSED 127.0.0.1:5432` | Postgres chưa chạy: `npm run db:up`, hoặc kiểm tra `DATABASE_URI` |
| `PAYLOAD_SECRET phải dài ít nhất 32 ký tự` khi `build` | Chạy `npm run setup` để sinh khóa |
| Trang trắng nội dung sau khi deploy lần đầu | Bình thường — DB còn trống. Seed (xem DEPLOY.md) hoặc nhập sản phẩm trong `/admin` |
| Ảnh hiện khung xám | Máy không truy cập được `images.unsplash.com`; ảnh tải lên qua admin không bị ảnh hưởng |
| Đổi cấu hình collection mà admin báo lỗi component | `npm run generate:importmap` rồi chạy lại `npm run dev` |

## Kiến trúc

```
Trình duyệt ──► CDN (HTML tĩnh, cache vĩnh viễn) ──► chỉ rebuild trang khi admin sửa nội dung
     │
     ├─ Server Actions (đăng nhập, giỏ → đặt hàng, hồ sơ, địa chỉ…) ─┐
     ├─ /api/payments/* (IPN + return của VNPay, MoMo) ─────────────┤──► Payload Local API ──► Postgres
     └─ /admin (Payload) ───────────────────────────────────────────┘
```

- **Tĩnh trước, động sau.** Mọi trang nội dung (trang chủ, danh mục, sản phẩm, bộ sưu tập, tạp chí…) đọc CMS qua các hàm
  `'use cache'` trong `src/lib/cms.ts`, gắn `cacheTag` và được prerender lúc build. Khi biên tập viên lưu trên admin, hook
  `afterChange` gọi `revalidateTag` → chỉ những trang liên quan được tạo lại (on-demand ISR, không cần build lại).
- **Phần cá nhân** (tài khoản, kết quả đơn) dùng Partial Prerendering: khung trang tĩnh, nội dung theo người dùng stream
  trong `<Suspense>` (đọc cookie lúc request). Trạng thái đăng nhập trên header được hỏi bằng một server action sau khi tải.
- **Tìm kiếm** dùng chỉ mục tĩnh `/search-index.json` (sinh lại cùng catalog), lọc ngay trên trình duyệt, có bỏ dấu tiếng Việt.
- **Giỏ hàng** lưu ở trình duyệt; giá, tồn kho và phí ship luôn được **tính lại trên server** khi báo giá và đặt hàng.

```
src/
├── app/
│   ├── (site)/              # website công khai (root layout riêng)
│   │   ├── api/…/route.ts   # chỉ khai báo URL (VNPay/MoMo IPN + return, xuất dữ liệu cá nhân) → trỏ sang src/server/api
│   │   └── search-index.json/route.ts
│   ├── (payload)/           # admin + REST API của Payload
│   ├── sitemap.ts · robots.ts · global-not-found.tsx
├── server/                  # toàn bộ API phía server — chỉ chạy trên server
│   ├── actions/             # Server Actions: auth, account, checkout, site
│   ├── api/                 # xử lý route handler: payments, account-export, search-index
│   ├── payments/            # ký / xác thực VNPay, MoMo
│   └── auth · orders · otp · rate-limit · mail
├── payload/                 # collections, globals, access control, hooks revalidate
├── payload.config.ts
├── migrations/              # migration Postgres cho production
├── seed/                    # dữ liệu mẫu (nội dung cũ trong src/data đã chuyển vào đây)
├── lib/                     # đọc dữ liệu cho trang (cms, seo) + tiện ích dùng chung client/server (format, types, search…)
├── components/
└── proxy.ts                 # chặn các endpoint auth REST mặc định của khách hàng
```

## Nội dung quản lý trên admin

Sản phẩm (màu, size, **tồn kho theo từng biến thể**, ảnh, mô tả), Dòng sản phẩm, Bộ sưu tập, Tạp chí (rich text + khối ảnh/bảng/trích dẫn),
Ưu đãi, Chính sách, Cửa hàng, Thư viện ảnh; Đơn hàng, Khách hàng, Lịch sử điểm, Thông báo, Đăng ký xưởng mở;
trang Trang chủ / Giới thiệu / Xưởng mở và Cài đặt chung (tên thương hiệu, logo chữ, favicon, tiền tố mã đơn, menu, footer, SEO mặc định, thông tin pháp lý doanh nghiệp). Sản phẩm, bộ sưu tập, bài viết có bản nháp,
lịch sử phiên bản và tab SEO riêng.

Vòng đời đơn: `pending` (chờ thanh toán online) → `confirmed` → `processing` → `shipping` → `delivered` / `cancelled`.
Đổi trạng thái trên admin sẽ tự gửi thông báo cho khách; **Đã giao** cộng điểm (1 điểm / 10.000 ₫); **Đã hủy** hoàn kho.

## SEO

- HTML tĩnh, `metadata` riêng cho từng trang (title, description, canonical, Open Graph, Twitter) lấy từ tab SEO trên admin.
- JSON-LD: `Organization`, `Product` (giá, tình trạng còn hàng), `Article`, `BreadcrumbList`, `ShoeStore` cho cửa hàng.
- `sitemap.xml` (kèm ảnh, `lastModified`) và `robots.txt` tự sinh; preview deploy của Vercel tự chặn index.
- Trang cá nhân, giỏ, thanh toán, tìm kiếm có `noindex`. Ảnh qua loader có `width`/`format` tự động; font tự host.

## Bảo mật

| Lớp | Cách làm |
|---|---|
| Phiên đăng nhập | JWT trong cookie `HttpOnly`, `Secure`, `SameSite=Lax` (khách) / `Strict` (nhân viên). Payload chỉ nhận cookie khi `Origin` khớp `NEXT_PUBLIC_SITE_URL` (CSRF) |
| Đăng ký / quên mật khẩu | Bắt buộc xác minh email bằng OTP 6 số: lưu dạng HMAC, hết hạn 10 phút, tối đa 5 lần thử, chờ 60 s mới gửi lại. Thông báo lỗi không tiết lộ email đã tồn tại |
| Brute-force | Khóa tài khoản 10 phút sau 5 lần sai; giới hạn tần suất theo IP cho mọi action nhạy cảm (Upstash Redis trên production) |
| Phân quyền dữ liệu | Access control Payload ở mức collection và field: khách chỉ đọc/sửa hồ sơ, đơn, điểm, thông báo của chính mình; không tự sửa điểm/trạng thái xác minh; không vào được admin. Các truy vấn phía khách luôn chạy với `overrideAccess: false` |
| Dữ liệu cá nhân | Đồng ý chính sách bảo mật bắt buộc khi đăng ký, nhận tin khuyến mãi tách riêng (mặc định tắt); lưu thời điểm và phiên bản chính sách đã đồng ý. Khách tự **tải dữ liệu** (`/api/account/export`) và **xóa tài khoản** (đơn hàng được giữ, không gắn tài khoản, theo nghĩa vụ lưu giao dịch) |
| Bề mặt API | Tắt GraphQL; chặn `/api/customers/login`, `forgot-password`, `reset-password`, `verify`, `unlock`… (đi qua server action có rate-limit) |
| Đặt hàng | Giá, tồn kho, phí ship tính lại trên server; trừ kho khi đặt; trang kết quả đơn cần token HMAC; tra cứu đơn cần **mã đơn + SĐT** |
| Thanh toán | Xác thực chữ ký HMAC (VNPay SHA-512, MoMo SHA-256) bằng so sánh hằng thời gian; đối chiếu số tiền; xử lý idempotent |
| HTTP | CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP; ẩn `X-Powered-By`; admin `noindex` |
| Upload | Chỉ nhận ảnh, tối đa 4 MB (giới hạn body của Vercel), tự chuyển WebP; trường URL ảnh ngoài chỉ chấp nhận `https://` |
| Bí mật | Toàn bộ khóa nằm trong biến môi trường; production từ chối chạy nếu `PAYLOAD_SECRET` < 32 ký tự |

## Kiểm thử

```bash
npm test                                   # unit test, không cần DB

# E2E trên bản production (cần DB đã seed và Playwright: npx playwright install chromium)
npm run build
python3 tests/e2e/smtp-sink.py 2525 .mail &              # hộp thư giả để nhận OTP (pip install aiosmtpd)
SMTP_HOST=127.0.0.1 SMTP_PORT=2525 PORT=3100 npm start &
BASE=http://localhost:3100 MAIL_DIR=.mail ADMIN_PASSWORD=<mật khẩu admin> node tests/e2e/flow.mjs
```

E2E đi hết: đăng ký + OTP qua email → đăng nhập → sửa hồ sơ, thêm địa chỉ → thêm giỏ → đặt hàng COD → email xác nhận →
lịch sử đơn → tra cứu (đúng/sai SĐT) → kiểm tra phân quyền REST (đọc đơn người khác, tự cộng điểm, CSRF, endpoint bị chặn) →
đăng xuất → thông báo → admin sửa sản phẩm và trang tĩnh cập nhật ngay.

## Chưa làm / giới hạn đã biết

- Đăng nhập mạng xã hội (Google/Facebook) chưa có — popup chỉ còn email + mật khẩu.
- Đơn VNPay/MoMo bỏ dở giữ kho ở trạng thái `pending`; nên thêm cron (Vercel Cron) hủy đơn quá 24 giờ để hoàn kho.
- Trừ kho đọc-rồi-ghi, chưa khóa dòng: hai người mua đúng đôi cuối cùng cùng lúc có thể làm tồn kho âm. Cần transaction/khóa khi lượng đơn lớn.
- Mã giảm giá, phí ship theo khu vực, hóa đơn VAT, đa ngôn ngữ (nút VI/EN) chưa nối logic.
- Ảnh mẫu lấy từ Unsplash; mọi tên, địa chỉ, SĐT, đơn hàng đều là dữ liệu minh họa.
