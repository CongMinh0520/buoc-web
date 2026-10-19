"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { useT } from "@/components/providers/LocaleProvider";

const PER_PAGE = 8;

export function PagedGrid({ products, label }: { products: Product[]; label: string }) {
  const [page, setPage] = useState(0);
  const t = useT();
  const pages = Math.ceil(products.length / PER_PAGE);
  const list = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div className="mx-auto max-w-site px-4 sm:px-5">
      <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
        {list.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} newLabel={t.common.newBadge} />
          </li>
        ))}
      </ul>
      {pages > 1 && (
        <nav aria-label={t.collection.pagination(label)} className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((v) => Math.max(0, v - 1))}
            disabled={page === 0}
            aria-label={t.collection.prev}
            className="grid size-9 place-items-center border border-black/15 disabled:opacity-30"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-current={i === page ? "page" : undefined}
              className={`h-8 w-9 text-[12px] ${i === page ? "bg-black text-white" : "border border-black/15 hover:border-black"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((v) => Math.min(pages - 1, v + 1))}
            disabled={page === pages - 1}
            aria-label={t.collection.next}
            className="grid size-9 place-items-center border border-black/15 disabled:opacity-30"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </nav>
      )}
    </div>
  );
}
