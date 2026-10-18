import Link from "next/link";
import { formatVnd } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Img } from "./Img";

export function ProductCard({ product, variant = "grid" }: { product: Product; variant?: "grid" | "related" }) {
  if (variant === "related") {
    return (
      <Link href={`/san-pham/${product.slug}`} className="group block">
        <div className="relative aspect-[300/350] overflow-hidden bg-stone">
          <Img
            src={product.images[0] ?? ""}
            alt={product.name}
            sizes="(min-width:1024px) 25vw, 50vw"
            className="transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
        <h3 className="mt-3.5 text-[11px] font-medium tracking-[0.065em] text-[#101010] uppercase">{product.name}</h3>
        <p className="mt-1 text-[9px] tracking-[0.08em] text-[#777] uppercase">{product.colors[0].name}</p>
        <p className="mt-2 text-[11px] font-medium text-[#101010]">{formatVnd(product.price)}</p>
      </Link>
    );
  }

  return (
    <Link href={`/san-pham/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-stone">
        <Img
          src={product.images[0] ?? ""}
          alt={product.name}
          sizes="(min-width:1024px) 25vw, 50vw"
          className="transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-white px-2 py-1 text-[9px] tracking-[0.12em] uppercase">Mới</span>
        )}
      </div>
      <div className="pt-4">
        <h3 className="text-[13px] leading-[19px] font-medium tracking-[0.08em] text-black uppercase">{product.name}</h3>
        <div className="mt-1 flex items-baseline justify-between gap-3 text-[12px] tracking-[0.06em] uppercase">
          <span className="text-black/45">{product.line.label}</span>
          <span className="text-black/70 normal-case">{formatVnd(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
