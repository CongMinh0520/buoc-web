"use client";

import { useEffect, useState } from "react";
import { Img } from "@/components/ui/Img";

/** Trình chiếu ảnh tự chuyển (thay cho khối video trong design) */
export function MediaCarousel({ slides }: { slides: { src: string; caption: string }[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-2 lg:aspect-[1195/747]">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
            aria-hidden={idx !== i}
          >
            <Img src={s.src} alt={s.caption} sizes="(min-width:1280px) 1195px, 100vw" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-20">
              <p className="font-display text-[22px] text-white sm:text-[28px]">{s.caption}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {slides.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Ảnh ${idx + 1}: ${s.caption}`}
            aria-current={idx === i}
            className={`h-1.5 w-10 transition-colors ${idx === i ? "bg-black" : "bg-black/20 hover:bg-black/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
