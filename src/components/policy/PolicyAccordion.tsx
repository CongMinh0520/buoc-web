"use client";

import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";

export type PolicyItem = { slug: string; title: string; meta?: string; body: React.ReactNode };

export function PolicyAccordion({ items }: { items: PolicyItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.slug ?? null);

  // Mở đúng mục khi vào bằng liên kết có #slug
  // (kể cả khi bấm link chính sách ở footer lúc đang ở sẵn trang này)
  useEffect(() => {
    const sync = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (hash && items.some((i) => i.slug === hash)) setOpen(hash);
    };
    sync();
    // <Link> của Next đổi hash bằng pushState (không phát "hashchange") → kiểm tra lại sau mỗi lần bấm link
    const afterClick = () => setTimeout(sync, 0);
    window.addEventListener("hashchange", sync);
    document.addEventListener("click", afterClick);
    return () => {
      window.removeEventListener("hashchange", sync);
      document.removeEventListener("click", afterClick);
    };
  }, [items]);

  return (
    <div className="border-t border-black">
      {items.map((p, idx) => {
        const isOpen = open === p.slug;
        return (
          <section key={p.slug} id={p.slug} className="scroll-mt-20 border-b border-black">
            <h2>
              <button onClick={() => setOpen(isOpen ? null : p.slug)} aria-expanded={isOpen} className="flex w-full items-center gap-5 py-6 text-left">
                <span className="w-8 shrink-0 font-display text-[22px] text-black/40 tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[14px] font-medium tracking-[0.06em] uppercase">{p.title}</span>
                {isOpen ? <Minus size={18} strokeWidth={1.4} /> : <Plus size={18} strokeWidth={1.4} />}
              </button>
            </h2>
            {/* Nội dung luôn có trong HTML (tốt cho SEO), chỉ ẩn bằng CSS khi đóng */}
            <div hidden={!isOpen} className="pb-10 sm:pl-[52px]">
              {p.meta && <p className="text-[12px] text-black/50">{p.meta}</p>}
              {p.body}
            </div>
          </section>
        );
      })}
    </div>
  );
}
