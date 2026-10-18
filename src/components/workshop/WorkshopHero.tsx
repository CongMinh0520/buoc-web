"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { Img } from "@/components/ui/Img";

/** Ảnh hero chuyển động chậm (thay cho video trong design); có nút tạm dừng */
export function WorkshopHero({ src, title }: { src: string | null; title: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <section className="relative h-[460px] overflow-hidden bg-ink-2 lg:h-[540px]">
      <div className="absolute inset-0 animate-[kenburns_18s_ease-in-out_infinite_alternate] motion-reduce:animate-none" style={{ animationPlayState: paused ? "paused" : "running" }}>
        <Img src={src} alt={title} priority sizes="100vw" />
      </div>
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-x-0 bottom-16 mx-auto max-w-site px-4 text-white sm:px-10">
        <p className="eyebrow text-gold">Xưởng mở</p>
        <h1 className="mt-3 max-w-[640px] font-display text-[40px] leading-[1.05] font-medium sm:text-[56px]">{title}</h1>
      </div>
      <button
        onClick={() => setPaused((v) => !v)}
        aria-label={paused ? "Tiếp tục chuyển động" : "Tạm dừng chuyển động"}
        className="absolute bottom-4 left-4 grid size-8 place-items-center text-white/85 hover:text-white"
      >
        {paused ? <Play size={18} strokeWidth={1.5} /> : <Pause size={18} strokeWidth={1.5} />}
      </button>
    </section>
  );
}
