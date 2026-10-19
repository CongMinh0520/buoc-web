import type { MetadataRoute } from "next";
import { absUrl, siteUrl } from "@/lib/site-url";

// Trang riêng tư / không cần index (cả bản tiếng Việt lẫn /en/…)
const privatePaths = ["/tai-khoan", "/gio-hang", "/thanh-toan", "/thanh-toan-that-bai", "/dat-hang", "/tim-kiem", "/search-index.json"];

export default function robots(): MetadataRoute.Robots {
  // Môi trường preview/staging của Vercel: chặn index toàn bộ
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", ...privatePaths, ...privatePaths.map((p) => `/en${p}`)],
    },
    sitemap: absUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
