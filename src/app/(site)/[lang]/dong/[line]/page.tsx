import { notFound } from "next/navigation";
import { LineView } from "@/components/line/LineView";
import { getLines, getProducts } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { atLeastOne } from "@/lib/static-params";

export async function generateStaticParams() {
  return atLeastOne("line", (await getLines()).map((l) => l.key));
}

export async function generateMetadata({ params }: PageProps<"/dong/[line]">) {
  const { line } = await params;
  const l = (await getLines()).find((x) => x.key === line);
  if (!l) return {};
  return pageMeta({ title: `Dòng ${l.label} — ${l.tagline || l.overline}`, description: l.intro, path: `/dong/${l.key}`, image: l.hero });
}

export default async function LinePage({ params }: PageProps<"/dong/[line]">) {
  const { line } = await params;
  const [lines, products] = await Promise.all([getLines(), getProducts()]);
  const l = lines.find((x) => x.key === line);
  if (!l) notFound();
  return <LineView line={l} lines={lines} products={products.filter((p) => p.line.key === l.key)} />;
}
