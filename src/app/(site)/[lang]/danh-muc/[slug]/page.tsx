import { notFound } from "next/navigation";
import { CategoryPageView } from "@/components/category/CategoryPageView";
import { categories, isCategory } from "@/lib/categories";
import { getProducts } from "@/lib/cms";
import { breadcrumbJsonLd, JsonLd, pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/danh-muc/[slug]">) {
  const { slug } = await params;
  if (!isCategory(slug)) return {};
  const c = categories[slug];
  return pageMeta({ title: `Giày ${c.title.toLowerCase()}`, description: c.description, path: `/danh-muc/${slug}` });
}

export default async function CategoryPage({ params }: PageProps<"/danh-muc/[slug]">) {
  const { slug } = await params;
  if (!isCategory(slug)) notFound();
  const cat = categories[slug];
  const products = (await getProducts()).filter(cat.filter);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", path: "/" }, { name: cat.title, path: `/danh-muc/${slug}` }])} />
      <CategoryPageView slug={slug} title={cat.title} products={products} />
    </>
  );
}
