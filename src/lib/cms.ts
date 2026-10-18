/**
 * Lớp đọc dữ liệu từ Payload CMS cho website.
 *
 * Mọi hàm đều có 'use cache' + cacheTag: kết quả được prerender vào HTML tĩnh lúc build
 * và chỉ được tạo lại khi nội dung tương ứng thay đổi trong admin (xem payload/hooks/revalidate.ts).
 * Truy vấn dùng overrideAccess: false để áp đúng quyền công khai (chỉ thấy bản đã xuất bản).
 */
import { FALLBACK_BRAND_NAME } from "./brand";
import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Media } from "@/payload-types";
import type {
  Article,
  ArticleCategory,
  Line,
  LineRef,
  Lookbook,
  NavLink,
  Policy,
  Product,
  Promotion,
  SearchItem,
  SiteSettings,
  Store,
} from "./types";
import { formatDate, formatPeriod } from "./format";

export const getPayloadClient = () => getPayload({ config });

type ImageGroup = { media?: number | Media | null; url?: string | null } | null | undefined;
type Size = "thumb" | "card" | "hero" | "og";

/** Lấy URL ảnh: ưu tiên ảnh đã tải lên (đúng cỡ), sau đó URL ngoài */
export function imageUrl(g: ImageGroup, size: Size = "card"): string | null {
  const m = g?.media;
  if (m && typeof m === "object") return m.sizes?.[size]?.url || m.url || null;
  return g?.url || null;
}
const imageAlt = (g: ImageGroup) => (g?.media && typeof g.media === "object" ? g.media.alt : null);

const lineRef = (l: unknown): LineRef =>
  l && typeof l === "object" && "key" in l ? { key: String((l as unknown as { key: string }).key), label: String((l as unknown as { label: string }).label) } : { key: "", label: "" };

const published = { _status: { equals: "published" } } as const;

/* ───────── Cài đặt chung ───────── */
export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag("site");
  cacheLife("max");
  const payload = await getPayloadClient();
  const s = await payload.findGlobal({ slug: "site-settings", depth: 1, overrideAccess: false });
  const links = (arr?: { label: string; href: string }[] | null): NavLink[] => (arr ?? []).map(({ label, href }) => ({ label, href }));
  const c = s.company ?? {};
  const brandName = s.brandName || FALLBACK_BRAND_NAME;
  return {
    brandName,
    wordmark: s.wordmark || brandName,
    tagline: s.tagline ?? "",
    hotline: s.hotline ?? "",
    email: s.email ?? "",
    copyright: s.copyright ?? "",
    socials: links(s.socials),
    mainNav: links(s.mainNav),
    footerInfo: links(s.footerInfo),
    seoTitle: s.seoTitle || brandName,
    seoDescription: s.seoDescription ?? "",
    ogImage: imageUrl(s.ogImage, "og"),
    // Favicon dùng ảnh gốc (PNG), không dùng bản WebP thu nhỏ
    favicon: s.favicon?.media && typeof s.favicon.media === "object" ? (s.favicon.media.url ?? null) : (s.favicon?.url ?? null),
    company: {
      name: c.name ?? "",
      address: c.address ?? "",
      representative: c.representative ?? "",
      taxCode: c.taxCode ?? "",
      registrationNo: c.registrationNo ?? "",
      registrationIssued: c.registrationIssued ?? "",
      complaintPhone: c.complaintPhone ?? "",
      complaintEmail: c.complaintEmail ?? "",
    },
    priceNote: s.priceNote ?? "",
    orderPrefix: s.orderPrefix || "DH",
    productStory: {
      eyebrow: s.productStory?.eyebrow ?? "",
      title: s.productStory?.title ?? "",
      text: s.productStory?.text ?? "",
      ctaLabel: s.productStory?.ctaLabel ?? "",
      ctaHref: s.productStory?.ctaHref ?? "",
    },
  };
}

