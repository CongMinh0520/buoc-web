import Link from "@/components/ui/LocaleLink";
import { getT } from "@/i18n/server";

export default async function NotFound() {
  const t = await getT();
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-paper px-6 py-24 text-center">
      <p className="font-display text-[120px] leading-none font-medium tracking-[0.04em] sm:text-[160px]">404</p>
      <h1 className="mt-4 label-caps font-medium">{t.pages.notFoundTitle}</h1>
      <p className="mt-3 max-w-[420px] text-[14px] leading-6 text-black/55">{t.pages.notFoundDesc}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-dark">
          {t.pages.backHome}
        </Link>
        <Link href="/danh-muc/tat-ca" className="btn-outline">
          {t.pages.viewProducts}
        </Link>
      </div>
    </section>
  );
}
