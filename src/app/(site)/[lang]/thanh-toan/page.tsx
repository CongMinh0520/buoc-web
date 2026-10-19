import { CheckoutView } from "@/components/checkout/CheckoutView";
import { getSiteSettings } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { getLocale, getT } from "@/i18n/server";

export async function generateMetadata() {
  const [locale, t] = await Promise.all([getLocale(), getT()]);
  return pageMeta({ locale, title: t.checkout.title, path: "/thanh-toan", noindex: true });
}

export default async function CheckoutPage() {
  const [s, t] = await Promise.all([getSiteSettings(), getT()]);
  return (
    <div className="bg-paper pb-24">
      <div className="mx-auto max-w-site px-4 sm:px-5">
        <header className="pt-14 pb-10">
          <h1 className="font-display text-[48px] leading-none font-medium tracking-[0.02em] text-black uppercase">{t.checkout.title}</h1>
        </header>
        <CheckoutView brandName={s.brandName} priceNote={s.priceNote} />
      </div>
    </div>
  );
}
