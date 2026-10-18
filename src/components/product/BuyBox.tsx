"use client";

import { useState } from "react";
import { formatVnd } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";

export function BuyBox({ product, priceNote }: { product: Product; priceNote?: string }) {
  const { add } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [openPanel, setOpenPanel] = useState<number>(0);

  const panels = [
    { title: "MÔ TẢ SẢN PHẨM", body: product.description },
    { title: "CHI TIẾT & CHẤT LIỆU", body: product.details },
    { title: "BẢNG SIZE & CÁCH CHỌN", body: product.sizing },
  ];

  const stockOf = (s: string) => product.stock[`${color.name}|${s}`] ?? 0;
  const soldOut = product.sizes.every((s) => stockOf(s) <= 0);

  const onAdd = () => {
    if (!size || stockOf(size) <= 0) {
      setError(true);
      return;
    }
    add({ slug: product.slug, name: product.name, price: product.price, image: product.images[0] ?? "", color: color.name, size });
  };

  return (
    <>
      <p className="mt-3 text-[12px] text-[#777]">{product.subtitle}</p>
      <p className="mt-4 text-[15px] text-[#101010]">{formatVnd(product.price)}</p>
      {priceNote && <p className="mt-1 text-[10px] tracking-[0.04em] text-[#6d6d6b]">{priceNote}</p>}

      <p className="mt-9 text-[10px] tracking-[0.12em] text-[#101010] uppercase">
        Màu sắc: <b className="font-semibold">{color.name}</b>
      </p>
      <div className="mt-3 flex gap-2">
        {product.colors.map((c) => (
          <button
            key={c.name}
            onClick={() => {
              setColor(c);
              if (size && (product.stock[`${c.name}|${size}`] ?? 0) <= 0) setSize(null);
            }}
            aria-label={`Màu ${c.name}`}
            aria-pressed={c.name === color.name}
            className={`size-[35px] rounded-[3px] border p-[3px] ${c.name === color.name ? "border-[#151515]" : "border-transparent hover:border-black/30"}`}
          >
            <span className="block size-full rounded-[2px] border border-black/10" style={{ background: c.hex }} />
          </button>
        ))}
      </div>

      <div className="mt-7 flex items-baseline justify-between">
        <p className="text-[10px] tracking-[0.12em] text-[#101010] uppercase">
          Size (EU): <b className="font-semibold">{size ?? "—"}</b>
        </p>
        <button className="text-[10px] tracking-[0.08em] text-[#6d6d6b] underline" onClick={() => setOpenPanel(2)}>
          Hướng dẫn chọn size
        </button>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-[7px]">
        {product.sizes.map((s) => {
          const out = stockOf(s) <= 0;
          return (
            <button
              key={s}
              onClick={() => {
                setSize(s);
                setError(false);
              }}
              disabled={out}
              aria-pressed={s === size}
              aria-label={out ? `Size ${s} (hết hàng)` : `Size ${s}`}
              className={`h-[41px] border text-[11px] transition-colors disabled:cursor-not-allowed disabled:border-[#e5e5e5] disabled:text-black/25 disabled:line-through ${
                s === size ? "border-[#111] bg-[#111] text-white" : "border-[#ccc] bg-white text-[#111] hover:border-[#111]"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-[11px] text-danger">Vui lòng chọn size trước khi thêm vào giỏ.</p>}

      <button
        onClick={onAdd}
        disabled={soldOut}
        className="mt-7 h-[52px] w-full bg-[#111] text-[10px] font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-ink-3 disabled:bg-black/30"
      >
        {soldOut ? "Màu này đã hết hàng" : "Thêm vào giỏ"}
      </button>
      <div className="mt-3 flex justify-between text-[9px] tracking-[0.04em] text-[#6d6d6b]">
        <span>Miễn phí vận chuyển toàn quốc</span>
        <span>Đổi size trong 30 ngày</span>
      </div>

      <div className="mt-8 border-t border-[#d9d7d1]">
        {panels.map((p, i) => {
          const open = openPanel === i;
          return (
            <div key={p.title} className="border-b border-[#d9d7d1]">
              <button
                onClick={() => setOpenPanel(open ? -1 : i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between py-[17px] text-[10px] font-semibold tracking-[0.11em] text-[#101010]"
              >
                {p.title}
                <span className="text-[13px] font-normal">{open ? "×" : "+"}</span>
              </button>
              {open && <p className="pb-[17px] text-[11px] leading-[19px] text-[#686865]">{p.body}</p>}
            </div>
          );
        })}
      </div>
    </>
  );
}
