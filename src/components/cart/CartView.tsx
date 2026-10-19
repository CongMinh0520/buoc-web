"use client";

import Link from "@/components/ui/LocaleLink";
import { useT } from "@/components/providers/LocaleProvider";
import { Minus, Plus } from "lucide-react";
import { cartKey, useCart } from "@/components/providers/CartProvider";
import { formatVnd } from "@/lib/format";
import { Img } from "@/components/ui/Img";

export function CartView() {
  const { items, count, subtotal, setQty, remove, ready } = useCart();
  const t = useT();

  return (
    <div className="mx-auto max-w-site px-4 sm:px-5">
      <header className="pt-14 pb-10">
        <h1 className="font-display text-[48px] leading-none font-medium tracking-[0.02em] text-black uppercase">{t.cart.title}</h1>
        <p className="mt-3 text-[12px] tracking-[0.1em] text-black/45 uppercase">
          {t.cart.count(ready ? count : 0)}
        </p>
      </header>

      {ready && items.length === 0 && (
        <div className="flex flex-col items-center py-28 text-center">
          <p className="font-display text-[30px] font-medium tracking-[0.02em] text-black uppercase">{t.cart.empty}</p>
          <p className="mt-3 text-[14px] text-black/50">{t.cart.emptyDesc}</p>
          <Link href="/danh-muc/tat-ca" className="btn-outline mt-8">
            {t.cart.continue}
          </Link>
        </div>
      )}

      {ready && items.length > 0 && (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <ul className="border-t border-black">
            {items.map((i) => {
              const key = cartKey(i);
              return (
                <li key={key} className="grid grid-cols-[96px_1fr] gap-4 border-b border-black py-6 sm:grid-cols-[120px_1fr]">
                  <Link href={`/san-pham/${i.slug}`} className="relative aspect-square border border-black bg-white">
                    <Img src={i.image} alt={i.name} sizes="120px" />
                  </Link>
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <Link href={`/san-pham/${i.slug}`} className="text-[12px] font-medium tracking-[0.08em] text-black uppercase hover:underline">
                        {i.name}
                      </Link>
                      <p className="text-[12px] tracking-[0.06em] whitespace-nowrap">{formatVnd(i.price * i.qty)}</p>
                    </div>
                    <p className="mt-1.5 text-[11px] text-black/55">
                      {t.common.colorSize(i.colorLabel ?? i.color, i.size)} · {formatVnd(i.price)}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex h-9 items-center border border-black">
                        <button className="grid size-9 place-items-center hover:bg-paper" onClick={() => setQty(key, i.qty - 1)} aria-label={t.cart.decrease}>
                          <Minus size={14} strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-[12px]">{String(i.qty).padStart(2, "0")}</span>
                        <button className="grid size-9 place-items-center hover:bg-paper" onClick={() => setQty(key, i.qty + 1)} aria-label={t.cart.increase}>
                          <Plus size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                      <button onClick={() => remove(key)} className="text-[11px] tracking-[0.1em] text-black/55 uppercase underline hover:text-black">
                        {t.cart.remove}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit border border-black bg-white p-6 lg:sticky lg:top-20">
            <h2 className="label-caps font-medium">{t.cart.summary}</h2>
            <dl className="mt-6 space-y-3 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-black/55">{t.cart.subtotalCount(count)}</dt>
                <dd>{formatVnd(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-black/55">{t.cart.shipping}</dt>
                <dd>{t.common.free}</dd>
              </div>
              <div className="flex justify-between border-t border-black/15 pt-4 text-[14px] font-medium">
                <dt className="uppercase tracking-[0.08em]">{t.cart.total}</dt>
                <dd>{formatVnd(subtotal)}</dd>
              </div>
            </dl>
            <Link href="/thanh-toan" className="btn-dark mt-6 w-full">
              {t.cart.checkout}
            </Link>
            <p className="mt-3 text-center text-[10px] tracking-[0.04em] text-black/50">{t.common.freeShipping} · {t.common.sizeExchange}</p>
          </aside>
        </div>
      )}
    </div>
  );
}
