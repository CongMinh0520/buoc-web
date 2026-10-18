import Link from "next/link";
import type { Metadata } from "next";
import { Img } from "@/components/ui/Img";
import { CollectionCard, LineIntro, TintedSection } from "@/components/home/HomeBlocks";
import { getArticles, getHome, getLines, getSiteSettings } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [home, s] = await Promise.all([getHome(), getSiteSettings()]);
  return {
    ...pageMeta({ title: home.meta?.title || s.seoTitle, description: home.meta?.description || s.seoDescription, path: "/", image: home.hero.image }),
    title: { absolute: home.meta?.title || s.seoTitle },
  };
}

type Card = { slug: string; title: string; desc: string; image: string | null; lineLabel: string };

/** Bố cục thẻ theo số lượng: 2 thẻ dọc + 1 thẻ ngang, hoặc 3 thẻ + 2 thẻ (giống design) */
function CardGrid({ cards }: { cards: Card[] }) {
  const tall = (c: Card, sizes = "50vw") => (
    <CollectionCard key={c.slug} href={`/bo-suu-tap/${c.slug}`} image={c.image ?? ""} line={c.lineLabel} title={c.title} desc={c.desc} className="aspect-[3/4]" sizes={sizes} />
  );
  if (cards.length >= 5) {
    return (
      <>
        <div className="mx-auto mt-12 grid max-w-site gap-6 px-4 sm:px-12 md:grid-cols-3">{cards.slice(0, 3).map((c) => tall(c, "(min-width:768px) 33vw, 100vw"))}</div>
        <div className="mx-auto mt-6 grid max-w-site gap-6 px-4 sm:px-12 md:grid-cols-2">{cards.slice(3, 5).map((c) => tall(c))}</div>
      </>
    );
  }
  return (
    <div className="mx-auto mt-12 grid max-w-site gap-6 px-4 sm:px-12 md:grid-cols-2">
      {cards.slice(0, 2).map((c) => tall(c))}
      {cards[2] && (
        <CollectionCard
          href={`/bo-suu-tap/${cards[2].slug}`}
          image={cards[2].image ?? ""}
          line={cards[2].lineLabel}
          title={cards[2].title}
          desc={cards[2].desc}
          className="aspect-[4/5] sm:aspect-[2/1] md:col-span-2"
          sizes="100vw"
        />
      )}
    </div>
  );
}

export default async function HomePage() {
  const [home, lines, articles] = await Promise.all([getHome(), getLines(), getArticles()]);
  const lineOf = (key: string) => lines.find((l) => l.key === key);
  const [first, second, ...rest] = home.lineSections;
  const closingLine = home.closing.line ? lineOf(home.closing.line.key) : undefined;

  const section = (s: (typeof home.lineSections)[number]) => {
    const line = lineOf(s.line.key);
    if (!line) return null;
    return (
      <TintedSection key={line.key} tint={line.tint}>
        <LineIntro line={line} />
        <CardGrid cards={s.lookbooks} />
      </TintedSection>
    );
  };

  return (
    <>
      {/* HERO */}
      <section className="relative h-[100svh] max-h-[820px] min-h-[600px] overflow-hidden bg-ink-2">
        <Img src={home.hero.image} alt={home.hero.title} priority sizes="100vw" />
        <div className="absolute inset-0 bg-ink-2/40" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-14 text-center text-white">
          {home.hero.overline && <p className="eyebrow">{home.hero.overline}</p>}
          <h1 className="mt-4 font-display text-[44px] leading-none font-medium tracking-[0.04em] uppercase sm:text-[64px]">{home.hero.title}</h1>
          {home.hero.ctaLabel && home.hero.ctaHref && (
            <Link href={home.hero.ctaHref} className="mt-7 border border-white/80 px-7 py-3 text-[11px] tracking-[0.18em] uppercase transition-colors hover:bg-white hover:text-black">
              {home.hero.ctaLabel}
            </Link>
          )}
        </div>
      </section>

      {first && section(first)}

      {/* KHÔNG GIAN CỬA HÀNG */}
      {home.storeBanner.text && (
        <section className="relative h-[420px] overflow-hidden lg:h-[548px]">
          <Img src={home.storeBanner.image} alt={home.storeBanner.text} sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-site flex-col gap-4 px-4 pb-12 text-white sm:flex-row sm:items-end sm:justify-between sm:px-10 lg:pb-16">
            <div>
              {home.storeBanner.eyebrow && <p className="eyebrow text-gold">{home.storeBanner.eyebrow}</p>}
              <p className="mt-2 max-w-[560px] font-display text-[32px] leading-[1.1] font-medium sm:text-[40px]">{home.storeBanner.text}</p>
            </div>
            {home.storeBanner.ctaHref && (
              <Link href={home.storeBanner.ctaHref} className="label-caps shrink-0 underline underline-offset-4">
                {home.storeBanner.ctaLabel}
              </Link>
            )}
          </div>
        </section>
      )}

      {second && section(second)}

      {/* TRÍCH DẪN */}
      {home.quote.text && (
        <section className="relative h-[520px] overflow-hidden lg:h-[664px]">
          <Img src={home.quote.image} alt="" sizes="100vw" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            {home.quote.eyebrow && <p className="eyebrow text-gold">{home.quote.eyebrow}</p>}
            <blockquote className="mt-5 max-w-[760px] font-display text-[34px] leading-[1.15] font-normal italic sm:text-[48px]">“{home.quote.text}”</blockquote>
            {home.quote.cite && <p className="label-caps mt-6 text-white/75">— {home.quote.cite}</p>}
          </div>
        </section>
      )}

      {rest.map(section)}

      {/* DÒNG KẾT (Chậm) */}
      {closingLine && (
        <section className="bg-white pt-16 lg:pt-24">
          <LineIntro line={closingLine} />
          <Link href={`/dong/${closingLine.key}`} className="group relative mt-10 block h-[460px] overflow-hidden lg:h-[640px]">
            <div className="absolute inset-0 opacity-85">
              <Img src={home.closing.image} alt={closingLine.label} sizes="100vw" className="transition-transform duration-[1500ms] group-hover:scale-[1.03]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-site px-4 pb-12 text-white sm:px-10">
              <p className="font-display text-[38px] leading-none font-medium sm:text-[56px]">{home.closing.title}</p>
              <span className="label-caps mt-4 inline-block underline underline-offset-4">{home.closing.ctaLabel}</span>
            </div>
          </Link>
        </section>
      )}

      {/* TẠP CHÍ */}
      <section className="bg-paper py-16 lg:py-24">
        <div className="mx-auto max-w-site px-4 sm:px-10">
          <h2 className="font-display text-[48px] leading-none font-medium tracking-[0.1em] text-ink-2 uppercase">{home.journal.title || "Tạp chí"}</h2>
          {home.journal.desc && <p className="mt-3 max-w-[576px] text-[15px] leading-6 text-ink-4">{home.journal.desc}</p>}
          <ul className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 md:overflow-visible">
            {articles.slice(0, 3).map((n) => (
              <li key={n.slug} className="w-[80%] shrink-0 snap-start md:w-auto">
                <Link href={`/tap-chi/${n.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f0f0f0]">
                    <Img src={n.image} alt={n.title} sizes="(min-width:768px) 33vw, 80vw" className="transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <h3 className="mt-4 font-display text-[24px] leading-[1.15] font-medium text-black uppercase group-hover:underline">{n.title}</h3>
                  <p className="mt-3 text-[14px] leading-[22px] text-ink-4">{n.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
