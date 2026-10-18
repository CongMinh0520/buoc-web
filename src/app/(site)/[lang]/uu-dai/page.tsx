import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { Img } from "@/components/ui/Img";
import { getPromotions, getSiteSettings } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata() {
  const s = await getSiteSettings();
  return pageMeta({ title: "Ưu đãi", description: `Các chương trình ưu đãi đang diễn ra tại ${s.brandName}.`, path: "/uu-dai" });
}

export default async function PromotionsPage() {
  const [promotions, s] = await Promise.all([getPromotions(), getSiteSettings()]);
  return (
    <div className="bg-paper pb-20">
      <PageIntro title="Chương trình ưu đãi" desc={`Những ưu đãi dành cho khách hàng ${s.brandName} — từ quà tặng theo mùa đến đặc quyền của thành viên.`} />
      <div className="mx-auto max-w-site px-4 sm:px-10">
        {promotions.length === 0 ? (
          <p className="py-16 text-center text-[14px] text-black/55">Hiện chưa có chương trình nào. Hãy quay lại sau nhé.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.map((p) => (
              <li key={p.slug} className="flex flex-col bg-white">
                <div className="relative aspect-[16/10] bg-stone">
                  <Img src={p.image} alt={p.title} sizes="(min-width:1024px) 33vw, 50vw" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-[26px] leading-tight font-medium">{p.title}</h2>
                  <p className="mt-2 text-[11px] tracking-[0.08em] text-black/45">{p.period}</p>
                  <p className="mt-4 text-[13px] leading-[21px] text-black/65">{p.desc}</p>
                  <Link href={p.href} className="eyebrow mt-auto pt-6 text-black/55 hover:text-black hover:underline">
                    Khám phá
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="eyebrow mt-10 text-center text-black/40">Tổng cộng {promotions.length} chương trình</p>
      </div>
    </div>
  );
}
