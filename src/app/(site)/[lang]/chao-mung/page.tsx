import Link from "@/components/ui/LocaleLink";
import { getLocale, getT } from "@/i18n/server";
import { Img } from "@/components/ui/Img";
import { getLines, getSiteSettings } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata() {
  const [s, locale, t] = await Promise.all([getSiteSettings(), getLocale(), getT()]);
  return pageMeta({ locale, title: t.pages.welcomeMeta, description: t.pages.welcomeDesc(s.brandName), path: "/chao-mung" });
}

export default async function WelcomePage() {
  const [lines, s, t] = await Promise.all([getLines(), getSiteSettings(), getT()]);
  return (
    <section aria-labelledby="welcome-title" className="relative flex h-[100svh] min-h-[560px] flex-col bg-ink-2 md:flex-row">
      <h1 id="welcome-title" className="sr-only">
        {t.pages.welcomeTitle(s.brandName)}
      </h1>
      <Link href="/" className="absolute top-6 left-1/2 z-10 -translate-x-1/2 font-display text-[44px] leading-none font-medium text-white italic" aria-label={t.pages.enterHome(s.brandName)}>
        {s.wordmark}
      </Link>
      {lines.map((l, i) => (
        <Link key={l.key} href={`/dong/${l.key}`} className="group relative flex-1 overflow-hidden transition-[flex-grow] duration-700 ease-out md:hover:flex-[1.6]">
          <Img src={l.hero} alt={l.label} sizes="(min-width:768px) 25vw, 100vw" priority className="transition-transform duration-[1200ms] group-hover:scale-[1.05]" />
          <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/25" />
          <div className="absolute inset-x-0 bottom-8 text-center text-white md:bottom-14">
            <p className="font-display text-[34px] leading-none font-medium tracking-[0.2em] md:text-[40px]">{l.label}</p>
            {i === 0 && <p className="mt-2 text-[11px] tracking-[0.06em] text-white/80">{s.tagline}</p>}
            <p className="eyebrow mt-3 opacity-0 transition-opacity group-hover:opacity-100">{t.common.discover}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
