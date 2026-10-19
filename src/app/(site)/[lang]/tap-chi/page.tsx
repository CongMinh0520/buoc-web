import { PageIntro } from "@/components/ui/PageIntro";
import { JournalList } from "@/components/journal/JournalList";
import { getArticles, getSiteSettings } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { getLocale, getT } from "@/i18n/server";

export async function generateMetadata() {
  const [s, locale, t] = await Promise.all([getSiteSettings(), getLocale(), getT()]);
  return pageMeta({ locale, title: t.journal.title, description: t.journal.metaDesc(s.brandName), path: "/tap-chi" });
}

export default async function JournalPage() {
  const [articles, s, t] = await Promise.all([getArticles(), getSiteSettings(), getT()]);
  return (
    <div className="bg-paper pb-24">
      <PageIntro title={t.journal.title} desc={t.journal.intro(s.brandName)} />
      <div className="mx-auto max-w-site px-4 sm:px-10">
        <JournalList articles={articles.map((a) => ({ ...a, content: null }))} />
      </div>
    </div>
  );
}