/* ───────── Dòng sản phẩm ───────── */
export async function getLines(): Promise<Line[]> {
  "use cache";
  cacheTag("catalog");
  cacheLife("max");
  const payload = await getPayloadClient();
  const res = await payload.find({ collection: "lines", sort: "order", limit: 50, depth: 1, overrideAccess: false });
  return res.docs.map((l) => ({
    key: l.key,
    label: l.label,
    overline: l.overline ?? "",
    intro: l.intro ?? "",
    tagline: l.tagline ?? "",
    tint: l.tint ?? "rgba(0,0,0,0)",
    hero: imageUrl(l.hero, "hero"),
    slides: (l.slides ?? []).map((s) => ({ src: imageUrl(s.image, "hero") ?? "", caption: s.caption ?? imageAlt(s.image) ?? "" })),
  }));
}

/* ───────── Sản phẩm ───────── */
type RawProduct = Awaited<ReturnType<Awaited<ReturnType<typeof getPayloadClient>>["find"]>>["docs"][number];

function mapProduct(p: RawProduct & Record<string, unknown>): Product {
  const doc = p as unknown as import("@/payload-types").Product;
  const sizes: string[] = [];
  const stock: Record<string, number> = {};
  for (const v of doc.variants ?? []) {
    if (!sizes.includes(v.size)) sizes.push(v.size);
    stock[`${v.color}|${v.size}`] = v.stock ?? 0;
  }
  return {
    id: doc.id,
    slug: doc.slug ?? String(doc.id),
    name: doc.name,
    subtitle: doc.subtitle ?? "",
    line: lineRef(doc.line),
    gender: doc.gender,
    price: doc.price,
    isNew: Boolean(doc.isNew),
    colors: (doc.colors ?? []).map(({ name, hex }) => ({ name, hex })),
    sizes,
    stock,
    images: (doc.images ?? []).map((i) => imageUrl(i.image, "card")).filter((x): x is string => Boolean(x)),
    description: doc.description ?? "",
    details: doc.details ?? "",
    sizing: doc.sizing ?? "",
    updatedAt: doc.updatedAt,
  };
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("catalog");
  cacheLife("max");
  const payload = await getPayloadClient();
  const res = await payload.find({ collection: "products", where: published, limit: 500, depth: 1, sort: "-isNew", overrideAccess: false });
  return res.docs.map((d) => mapProduct(d as never));
}

