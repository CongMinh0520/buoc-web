"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { LineRef, Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";

type Sort = "featured" | "new" | "price-asc" | "price-desc";
const sortLabels: Record<Sort, string> = {
  featured: "Nổi bật",
  new: "Mới nhất",
  "price-asc": "Giá tăng dần",
  "price-desc": "Giá giảm dần",
};

export function CategoryView({ products }: { products: Product[] }) {
  const [line, setLine] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [panel, setPanel] = useState(false);

  const availableLines = useMemo(
    () => {
      const seen = new Map<string, LineRef>();
      for (const p of products) if (p.line.key && !seen.has(p.line.key)) seen.set(p.line.key, p.line);
      return Array.from(seen.values());
    },
    [products],
  );

  const list = useMemo(() => {
    const l = line === "all" ? products : products.filter((p) => p.line.key === line);
    const sorted = [...l];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "new") sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return sorted;
  }, [products, line, sort]);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel]);

  const chip = (active: boolean) =>
    `rounded-[4px] border px-4 py-2 text-[12px] tracking-[0.08em] uppercase transition-colors ${
      active ? "border-black bg-black text-white" : "border-[#ccc] bg-white text-ink-2 hover:border-black"
    }`;

  return (
    <>
      {/* Bộ lọc nhanh */}
      <div className="sticky top-14 z-30 mt-10 bg-white/95 px-4 pt-3 pb-4 backdrop-blur-md sm:px-5">
        <div className="flex justify-center">
          <button className={chip(line === "all")} onClick={() => setLine("all")}>
            Xem tất cả
          </button>
        </div>
        <div className="no-scrollbar mt-3 flex justify-start gap-2.5 overflow-x-auto sm:justify-center">
          {availableLines.map((l) => (
            <button key={l.key} className={`${chip(line === l.key)} shrink-0`} onClick={() => setLine(l.key)}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-site px-4 sm:px-5">
        <p className="eyebrow mb-6 text-black/45">
          {list.length} sản phẩm · {sortLabels[sort]}
        </p>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4 lg:gap-y-10">
          {list.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>

      {/* Nút nổi: Bộ lọc & Sắp xếp */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center">
        <button
          onClick={() => setPanel(true)}
          className="pointer-events-auto flex h-12 items-center rounded-[4px] border border-black/10 bg-white pr-4 text-[11px] tracking-[0.1em] uppercase shadow-[0_8px_24px_-12px_rgba(0,0,0,0.3)]"
        >
          <span className="grid size-12 place-items-center">
            <SlidersHorizontal size={16} strokeWidth={1.5} />
          </span>
          Bộ lọc &amp; Sắp xếp
        </button>
      </div>

      {panel && (
        <div className="fixed inset-0 z-[80] bg-black/40" onMouseDown={(e) => e.target === e.currentTarget && setPanel(false)}>
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col bg-white" aria-label="Bộ lọc và sắp xếp">
            <div className="flex items-center justify-between border-b border-black px-6 py-5">
              <p className="label-caps font-medium">Bộ lọc &amp; Sắp xếp</p>
              <button onClick={() => setPanel(false)} aria-label="Đóng">
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="label-caps text-black/45">Sắp xếp theo</p>
              <div className="mt-3 grid gap-1">
                {(Object.keys(sortLabels) as Sort[]).map((s) => (
                  <label key={s} className="flex cursor-pointer items-center gap-3 py-2 text-[13px]">
                    <input type="radio" name="sort" checked={sort === s} onChange={() => setSort(s)} className="accent-black" />
                    {sortLabels[s]}
                  </label>
                ))}
              </div>
              <p className="label-caps mt-8 text-black/45">Dòng sản phẩm</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className={chip(line === "all")} onClick={() => setLine("all")}>
                  Tất cả
                </button>
                {availableLines.map((l) => (
                  <button key={l.key} className={chip(line === l.key)} onClick={() => setLine(l.key)}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 border-t border-black/10 px-6 py-5">
              <button
                className="btn-outline flex-1 px-4"
                onClick={() => {
                  setLine("all");
                  setSort("featured");
                }}
              >
                Đặt lại
              </button>
              <button className="btn-dark flex-1 px-4" onClick={() => setPanel(false)}>
                Xem {list.length} sản phẩm
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
