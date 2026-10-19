import { Img } from "@/components/ui/Img";
import { WorkshopHero } from "@/components/workshop/WorkshopHero";
import { BookingForm } from "@/components/workshop/BookingForm";
import { getStores, getWorkshop } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { getLocale, getT } from "@/i18n/server";

export async function generateMetadata() {
  const [w, locale, t] = await Promise.all([getWorkshop(), getLocale(), getT()]);
  return pageMeta({
    locale,
    title: w.meta?.title || t.workshop.metaTitle,
    description: w.meta?.description || w.intro?.slice(0, 160) || "",
    path: "/xuong-mo",
    image: w.heroImage,
  });
}

export default async function WorkshopPage() {
  const [w, stores] = await Promise.all([getWorkshop(), getStores()]);
  const g = (i: number) => w.gallery[i] ?? { src: null, alt: "" };

  return (
    <>
      <WorkshopHero src={w.heroImage} title={w.heroTitle} />

      <section className="mx-auto grid max-w-site gap-10 px-4 pt-20 sm:px-10 lg:grid-cols-[470px_1fr] lg:gap-12 lg:pt-24">
        <div>
          <div className="relative aspect-[470/626] bg-stone">
            <Img src={g(0).src} alt={g(0).alt} sizes="(min-width:1024px) 470px, 100vw" />
          </div>
          {w.quoteA && <blockquote className="mt-6 font-display text-[26px] leading-snug italic">“{w.quoteA}”</blockquote>}
        </div>
        <div>
          <p className="text-[17px] leading-[30px] text-black/75">{w.intro}</p>
          <div className="mt-12 grid gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="relative aspect-[677/290] bg-stone">
                <Img src={g(i).src} alt={g(i).alt} sizes="(min-width:1024px) 677px, 100vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-site gap-4 px-4 pt-20 sm:px-10 lg:grid-cols-[430px_1fr] lg:pt-24">
        <div className="relative aspect-[430/573] bg-stone">
          <Img src={g(3).src} alt={g(3).alt} sizes="(min-width:1024px) 430px, 100vw" />
        </div>
        <div className="flex flex-col">
          <div className="relative aspect-[749/488] bg-stone">
            <Img src={g(4).src} alt={g(4).alt} sizes="(min-width:1024px) 750px, 100vw" />
          </div>
          {w.quoteB && <blockquote className="mt-8 max-w-[600px] font-display text-[24px] leading-snug">{w.quoteB}</blockquote>}
        </div>
      </section>

      <section className="mx-auto max-w-site px-4 pt-20 sm:px-10 lg:pt-24">
        <div className="relative aspect-[16/9] bg-stone lg:aspect-[1195/504]">
          <Img src={g(5).src} alt={g(5).alt} sizes="100vw" />
        </div>
        <h2 className="mt-10 font-display text-[36px] leading-none font-medium">{w.benchTitle}</h2>
        <p className="mt-4 max-w-[760px] text-[15px] leading-[26px] text-black/70">{w.benchText}</p>
      </section>

      <section id="dat-lich" className="mt-24 scroll-mt-20 bg-paper py-20">
        <div className="mx-auto max-w-site px-4 sm:px-10">
          <h2 className="font-display text-[44px] leading-none font-medium">{w.bookingTitle}</h2>
          {w.bookingDesc && <p className="mt-3 max-w-[560px] text-[14px] leading-6 text-black/60">{w.bookingDesc}</p>}
          <div className="mt-10">
            <BookingForm sessions={w.sessions} stores={stores.map((s) => s.name)} note={w.bookingNote} />
          </div>
        </div>
      </section>
    </>
  );
}
