import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { getPayloadClient, getProduct, getProducts, getSiteSettings } from "@/lib/cms";
import { ProductPageView } from "@/components/product/ProductPageView";
import { breadcrumbJsonLd, JsonLd, pageMeta, productJsonLd, stripBrand } from "@/lib/seo";
import { atLeastOne } from "@/lib/static-params";
import { getLocale, getT } from "@/i18n/server";
import { defaultLocale, type Locale } from "@/i18n/config";

export async function generateStaticParams() {
  return atLeastOne("slug", (await getProducts()).map((p) => p.slug));
}

/** Đọc phần SEO (meta) do biên tập viên nhập trong tab SEO của sản phẩm */
async function getProductSeo(slug: string, locale: Locale) {
  "use cache";
  cacheTag("catalog");
  cacheLife("max");
  const payload = await getPayloadClient();
  const res = await payload.find({ collection: "products", where: { slug: { equals: slug }, _status: { equals: "published" } }, limit: 1, depth: 1, overrideAccess: false, locale, fallbackLocale: defaultLocale });
  return res.docs[0]?.meta ?? null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/san-pham/[slug]">) {
  const { slug } = await params;
  const locale = await getLocale();
  const [p, meta, s] = await Promise.all([getProduct(slug), getProductSeo(slug, locale), getSiteSettings()]);
  if (!p) return {};
  const metaImage = meta?.image && typeof meta.image === "object" ? (meta.image.sizes?.og?.url ?? meta.image.url) : null;
  return pageMeta({
    locale,
    // Layout tự ghép "| Tên thương hiệu" → bỏ hậu tố này nếu biên tập viên đã gõ sẵn
    title: stripBrand(meta?.title, s.brandName) || p.name,
    description: meta?.description || `${p.subtitle}. ${p.description}`.slice(0, 160),
    path: `/san-pham/${p.slug}`,
    image: metaImage || p.images[0],
  });
}

export default async function ProductPage({ params }: PageProps<"/[lang]/san-pham/[slug]">) {
  const { slug } = await params;
  const [product, all, s, locale, t] = await Promise.all([getProduct(slug), getProducts(), getSiteSettings(), getLocale(), getT()]);
  if (!product) notFound();

  const related = [
    ...all.filter((p) => p.slug !== product.slug && p.line.key === product.line.key),
    ...all.filter((p) => p.slug !== product.slug && p.line.key !== product.line.key && p.gender === product.gender),
  ].slice(0, 4);

  const cat = product.gender === "nu" ? { name: t.common.genders.nu, path: "/danh-muc/nu" } : { name: t.common.genders.nam, path: "/danh-muc/nam" };
  return (
    <>
      <JsonLd
        data={[
          productJsonLd(product, s.brandName, locale),
          breadcrumbJsonLd([{ name: t.common.home, path: "/" }, cat, { name: product.name, path: `/san-pham/${product.slug}` }], locale),
        ]}
      />
      <ProductPageView product={product} related={related} priceNote={s.priceNote} story={s.productStory} />
    </>
  );
}
