import Link from "next/link";
import { Img } from "@/components/ui/Img";
import type { Line, Lookbook, Product } from "@/lib/types";
import { PagedGrid } from "./PagedGrid";

export function CollectionView({ collection, products, lines }: { collection: Lookbook; products: Product[]; lines: Line[] }) {
  // Gom sản phẩm theo dòng, dòng của bộ sưu tập đứng đầu
  const order = [collection.line.key, ...lines.map((l) => l.key).filter((k) => k !== collection.line.key)];
  const labelOf = (k: string) => lines.find((l) => l.key === k)?.label ?? k;
  const groups = order.map((k) => ({ key: k, items: products.filter((p) => p.line.key === k) })).filter((g) => g.items.length);

  return (
    <>
      <section className="relative h-[480px] overflow-hidden bg-ink-2 lg:h-[540px]">
        <Img src={collection.image} alt={collection.title} priority sizes="100vw" />
        <div className="absolute inset-0 bg-black/30" />
      </section>

      <div className="mx-auto max-w-site px-4 pt-14 sm:px-5 lg:pt-16">
        <nav aria-label="Đường dẫn trang" className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.14em] uppercase">
          <Link href="/" className="text-black/70 hover:text-black">
            Trang chủ
          </Link>
          <span className="text-black/40">/</span>
          <Link href={`/dong/${collection.line.key}`} className="text-black/70 hover:text-black">
            {collection.line.label}
          </Link>
          <span className="text-black/40">/</span>
          <span className="text-black" aria-current="page">
            {collection.title}
          </span>
        </nav>
        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-5">
          <h1 className="font-display text-[48px] leading-none font-medium uppercase sm:text-[64px]">{collection.title}</h1>
          <p className="max-w-[610px] text-[15px] leading-[26px] text-black/65">{collection.desc}</p>
        </div>
      </div>

      <div className="mt-14 border-t border-black/10 pb-24">
        {groups.map((g) => (
          <section key={g.key} className="pt-16 lg:pt-20">
            <h2 className="mx-auto max-w-site px-4 font-display text-[32px] leading-none font-medium tracking-[0.08em] sm:px-5">{labelOf(g.key)}</h2>
            <PagedGrid products={g.items} label={labelOf(g.key)} />
          </section>
        ))}
      </div>
    </>
  );
}
