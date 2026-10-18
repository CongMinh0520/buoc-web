import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { en } from "@payloadcms/translations/languages/en";
import { vi } from "@payloadcms/translations/languages/vi";
import sharp from "sharp";

import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Lines } from "./payload/collections/Lines";
import { Products } from "./payload/collections/Products";
import { Lookbooks } from "./payload/collections/Lookbooks";
import { Articles } from "./payload/collections/Articles";
import { Bookings, Policies, Promotions, Stores } from "./payload/collections/Content";
import { Customers } from "./payload/collections/Customers";
import { LoyaltyTransactions, Notifications, Orders } from "./payload/collections/Orders";
import { AboutPage, HomePage, SiteSettings, WorkshopPage } from "./payload/globals";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/** Ẩn tab "API" trong trang sửa bản ghi — xem tập trung ở /admin/api-docs */
const hideApiTab = <T extends { admin?: object }>(entity: T): T => ({ ...entity, admin: { ...entity.admin, hideAPIURL: true } });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

if (process.env.NODE_ENV === "production" && (process.env.PAYLOAD_SECRET ?? "").length < 32) {
  throw new Error("PAYLOAD_SECRET phải dài ít nhất 32 ký tự ở môi trường production.");
}
if (process.env.NODE_ENV === "production" && !process.env.SMTP_HOST && process.env.NEXT_PHASE !== "phase-production-build") {
  console.warn("[buoc] Chưa cấu hình SMTP_HOST: email OTP/xác nhận đơn sẽ không được gửi.");
}

export default buildConfig({
  serverURL: siteUrl,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " — Quản trị" },
    avatar: "default", // không gọi Gravatar (tránh gửi email nhân viên ra bên thứ ba)
    importMap: { baseDir: path.resolve(dirname) },
    // Giao diện theo nhận diện thương hiệu (màu, font: src/app/(payload)/custom.css) — chỉ dùng nền sáng
    theme: "light",
    // Ngày giờ trong admin theo kiểu Việt Nam (mặc định Payload hiển thị "October 4th 2026, 9:12 AM")
    dateFormat: "dd/MM/yyyy HH:mm",
    components: {
      graphics: { Logo: "/components/admin/Brand#Logo", Icon: "/components/admin/Brand#Icon" },
      beforeLogin: ["/components/admin/Brand#LoginIntro"],
      beforeNavLinks: ["/components/admin/NavScrollKeeper#NavScrollKeeper"],
      beforeDashboard: ["/components/admin/Dashboard#Dashboard"],
      afterNavLinks: ["/components/admin/ApiNavLink#ApiNavLink"],
      // Tài liệu API gom về một trang (thay cho tab "API" ở từng bản ghi — đã ẩn bằng hideAPIURL bên dưới)
      views: { apiDocs: { Component: "/components/admin/ApiDocs#ApiDocs", path: "/api-docs", exact: true } },
    },
  },
  collections: [
    Products,
    Lines,
    Lookbooks,
    Orders,
    Customers,
    LoyaltyTransactions,
    Notifications,
    Bookings,
    Articles,
    Promotions,
    Policies,
    Stores,
    Media,
    Users,
  ].map(hideApiTab),
  globals: [SiteSettings, HomePage, AboutPage, WorkshopPage].map(hideApiTab),
  // Giao diện admin bằng tiếng Việt; nhân viên vẫn có thể chọn English trong Tài khoản
  i18n: { supportedLanguages: { vi, en }, fallbackLanguage: "vi" },
  // Nội dung website song ngữ: các trường có `localized: true` có bản vi/en; bản en còn trống thì hiện bản vi
  localization: {
    locales: [
      { code: "vi", label: "Tiếng Việt" },
      { code: "en", label: "English" },
    ],
    defaultLocale: "vi",
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me-dev-secret-change-me",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL },
    // Dev: tự đồng bộ schema. Production: chạy migration (`payload migrate`) trước khi build.
    push: process.env.NODE_ENV !== "production",
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
  // Chỉ dùng REST + Local API; tắt GraphQL để thu hẹp bề mặt tấn công
  graphQL: { disable: true },
  // Chỉ chấp nhận request có cookie từ đúng domain
  cors: [siteUrl],
  csrf: [siteUrl],
  // Vercel giới hạn body request ~4,5 MB cho serverless function → giữ ảnh tải lên dưới 4 MB
  upload: { limits: { fileSize: 4_000_000 } },
  // Không có SMTP: email (gồm mã OTP) chỉ được ghi log tiêu đề → khách không thể đăng ký ở production
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || "no-reply@example.com",
        // Email gửi khách dùng tên thương hiệu trên admin (src/lib/mail.ts); tên này chỉ dùng cho email hệ thống của admin
        defaultFromName: process.env.EMAIL_FROM_NAME || "Website",
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        },
      })
    : undefined,
  plugins: [
    seoPlugin({
      collections: ["products", "lookbooks", "articles"],
      globals: ["home", "about", "workshop"],
      uploadsCollection: "media",
      tabbedUI: true,
      // Chỉ tên trang; tên thương hiệu được layout tự ghép theo mẫu "%s | <Tên thương hiệu>"
      generateTitle: ({ doc }) => (doc as { name?: string; title?: string }).name ?? (doc as { title?: string }).title ?? "",
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
});
