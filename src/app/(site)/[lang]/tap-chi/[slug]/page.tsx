import { notFound } from "next/navigation";
import { ArticleView } from "@/components/journal/ArticleView";
import { getArticle, getArticles, getSiteSettings } from "@/lib/cms";
import { articleJsonLd, breadcrumbJsonLd, JsonLd, pageMeta } from "@/lib/seo";
import { atLeastOne } from "@/lib/static-params";
import { getLocale, getT } from "@/i18n/server";

export async function generateStaticParams() {
  return atLeastOne("slug", (await getArticles()).map((a) => a.slug));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/tap-chi/[slug]">) {
  const { slug } = await params;
  const [a, locale] = await Promise.all([getArticle(slug), getLocale()]);
  if (!a) return {};
  return {
    ...pageMeta({ locale, title: a.title, description: a.excerpt, path: `/tap-chi/${a.slug}`, image: a.image, type: "article" }),
    other: { "article:published_time": a.dateISO },
  };
}

export default async function ArticlePage({ params }: PageProps<"/[lang]/tap-chi/[slug]">) {
  const { slug } = await params;
  const [all, s, locale, t] = await Promise.all([getArticles(), getSiteSettings(), getLocale(), getT()]);
  const article = all.find((a) => a.slug === slug);
  if (!article) notFound();
  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(article, s.brandName, locale),
          breadcrumbJsonLd([
            { name: t.common.home, path: "/" },
            { name: t.journal.title, path: "/tap-chi" },
            { name: article.title, path: `/tap-chi/${article.slug}` },
          ], locale),
        ]}
      />
      <ArticleView article={article} related={all.filter((a) => a.slug !== slug).slice(0, 3)} />
    </>
  );
}
