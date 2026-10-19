import { Img } from "@/components/ui/Img";
import { StoreFinder } from "@/components/about/StoreFinder";
import { getAbout, getSiteSettings, getStores } from "@/lib/cms";
import { JsonLd, pageMeta, storesJsonLd } from "@/lib/seo";
import { getLocale, getT } from "@/i18n/server";

export async function generateMetadata() {
  const [a, locale] = await Promise.all([getAbout(), getLocale()]);
  return pageMeta({ locale, title: a.meta?.title || a.title, description: a.meta?.description || a.originText?.slice(0, 160) || "", path: "/gioi-thieu", image: a.heroImage });
}

export default async function AboutPage() {
  const [a, stores, s, t] = await Promise.all([getAbout(), getStores(), getSiteSettings(), getT()]);
  return (
    <>
      <JsonLd data={storesJsonLd(stores, s.brandName)} />
      <section className="mx-auto max-w-site px-4 pt-14 sm:px-10">
        <header className="text-center">
          <h1 className="font-display text-[48px] leading-none font-medium sm:text-[64px]">{a.title}</h1>
          {a.subtitle && <p className="mt-4 text-[14px] text-black/55">{a.subtitle}</p>}
        </header>
        <div className="relative mt-12 aspect-[4/3] bg-stone lg:aspect-[16/10]">
          <Img src={a.heroImage} alt={a.title} priority sizes="(min-width:1280px) 1200px, 100vw" />
        </div>
        {a.quote && (
          <>
            <p className="mt-12 text-center text-[14px] text-black/40" aria-hidden>
              ✦
            </p>
            <blockquote className="mx-auto mt-8 max-w-[816px] text-center font-display text-[28px] leading-snug italic sm:text-[34px]">“{a.quote}”</blockquote>
          </>
        )}
        {a.originText && (
          <div className="mx-auto mt-16 max-w-[912px] text-center">
            <h2 className="font-display text-[32px] font-medium">{a.originTitle}</h2>
            <p className="mt-4 text-[15px] leading-[27px] text-black/70">{a.originText}</p>
          </div>
        )}
      </section>

      {a.wideImage && (
        <section className="mx-auto mt-24 max-w-site px-4 sm:px-5">
          <div className="relative aspect-[16/9] bg-stone lg:aspect-[1240/698]">
            <Img src={a.wideImage} alt={a.wideCaption ?? ""} sizes="100vw" />
          </div>
          {a.wideCaption && <p className="mx-auto mt-6 max-w-[580px] text-center text-[13px] leading-[22px] text-black/55">{a.wideCaption}</p>}
        </section>
      )}

      {a.milestones.length > 0 && (
        <section className="mx-auto mt-24 max-w-site px-4 sm:px-10">
          <h2 className="text-center text-[14px] font-normal tracking-[0.04em] text-black/60">{a.milestonesTitle}</h2>
          <ol className="mt-10 grid gap-3 md:grid-cols-3">
            {a.milestones.map((m) => (
              <li key={m.year} className="relative aspect-[390/520] overflow-hidden bg-ink-2 text-white">
                <Img src={m.image} alt={m.title} sizes="(min-width:768px) 33vw, 100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-6 bottom-6">
                  <p className="font-display text-[56px] leading-none font-medium tabular-nums">{m.year}</p>
                  <h3 className="mt-2 text-[13px] font-medium tracking-[0.08em] uppercase">{m.title}</h3>
                  <p className="mt-2 text-[13px] leading-5 text-white/75">{m.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mx-auto mt-24 max-w-site px-4 sm:px-5">
        <div className="mx-auto max-w-[620px] text-center">
          {a.heritageEyebrow && <p className="eyebrow text-black/45">{a.heritageEyebrow}</p>}
          <h2 className="mt-3 font-display text-[36px] leading-tight font-medium">{a.heritageTitle}</h2>
        </div>
        <div className="relative mt-10 aspect-[16/10] bg-stone lg:aspect-[1240/727]">
          <Img src={a.heritageImage} alt={a.heritageTitle ?? ""} sizes="100vw" />
        </div>
        {a.heritageText && <p className="mx-auto mt-8 max-w-[720px] text-center text-[15px] leading-[27px] text-black/70">{a.heritageText}</p>}
        {a.facts.length > 0 && (
          <dl className="mt-12 grid border-y border-black sm:grid-cols-3">
            {a.facts.map((f, i) => (
              <div key={f.label} className={`px-6 py-8 text-center ${i > 0 ? "border-t border-black sm:border-t-0 sm:border-l" : ""}`}>
                <dt className="eyebrow text-black/45">{f.label}</dt>
                <dd className="mt-2 font-display text-[26px] font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section id="cua-hang" className="mx-auto mt-24 mb-24 max-w-site scroll-mt-20 px-4 sm:px-5">
        <h2 className="mb-8 text-center font-display text-[40px] font-medium">{t.stores.title}</h2>
        <StoreFinder stores={stores} />
      </section>
    </>
  );
}
