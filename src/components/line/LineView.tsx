import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { ProductCard } from "@/components/ui/ProductCard";
import { MediaCarousel } from "./MediaCarousel";
import type { Line, Product } from "@/lib/types";

export function LineView({ line: l, lines, products }: { line: Line; lines: Line[]; products: Product[] }) {
  return (
    <>
      <section className="relative h-[100svh] max-h-[760px] min-h-[560px] overflow-hidden bg-ink-2">
        <Img src={l.hero} alt={l.label} priority sizes="100vw" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-12 text-center text-white">
          <h1 className="font-display text-[64px] leading-none font-medium tracking-[0.12em] sm:text-[96px]">{l.label}</h1>
          {l.tagline && <p className="mt-5 border border-white/70 px-6 py-3 text-[13px] tracking-[0.06em]">{l.tagline}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-site px-4 pt-16 sm:px-10">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-8">
          <p className="eyebrow text-black/50 lg:col-span-5">{l.overline}</p>
          <p className="max-w-[640px] text-[15px] leading-[26px] text-ink-3 lg:col-span-7">{l.intro}</p>
        </div>
        {l.slides.length > 0 && (
          <div className="mt-10">
            <MediaCarousel slides={l.slides} />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-site px-4 pt-20 sm:px-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-[36px] leading-none font-medium uppercase">Sản phẩm {l.label}</h2>
          <Link href="/danh-muc/tat-ca" className="label-caps shrink-0 underline underline-offset-4">
            Xem tất cả
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>

      {/* Chuyển dòng sản phẩm */}
      <nav aria-label="Các dòng sản phẩm" className="mt-20 border-t border-black/10 py-12">
        <div className="mx-auto grid max-w-site grid-cols-2 gap-4 px-4 sm:px-10 lg:grid-cols-4">
          {lines.map((k) => {
            const on = k.key === l.key;
            return (
              <Link
                key={k.key}
                href={`/dong/${k.key}`}
                aria-current={on ? "page" : undefined}
                className={`group relative flex flex-col items-center overflow-hidden border px-4 py-6 text-center transition-colors ${
                  on ? "border-black bg-black text-white" : "border-black/15 hover:border-black"
                }`}
              >
                <span className="font-display text-[26px] leading-none font-medium tracking-[0.1em]">{k.label}</span>
                <span className={`eyebrow mt-3 ${on ? "text-white/70" : "text-black/50"}`}>{k.overline}</span>
                <span className={`mt-4 text-[11px] tracking-[0.1em] uppercase ${on ? "" : "underline underline-offset-4"}`}>{on ? "Đang xem" : "Xem"}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
