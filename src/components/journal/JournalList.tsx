"use client";

import { useState } from "react";
import type { Article } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";
import { useT } from "@/components/providers/LocaleProvider";

// Giá trị chủ đề lưu trong CMS (tiếng Việt); nhãn hiển thị lấy từ từ điển
const cats = ["all", "Bộ sưu tập", "Xưởng", "Chăm sóc", "Sự kiện"] as const;

export function JournalList({ articles }: { articles: Article[] }) {
  const t = useT();
  const [cat, setCat] = useState<(typeof cats)[number]>("all");
  const list = cat === "all" ? articles : articles.filter((a) => a.category === cat);

  return (
    <>
      <div className="no-scrollbar mb-8 flex gap-2.5 overflow-x-auto sm:justify-center">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`shrink-0 rounded-[4px] border px-4 py-2 text-[12px] tracking-[0.08em] uppercase transition-colors ${
              cat === c ? "border-black bg-black text-white" : "border-[#ccc] bg-white text-ink-2 hover:border-black"
            }`}
          >
            {c === "all" ? t.common.all : t.journal.categories[c]}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="py-16 text-center text-[13px] text-black/50">{t.journal.empty}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
