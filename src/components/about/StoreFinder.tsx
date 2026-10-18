"use client";

import { useMemo, useState } from "react";
import { MapPin, Phone, Clock, Search } from "lucide-react";
import type { Store } from "@/lib/types";
import { Img } from "@/components/ui/Img";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");

const ALL = "Tất cả khu vực";

export function StoreFinder({ stores: storeList }: { stores: Store[] }) {
  const regions = [ALL, ...Array.from(new Set(storeList.map((s) => s.region)))];
  const [q, setQ] = useState("");
  const [region, setRegion] = useState(regions[0]);
  const [active, setActive] = useState(storeList[0]?.name ?? "");

  const list = useMemo(
    () =>
      storeList.filter(
        (s) => (region === ALL || s.region === region) && norm(`${s.name} ${s.address}`).includes(norm(q.trim())),
      ),
    [q, region, storeList],
  );
  const current = storeList.find((s) => s.name === active) ?? storeList[0];
  if (!current) return null;

  return (
    <div className="grid gap-5 bg-paper p-4 sm:p-5 lg:grid-cols-[531px_1fr]">
      <div className="flex flex-col bg-white p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
          <label className="relative">
            <span className="sr-only">Tìm cửa hàng</span>
            <Search size={15} strokeWidth={1.5} className="absolute top-1/2 left-3 -translate-y-1/2 text-black/40" />
            <input id="store-search" value={q} onChange={(e) => setQ(e.target.value)} className="field pl-9" placeholder="Tìm theo tên hoặc địa chỉ…" />
          </label>
          <label>
            <span className="sr-only">Khu vực</span>
            <select id="store-region" value={region} onChange={(e) => setRegion(e.target.value)} className="field">
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
        </div>
        <ul className="mt-4 flex-1 divide-y divide-black/10 overflow-y-auto lg:max-h-[520px]">
          {list.length === 0 && <li className="py-10 text-center text-[13px] text-black/50">Không tìm thấy cửa hàng phù hợp.</li>}
          {list.map((s) => (
            <li key={s.name}>
              <button
                onClick={() => setActive(s.name)}
                aria-pressed={active === s.name}
                className={`w-full px-3 py-4 text-left transition-colors ${active === s.name ? "bg-paper" : "hover:bg-paper/60"}`}
              >
                <p className="text-[13px] font-medium tracking-[0.06em] uppercase">{s.name}</p>
                <p className="mt-1 text-[12px] leading-5 text-black/60">{s.address}</p>
                <p className="mt-1 text-[12px] text-black/45">{s.phone}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <article className="bg-white">
        <div className="relative aspect-[16/10] bg-stone">
          <Img src={current.image} alt={current.name} sizes="(min-width:1024px) 650px, 100vw" />
        </div>
        <div className="p-6">
          <p className="eyebrow text-black/45">{current.region}</p>
          <h3 className="mt-2 font-display text-[30px] leading-tight font-medium">{current.name}</h3>
          <ul className="mt-4 space-y-2 text-[13px] text-black/70">
            <li className="flex gap-2.5">
              <MapPin size={16} strokeWidth={1.4} className="mt-0.5 shrink-0" /> {current.address}
            </li>
            <li className="flex gap-2.5">
              <Phone size={16} strokeWidth={1.4} className="mt-0.5 shrink-0" /> {current.phone}
            </li>
            <li className="flex gap-2.5">
              <Clock size={16} strokeWidth={1.4} className="mt-0.5 shrink-0" /> Mở cửa {current.hours} hằng ngày
            </li>
          </ul>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(current.address)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-dark mt-6"
          >
            Chỉ đường
          </a>
        </div>
      </article>
    </div>
  );
}
