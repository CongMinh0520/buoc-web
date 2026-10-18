import { notFound } from "next/navigation";
import { ArticleView } from "@/components/journal/ArticleView";
import { getArticle, getArticles, getSiteSettings } from "@/lib/cms";
import { articleJsonLd, breadcrumbJsonLd, JsonLd, pageMeta } from "@/lib/seo";
import { atLeastOne } from "@/lib/static-params";

export async function generateStaticParams() {
  return atLeastOne("slug", (await getArticles()).map((a) => a.slug));
}

export async function generateMetadata({ params }: PageProps<"/tap-chi/[slug]">) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  return {
    ...pageMeta({ title: a.title, description: a.excerpt, path: `/tap-chi/${a.slug}`, image: a.image, type: "article" }),
    other: { "article:published_time": a.dateISO },
  };
}

export default async function ArticlePage({ params }: PageProps<"/tap-chi/[slug]">) {
  const { slug } = await params;
  const [all, s] = await Promise.all([getArticles(), getSiteSettings()]);
  const article = all.find((a) => a.slug === slug);
  if (!article) notFound();
  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(article, s.brandName),
          breadcrumbJsonLd([
            { name: "Trang chủ", path: "/" },
            { name: "Tạp chí", path: "/tap-chi" },
            { name: article.title, path: `/tap-chi/${article.slug}` },
          ]),
        ]}
      />
      <ArticleView article={article} related={all.filter((a) => a.slug !== slug).slice(0, 3)} />
    </>
  );
}