export async function getProduct(slug: string): Promise<Product | null> {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getSearchIndex(): Promise<SearchItem[]> {
  return (await getProducts()).map((p) => ({
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle,
    price: p.price,
    isNew: p.isNew,
    image: p.images[0] ?? null,
    lineLabel: p.line.label,
    colors: p.colors.map((c) => c.name),
  }));
}

/* ───────── Bộ sưu tập ───────── */
export async function getLookbooks(): Promise<Lookbook[]> {
  "use cache";
  cacheTag("catalog");
  cacheLife("max");
  const payload = await getPayloadClient();
  const res = await payload.find({ collection: "lookbooks", where: published, limit: 100, depth: 1, overrideAccess: false });
  return res.docs.map((l) => ({
    slug: l.slug ?? String(l.id),
    title: l.title,
    line: lineRef(l.line),
    desc: l.desc ?? "",
    image: imageUrl(l.image, "hero"),
    productSlugs: (l.products ?? []).map((p) => (typeof p === "object" ? (p.slug ?? "") : "")).filter(Boolean),
    updatedAt: l.updatedAt,
  }));
}

export async function getLookbook(slug: string) {
  return (await getLookbooks()).find((l) => l.slug === slug) ?? null;
}

/* ───────── Tạp chí ───────── */
export async function getArticles(): Promise<Article[]> {
  "use cache";
  cacheTag("articles");
  cacheLife("max");
  const payload = await getPayloadClient();
  const res = await payload.find({ collection: "articles", where: published, sort: "-publishedAt", limit: 200, depth: 2, overrideAccess: false });
  return res.docs.map((a) => ({
    slug: a.slug ?? String(a.id),
    title: a.title,
    excerpt: a.excerpt,
    category: a.category as ArticleCategory,
    date: formatDate(a.publishedAt),
    dateISO: a.publishedAt,
    updatedAt: a.updatedAt,
    image: imageUrl(a.cover, "hero"),
    content: (a.content as Article["content"]) ?? null,
  }));
}

export async function getArticle(slug: string) {
  return (await getArticles()).find((a) => a.slug === slug) ?? null;
}

/* ───────── Ưu đãi, chính sách, cửa hàng ───────── */
export async function getPromotions(): Promise<Promotion[]> {
  "use cache";
  cacheTag("promotions");
  cacheLife("max");
  const payload = await getPayloadClient();
  const res = await payload.find({ collection: "promotions", where: published, sort: "startDate", limit: 50, depth: 1, overrideAccess: false });
  return res.docs.map((p) => ({
    slug: p.slug ?? String(p.id),
    title: p.title,
    period: formatPeriod(p.startDate, p.endDate),
    desc: p.desc,
    image: imageUrl(p.image, "card"),
    href: p.href || "/danh-muc/tat-ca",
  }));
}

export async function getPolicies(): Promise<Policy[]> {
  "use cache";
  cacheTag("policies");
  cacheLife("max");
  const payload = await getPayloadClient();
  const res = await payload.find({ collection: "policies", where: published, sort: "order", limit: 50, overrideAccess: false });
  return res.docs.map((p) => ({
    slug: p.slug ?? String(p.id),
    title: p.title,
    version: p.version,
    effective: p.effectiveDate ? formatDate(p.effectiveDate) : null,
    updatedAt: p.updatedAt,
    content: p.content as Policy["content"],
  }));
}

export async function getStores(): Promise<Store[]> {
  "use cache";
  cacheTag("stores");
  cacheLife("max");
  const payload = await getPayloadClient();
  const res = await payload.find({ collection: "stores", sort: "order", limit: 100, depth: 1, overrideAccess: false });
  return res.docs.map((s) => ({
    name: s.name,
    region: s.region,
    footerRegion: s.footerRegion,
    address: s.address,
    phone: s.phone,
    hours: s.hours,
    image: imageUrl(s.image, "card"),
  }));
}

/* ───────── Trang (globals) ───────── */
export async function getHome() {
  "use cache";
  cacheTag("home");
  cacheTag("catalog");
  cacheLife("max");
  const payload = await getPayloadClient();
  const h = await payload.findGlobal({ slug: "home", depth: 2, overrideAccess: false });
  return {
    hero: { ...h.hero, image: imageUrl(h.hero?.image, "hero") },
    lineSections: (h.lineSections ?? []).map((s) => ({
      line: lineRef(s.line),
      lookbooks: (s.lookbooks ?? [])
        .filter((l): l is Exclude<typeof l, number> => typeof l === "object" && l?._status === "published")
        .map((l) => ({ slug: l.slug ?? "", title: l.title, desc: l.desc ?? "", image: imageUrl(l.image, "hero"), lineLabel: lineRef(l.line).label })),
    })),
    storeBanner: { ...h.storeBanner, image: imageUrl(h.storeBanner?.image, "hero") },
    quote: { ...h.quote, image: imageUrl(h.quote?.image, "hero") },
    closing: { ...h.closing, line: h.closing?.line ? lineRef(h.closing.line) : null, image: imageUrl(h.closing?.image, "hero") },
    journal: h.journal ?? {},
    meta: h.meta ?? null,
  };
}

export async function getAbout() {
  "use cache";
  cacheTag("about");
  cacheLife("max");
  const payload = await getPayloadClient();
  const a = await payload.findGlobal({ slug: "about", depth: 1, overrideAccess: false });
  return {
    ...a,
    heroImage: imageUrl(a.heroImage, "hero"),
    wideImage: imageUrl(a.wideImage, "hero"),
    heritageImage: imageUrl(a.heritageImage, "hero"),
    milestones: (a.milestones ?? []).map((m) => ({ year: m.year, title: m.title, text: m.text ?? "", image: imageUrl(m.image, "card") })),
    facts: (a.facts ?? []).map((f) => ({ label: f.label, value: f.value })),
  };
}

export async function getWorkshop() {
  "use cache";
  cacheTag("workshop");
  cacheLife("max");
  const payload = await getPayloadClient();
  const w = await payload.findGlobal({ slug: "workshop", depth: 1, overrideAccess: false });
  return {
    ...w,
    heroImage: imageUrl(w.heroImage, "hero"),
    gallery: (w.gallery ?? []).map((g) => ({ src: imageUrl(g.image, "hero"), alt: g.alt ?? "" })),
    sessions: (w.sessions ?? []).map((s) => ({ title: s.title, day: s.day, time: s.time, seats: s.seats ?? 0 })),
  };
}
