import { notFound } from "next/navigation";
import { CategoryPageView } from "@/components/category/CategoryPageView";
import { categories, isCategory } from "@/lib/categories";
import { getProducts } from "@/lib/cms";
import { breadcrumbJsonLd, JsonLd, pageMeta } from "@/lib/seo";
import { getLocale, getT } from "@/i18n/server";

export function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/danh-muc/[slug]">) {
  const { slug } = await params;
  if (!isCategory(slug)) return {};
  const [locale, t] = await Promise.all([getLocale(), getT()]);
  const c = t.category.names[slug];
  return pageMeta({ locale, title: c.meta, description: c.description, path: `/danh-muc/${slug}` });
}

export default async function CategoryPage({ params }: PageProps<"/[lang]/danh-muc/[slug]">) {
  const { slug } = await params;
  if (!isCategory(slug)) notFound();
  const [all, locale, t] = await Promise.all([getProducts(), getLocale(), getT()]);
  const products = all.filter(categories[slug].filter);
  const cat = t.category.names[slug];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: t.common.home, path: "/" }, { name: cat.title, path: `/danh-muc/${slug}` }], locale)} />
      <CategoryPageView slug={slug} title={cat.title} products={products} />
    </>
  );
}
