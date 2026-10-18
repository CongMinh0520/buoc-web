import { PageIntro } from "@/components/ui/PageIntro";
import { JournalList } from "@/components/journal/JournalList";
import { getArticles, getSiteSettings } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata() {
  const s = await getSiteSettings();
  return pageMeta({ title: "Tạp chí", description: `Chuyện nghề, cách chăm sóc sản phẩm và các sự kiện tại ${s.brandName}.`, path: "/tap-chi" });
}

export default async function JournalPage() {
  const [articles, s] = await Promise.all([getArticles(), getSiteSettings()]);
  return (
    <div className="bg-paper pb-24">
      <PageIntro title="Tạp chí" desc={`Chuyện nghề, cách chăm sóc sản phẩm và những sự kiện sắp diễn ra tại ${s.brandName}.`} />
      <div className="mx-auto max-w-site px-4 sm:px-10">
        <JournalList articles={articles.map((a) => ({ ...a, content: null }))} />
      </div>
    </div>
  );
}
