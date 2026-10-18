"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { formatVnd } from "@/lib/format";
import { loadSearchIndex, searchProducts } from "@/lib/search";
import type { Product } from "@/lib/types";
import { Img } from "@/components/ui/Img";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (open) loadSearchIndex().then(setProducts);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const all = useMemo(() => (q.trim() ? searchProducts(products, q) : products.filter((p) => p.isNew)), [q, products]);
  const results = all.slice(0, 8);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/40" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white text-ink">
        <div className="mx-auto max-w-site px-4 py-6 sm:px-10">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (!q.trim()) return;
              onClose();
              router.push(`/tim-kiem?q=${encodeURIComponent(q.trim())}`);
            }}
            className="flex items-center gap-3 border-b border-black pb-3"
          >
            <Search size={20} strokeWidth={1.4} />
            <input
              ref={inputRef}
              id="search-overlay-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm giày, bộ sưu tập…"
              className="flex-1 bg-transparent font-display text-[26px] outline-none placeholder:text-black/30"
              aria-label="Từ khóa tìm kiếm"
            />
            <button type="button" onClick={onClose} aria-label="Đóng tìm kiếm" className="p-1">
              <X size={22} strokeWidth={1.25} />
            </button>
          </form>
          <div className="mt-5 flex items-baseline justify-between">
            <p className="eyebrow text-black/45">{q.trim() ? `${all.length} kết quả` : "Mới về"}</p>
            {q.trim() && all.length > 0 && (
              <Link href={`/tim-kiem?q=${encodeURIComponent(q.trim())}`} onClick={onClose} className="eyebrow underline underline-offset-4">
                Xem tất cả kết quả
              </Link>
            )}
          </div>
          {q.trim() && all.length === 0 && <p className="py-10 text-[13px] text-black/50">Không tìm thấy sản phẩm cho “{q}”.</p>}
          <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {results.map((p) => (
              <li key={p.slug}>
                <Link href={`/san-pham/${p.slug}`} onClick={onClose} className="group block">
                  <div className="relative aspect-square bg-stone">
                    <Img src={p.images[0] ?? ""} alt={p.name} sizes="(min-width:640px) 25vw, 50vw" />
                  </div>
                  <p className="mt-2 text-[12px] font-medium tracking-[0.06em] uppercase group-hover:underline">{p.name}</p>
                  <p className="text-[11px] text-black/50">{formatVnd(p.price)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
