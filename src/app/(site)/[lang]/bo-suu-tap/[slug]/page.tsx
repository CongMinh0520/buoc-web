import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection/CollectionView";
import { getLines, getLookbook, getLookbooks, getProducts } from "@/lib/cms";
import { breadcrumbJsonLd, JsonLd, pageMeta } from "@/lib/seo";
import { atLeastOne } from "@/lib/static-params";

export async function generateStaticParams() {
  return atLeastOne("slug", (await getLookbooks()).map((c) => c.slug));
}

export async function generateMetadata({ params }: PageProps<"/bo-suu-tap/[slug]">) {
  const { slug } = await params;
  const c = await getLookbook(slug);
  if (!c) return {};
  return pageMeta({ title: `Bộ sưu tập ${c.title}`, description: c.desc.slice(0, 160), path: `/bo-suu-tap/${c.slug}`, image: c.image });
}

export default async function CollectionPage({ params }: PageProps<"/bo-suu-tap/[slug]">) {
  const { slug } = await params;
  const [collection, all, lines] = await Promise.all([getLookbook(slug), getProducts(), getLines()]);
  if (!collection) notFound();
  const products = collection.productSlugs.map((s) => all.find((p) => p.slug === s)).filter((p) => p !== undefined);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: collection.line.label, path: `/dong/${collection.line.key}` },
          { name: collection.title, path: `/bo-suu-tap/${collection.slug}` },
        ])}
      />
      <CollectionView collection={collection} products={products} lines={lines} />
    </>
  );
}
