import type { MetadataRoute } from "next";
import { getArticles, getLines, getLookbooks, getProducts } from "@/lib/cms";
import { absUrl } from "@/lib/site-url";
import { categories } from "@/lib/categories";
import { defaultLocale, localePath, locales } from "@/i18n/config";

// Sinh lại cùng các tag CMS (catalog/articles) — xem src/lib/cms.ts
const img = (src: string | null | undefined) => (src ? [src.startsWith("/") ? absUrl(src) : src] : undefined);

/** Mỗi trang xuất hiện một lần cho mỗi ngôn ngữ, kèm liên kết hreflang tới các bản còn lại */
const forEachLocale = (entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap =>
  entries.flatMap((e) => {
    const path = e.url;
    const languages = Object.fromEntries(locales.map((l) => [l, absUrl(localePath(l, path))]));
    return locales.map((l) => ({ ...e, url: absUrl(localePath(l, path)), alternates: { languages } }));
  });

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Slug giống nhau ở mọi ngôn ngữ → chỉ cần đọc danh mục một lần (bản mặc định)
  const l = defaultLocale;
  const [products, lines, lookbooks, articles] = await Promise.all([getProducts(l), getLines(l), getLookbooks(l), getArticles(l)]);
  const latest = (xs: { updatedAt: string }[]) => xs.reduce<string | undefined>((m, x) => (!m || x.updatedAt > m ? x.updatedAt : m), undefined);
  const catalogUpdated = latest(products);

  const staticPages: MetadataRoute.Sitemap = [
    { url: "/", changeFrequency: "daily", priority: 1, lastModified: catalogUpdated },
    { url: "/gioi-thieu", changeFrequency: "monthly", priority: 0.6 },
    { url: "/xuong-mo", changeFrequency: "monthly", priority: 0.6 },
    { url: "/tap-chi", changeFrequency: "weekly", priority: 0.7, lastModified: latest(articles) },
    { url: "/uu-dai", changeFrequency: "weekly", priority: 0.6 },
    { url: "/chinh-sach", changeFrequency: "yearly", priority: 0.3 },
    { url: "/tra-cuu-don-hang", changeFrequency: "yearly", priority: 0.2 },
  ];

  return forEachLocale([
    ...staticPages,
    ...Object.keys(categories).map((slug) => ({ url: `/danh-muc/${slug}`, changeFrequency: "daily" as const, priority: 0.8, lastModified: catalogUpdated })),
    ...lines.map((l) => ({ url: `/dong/${l.key}`, changeFrequency: "weekly" as const, priority: 0.7, images: img(l.hero) })),
    ...products.map((p) => ({ url: `/san-pham/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.9, images: img(p.images[0]) })),
    ...lookbooks.map((b) => ({ url: `/bo-suu-tap/${b.slug}`, lastModified: b.updatedAt, changeFrequency: "monthly" as const, priority: 0.6, images: img(b.image) })),
    ...articles.map((a) => ({ url: `/tap-chi/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "monthly" as const, priority: 0.6, images: img(a.image) })),
  ]);
}
