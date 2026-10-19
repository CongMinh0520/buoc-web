import Link from "@/components/ui/LocaleLink";
import { getT } from "@/i18n/server";
import type { Product } from "@/lib/types";
import { CategoryView } from "./CategoryView";

export async function CategoryPageView({ slug, title, products }: { slug: string; title: string; products: Product[] }) {
  const t = await getT();
  return (
    <div className="bg-white pb-24">
      <div className="mx-auto max-w-site px-4 pt-10 sm:px-5 sm:pt-14">
        <nav aria-label={t.common.breadcrumb} className="flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase">
          <Link href="/" className="text-black/70 hover:text-black">
            {t.common.home}
          </Link>
          <span className="text-black/40">/</span>
          <span className="text-black" aria-current="page">
            {title}
          </span>
        </nav>
        <h1 className="mt-6 font-display text-[56px] leading-none font-medium text-black uppercase">{title}</h1>
      </div>
      <CategoryView key={slug} products={products} />
    </div>
  );
}
