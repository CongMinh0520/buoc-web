import type { MetadataRoute } from "next";
import { absUrl, siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // Môi trường preview/staging của Vercel: chặn index toàn bộ
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/tai-khoan", "/gio-hang", "/thanh-toan", "/thanh-toan-that-bai", "/dat-hang", "/tim-kiem", "/search-index.json"],
    },
    sitemap: absUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
