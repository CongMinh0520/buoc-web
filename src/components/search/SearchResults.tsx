"use client";

import Link from "@/components/ui/LocaleLink";
import { useLocale, useLocalePath, useT } from "@/components/providers/LocaleProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { loadSearchIndex, searchProducts } from "@/lib/search";
import type { Product } from "@/lib/types";
import { CategoryView } from "@/components/category/CategoryView";

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const to = useLocalePath();
  const suggestions = t.search.suggestions;
  const q = params.get("q") ?? "";
  const [draft, setDraft] = useState(q);
  const [lastQ, setLastQ] = useState(q);
  if (lastQ !== q) {
    setLastQ(q);
    setDraft(q);
  }
  const [products, setProducts] = useState<Product[] | null>(null);
  useEffect(() => {
    loadSearchIndex(locale).then(setProducts);
  }, [locale]);
  const results = products ? searchProducts(products, q) : [];

  const go = (value: string) => router.push(to(value.trim() ? `/tim-kiem?q=${encodeURIComponent(value.trim())}` : "/tim-kiem"));

  return (
    <div className="bg-white pb-24">
      <div className="mx-auto max-w-site px-4 pt-14 sm:px-5">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            go(draft);
          }}
          className="flex items-center gap-3 border-b border-black pb-3"
        >
          <Search size={22} strokeWidth={1.3} />
          <input
            id="search-page-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t.search.pagePlaceholder}
            className="flex-1 bg-transparent font-display text-[32px] outline-none placeholder:text-black/25 sm:text-[44px]"
            aria-label={t.search.keyword}
          />
          <button type="submit" className="label-caps shrink-0 underline underline-offset-4">
            {t.search.submit}
          </button>
        </form>
      </div>

      {!q && (
        <div className="mx-auto max-w-[520px] px-4 py-24 text-center">
          <h1 className="font-display text-[36px] font-medium uppercase">{t.search.title}</h1>
          <p className="mt-3 text-[14px] leading-6 text-black/55">{t.search.hint}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => go(s)} className="rounded-[4px] border border-[#ccc] px-4 py-2 text-[12px] tracking-[0.06em] uppercase hover:border-black">
                {s}
              </button>
            ))}
          </div>
          <Link href="/" className="btn-outline mt-10">
            {t.search.backHome}
          </Link>
        </div>
      )}

      {q && (
        <>
          <div className="mx-auto max-w-site px-4 pt-8 sm:px-5">
            <h1 className="text-[12px] tracking-[0.12em] text-black/50 uppercase">
              {t.search.summary} “<span className="text-black">{q}</span>” · {products === null ? "…" : t.common.products(results.length)}
            </h1>
          </div>
          {products === null ? (
            <p className="py-20 text-center text-[13px] text-black/50">{t.search.searching}</p>
          ) : results.length > 0 ? (
            <CategoryView key={q} products={results} />
          ) : (
            <div className="mx-auto max-w-[520px] px-4 py-20 text-center">
              <p className="font-display text-[30px] font-medium">{t.search.noResults}</p>
              <p className="mt-3 text-[14px] text-black/55">{t.search.tryShorter}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => go(s)} className="rounded-[4px] border border-[#ccc] px-4 py-2 text-[12px] tracking-[0.06em] uppercase hover:border-black">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
