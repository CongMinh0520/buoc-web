import type { MetadataRoute } from "next";
import { getArticles, getLines, getLookbooks, getProducts } from "@/lib/cms";
import { absUrl } from "@/lib/site-url";
import { categories } from "@/lib/categories";

// Sinh lại cùng các tag CMS (catalog/articles) — xem src/lib/cms.ts
const img = (src: string | null | undefined) => (src ? [src.startsWith("/") ? absUrl(src) : src] : undefined);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, lines, lookbooks, articles] = await Promise.all([getProducts(), getLines(), getLookbooks(), getArticles()]);
  const latest = (xs: { updatedAt: string }[]) => xs.reduce<string | undefined>((m, x) => (!m || x.updatedAt > m ? x.updatedAt : m), undefined);
  const catalogUpdated = latest(products);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absUrl("/"), changeFrequency: "daily", priority: 1, lastModified: catalogUpdated },
    { url: absUrl("/gioi-thieu"), changeFrequency: "monthly", priority: 0.6 },
    { url: absUrl("/xuong-mo"), changeFrequency: "monthly", priority: 0.6 },
    { url: absUrl("/tap-chi"), changeFrequency: "weekly", priority: 0.7, lastModified: latest(articles) },
    { url: absUrl("/uu-dai"), changeFrequency: "weekly", priority: 0.6 },
    { url: absUrl("/chinh-sach"), changeFrequency: "yearly", priority: 0.3 },
    { url: absUrl("/tra-cuu-don-hang"), changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...staticPages,
    ...Object.keys(categories).map((slug) => ({ url: absUrl(`/danh-muc/${slug}`), changeFrequency: "daily" as const, priority: 0.8, lastModified: catalogUpdated })),
    ...lines.map((l) => ({ url: absUrl(`/dong/${l.key}`), changeFrequency: "weekly" as const, priority: 0.7, images: img(l.hero) })),
    ...products.map((p) => ({ url: absUrl(`/san-pham/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.9, images: img(p.images[0]) })),
    ...lookbooks.map((b) => ({ url: absUrl(`/bo-suu-tap/${b.slug}`), lastModified: b.updatedAt, changeFrequency: "monthly" as const, priority: 0.6, images: img(b.image) })),
    ...articles.map((a) => ({ url: absUrl(`/tap-chi/${a.slug}`), lastModified: a.updatedAt, changeFrequency: "monthly" as const, priority: 0.6, images: img(a.image) })),
  ];
}
