import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection/CollectionView";
import { getLines, getLookbook, getLookbooks, getProducts } from "@/lib/cms";
import { breadcrumbJsonLd, JsonLd, pageMeta } from "@/lib/seo";
import { atLeastOne } from "@/lib/static-params";
import { getLocale, getT } from "@/i18n/server";

export async function generateStaticParams() {
  return atLeastOne("slug", (await getLookbooks()).map((c) => c.slug));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/bo-suu-tap/[slug]">) {
  const { slug } = await params;
  const [c, locale, t] = await Promise.all([getLookbook(slug), getLocale(), getT()]);
  if (!c) return {};
  return pageMeta({ locale, title: t.collection.metaTitle(c.title), description: c.desc.slice(0, 160), path: `/bo-suu-tap/${c.slug}`, image: c.image });
}

export default async function CollectionPage({ params }: PageProps<"/[lang]/bo-suu-tap/[slug]">) {
  const { slug } = await params;
  const [collection, all, lines, locale, t] = await Promise.all([getLookbook(slug), getProducts(), getLines(), getLocale(), getT()]);
  if (!collection) notFound();
  const products = collection.productSlugs.map((s) => all.find((p) => p.slug === s)).filter((p) => p !== undefined);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.common.home, path: "/" },
          { name: collection.line.label, path: `/dong/${collection.line.key}` },
          { name: collection.title, path: `/bo-suu-tap/${collection.slug}` },
        ], locale)}
      />
      <CollectionView collection={collection} products={products} lines={lines} />
    </>
  );
}
