import { CheckoutView } from "@/components/checkout/CheckoutView";
import { getSiteSettings } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Thanh toán", path: "/thanh-toan", noindex: true });

export default async function CheckoutPage() {
  const s = await getSiteSettings();
  return (
    <div className="bg-paper pb-24">
      <div className="mx-auto max-w-site px-4 sm:px-5">
        <header className="pt-14 pb-10">
          <h1 className="font-display text-[48px] leading-none font-medium tracking-[0.02em] text-black uppercase">Thanh toán</h1>
        </header>
        <CheckoutView brandName={s.brandName} priceNote={s.priceNote} />
      </div>
    </div>
  );
}
