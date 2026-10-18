import type { Metadata } from "next";
import type { Article, Product, SiteSettings, Store } from "./types";
import { absUrl } from "./site-url";
import { defaultLocale, localePath, locales, ogLocale, type Locale } from "@/i18n/config";

/** Nhúng dữ liệu có cấu trúc (schema.org) — escape "<" để không thể chèn thẻ script */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organizationJsonLd = (s: SiteSettings) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: s.brandName,
  url: absUrl("/"),
  email: s.email || undefined,
  telephone: s.hotline || undefined,
  sameAs: s.socials.map((x) => x.href),
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[], locale: Locale = defaultLocale) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absUrl(localePath(locale, it.path)) })),
});

export const productJsonLd = (p: Product, brandName: string, locale: Locale = defaultLocale) => {
  const inStock = Object.values(p.stock).some((n) => n > 0);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description || p.subtitle,
    image: p.images.map(absUrl),
    sku: p.slug,
    brand: { "@type": "Brand", name: brandName },
    color: p.colors.map((c) => c.label).join(", "),
    offers: {
      "@type": "Offer",
      url: absUrl(localePath(locale, `/san-pham/${p.slug}`)),
      priceCurrency: "VND",
      price: p.price,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
};

export const articleJsonLd = (a: Article, brandName: string, locale: Locale = defaultLocale) => ({
  inLanguage: locale,
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.title,
  description: a.excerpt,
  image: a.image ? [absUrl(a.image)] : undefined,
  datePublished: a.dateISO,
  dateModified: a.updatedAt,
  author: { "@type": "Organization", name: brandName },
  publisher: { "@type": "Organization", name: brandName },
  mainEntityOfPage: absUrl(localePath(locale, `/tap-chi/${a.slug}`)),
});

export const storesJsonLd = (stores: Store[], brandName: string) =>
  stores.map((s) => ({
    "@context": "https://schema.org",
    "@type": "ShoeStore",
    name: s.name,
    brand: brandName,
    address: { "@type": "PostalAddress", streetAddress: s.address, addressCountry: "VN" },
    telephone: s.phone,
    openingHours: s.hours,
    image: s.image ? absUrl(s.image) : undefined,
  }));

/** canonical + hreflang cho một đường dẫn (không tiền tố) ở mọi ngôn ngữ */
export function alternatesFor(locale: Locale, path: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath(defaultLocale, path),
    },
  };
}

/** Metadata chuẩn cho một trang: title, description, canonical + hreflang, Open Graph */
export function pageMeta(opts: { locale: Locale; title: string; description?: string; path: string; image?: string | null; type?: "website" | "article"; noindex?: boolean }): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: alternatesFor(opts.locale, opts.path),
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: localePath(opts.locale, opts.path),
      locale: ogLocale[opts.locale],
      type: opts.type ?? "website",
      images: opts.image ? [{ url: absUrl(opts.image) }] : undefined,
    },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
  };
}

/** Bỏ hậu tố " | <Tên thương hiệu>" khỏi tiêu đề SEO (layout đã tự thêm theo template) */
export const stripBrand = (title: string | null | undefined, brandName: string) =>
  title && brandName && title.endsWith(` | ${brandName}`) ? title.slice(0, -(brandName.length + 3)) : (title ?? "");
