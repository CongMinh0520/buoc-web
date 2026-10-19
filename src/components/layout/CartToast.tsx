"use client";

import Link from "@/components/ui/LocaleLink";
import { useT } from "@/components/providers/LocaleProvider";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatVnd } from "@/lib/format";
import { Img } from "@/components/ui/Img";

export function CartToast() {
  const { lastAdded, dismissToast } = useCart();
  const t = useT();

  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(dismissToast, 4000);
    return () => clearTimeout(t);
  }, [lastAdded, dismissToast]);

  if (!lastAdded) return null;

  return (
    <div
      role="status"
      className="fixed top-[68px] right-4 z-[60] w-[min(340px,calc(100vw-32px))] border border-black bg-white p-4 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-start justify-between">
        <p className="label-caps font-medium">{t.cartToast.added}</p>
        <button onClick={dismissToast} aria-label={t.cartToast.close}>
          <X size={16} strokeWidth={1.4} />
        </button>
      </div>
      <div className="mt-3 flex gap-3">
        <div className="relative size-16 shrink-0 bg-stone">
          <Img src={lastAdded.image} alt={lastAdded.name} sizes="64px" />
        </div>
        <div className="text-[12px]">
          <p className="font-medium tracking-[0.06em] uppercase">{lastAdded.name}</p>
          <p className="mt-1 text-black/55">
            {t.common.colorSize(lastAdded.colorLabel ?? lastAdded.color, lastAdded.size)}
          </p>
          <p className="mt-1">{formatVnd(lastAdded.price)}</p>
        </div>
      </div>
      <Link href="/gio-hang" onClick={dismissToast} className="btn-dark mt-4 w-full">
        {t.cartToast.viewCart}
      </Link>
    </div>
  );
}
