import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy cho website (không áp dụng cho /admin vì trình soạn thảo của Payload cần nới lỏng hơn).
 * Trang được prerender tĩnh nên không dùng nonce theo request; script nội tuyến của Next.js cần 'unsafe-inline',
 * các nguồn còn lại bị khóa chặt: không iframe, không object, form chỉ gửi về chính site.
 */
const imageHosts = ["https://images.unsplash.com", "https://*.public.blob.vercel-storage.com"];
const siteCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${imageHosts.join(" ")}`,
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Cho phép mở bản dev qua 127.0.0.1 (mặc định Next chỉ cho localhost tải tài nguyên dev/HMR)
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    // Ảnh Unsplash được resize trên CDN của Unsplash; ảnh Media dùng các cỡ Payload tạo sẵn (src/lib/image-loader.ts)
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  experimental: { globalNotFound: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Đường dẫn cũ chứa tên thương hiệu mẫu → chuyển hẳn về /gioi-thieu (giữ link cũ, menu đã lưu trong CMS)
  async redirects() {
    return [{ source: "/ve-buoc", destination: "/gioi-thieu", permanent: true }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/((?!admin|api).*)", headers: [{ key: "Content-Security-Policy", value: siteCsp }] },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
