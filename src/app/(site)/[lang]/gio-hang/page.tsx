import { CartView } from "@/components/cart/CartView";
import { pageMeta } from "@/lib/seo";
import { getLocale, getT } from "@/i18n/server";

export async function generateMetadata() {
  const [locale, t] = await Promise.all([getLocale(), getT()]);
  return pageMeta({ locale, title: t.cart.title, path: "/gio-hang", noindex: true });
}

export default function CartPage() {
  return (
    <div className="bg-paper pb-24">
      <CartView />
    </div>
  );
}
