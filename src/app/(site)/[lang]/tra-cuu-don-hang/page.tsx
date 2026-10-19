import { OrderLookup } from "@/components/order/OrderLookup";
import { getSiteSettings } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { getLocale, getT } from "@/i18n/server";

export async function generateMetadata() {
  const [s, locale, t] = await Promise.all([getSiteSettings(), getLocale(), getT()]);
  return pageMeta({ locale, title: t.lookup.metaTitle, description: t.lookup.metaDesc(s.brandName), path: "/tra-cuu-don-hang" });
}

export default async function OrderLookupPage() {
  const t = await getT();
  return (
    <div className="bg-paper px-4 pt-14 pb-24 sm:px-10">
      <header className="mb-10 text-center">
        <h1 className="font-display text-[44px] leading-none font-medium uppercase sm:text-[52px]">{t.lookup.title}</h1>
        <p className="mx-auto mt-4 max-w-[460px] text-[14px] leading-6 text-black/55">
          {t.lookup.intro}
        </p>
      </header>
      <OrderLookup />
    </div>
  );
}
