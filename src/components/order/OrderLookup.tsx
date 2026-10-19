"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { lookupOrderAction } from "@/server/actions/checkout";
import { formatDate, formatNumber } from "@/lib/format";
import { Img } from "@/components/ui/Img";
import { useT } from "@/components/providers/LocaleProvider";

type Found = Extract<Awaited<ReturnType<typeof lookupOrderAction>>, { ok: true }>["data"];

const steps = ["confirmed", "processing", "shipping", "delivered"];
const stepIndex: Record<string, number> = { pending: -2, confirmed: 0, processing: 1, shipping: 2, delivered: 3, cancelled: -1 };
const vnd = (n: number) => `VND ${formatNumber(n)}`;

export function OrderLookup() {
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<Found | null>(null);
  const [pending, start] = useTransition();
  const t = useT();
  const L = t.lookup;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError(null);
    start(async () => {
      const r = await lookupOrderAction({ code: String(f.get("code") ?? ""), phone: String(f.get("phone") ?? "") });
      if (r.ok) setFound(r.data);
      else setError(r.error);
    });
  };

  if (found) {
    const current = stepIndex[found.status] ?? 0;
    const qty = found.items.reduce((s, i) => s + i.qty, 0);
    return (
      <div className="mx-auto max-w-[1200px]">
        <article className="border border-black bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[12px] tracking-[0.12em] uppercase">
              {L.orderCode} <span className="font-medium">{found.code}</span>
            </p>
            <p className="text-[12px] text-black/50">{L.placedOn(formatDate(found.date))}</p>
          </div>
          {current === -1 && <p className="mt-6 inline-block border border-black px-4 py-2 text-[12px] tracking-[0.1em] uppercase">{t.orderStatus.cancelled}</p>}
          {current === -2 && <p className="mt-6 inline-block border border-black px-4 py-2 text-[12px] tracking-[0.1em] uppercase">{t.orderStatus.pending}</p>}
          {current >= 0 && (
            <ol className="mt-8 grid grid-cols-4">
              {steps.map((s, i) => {
                const done = i <= current;
                return (
                  <li key={s} className="relative flex flex-col items-center text-center">
                    {i > 0 && <span className={`absolute top-4 right-1/2 h-px w-full ${i <= current ? "bg-black" : "bg-black/15"}`} />}
                    <span className={`relative grid size-8 place-items-center rounded-full border text-[12px] ${done ? "border-black bg-black text-white" : "border-black/25 bg-white text-black/40"}`}>
                      {i < current ? <Check size={14} strokeWidth={2} /> : i + 1}
                    </span>
                    <span className={`mt-3 text-[10px] tracking-[0.1em] uppercase sm:text-[11px] ${done ? "text-black" : "text-black/40"}`}>{L.steps[s]}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </article>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <section className="border border-black bg-white p-6 sm:p-8">
            <h2 className="text-[12px] font-medium tracking-[0.12em] uppercase">{L.details(qty)}</h2>
            <ul className="mt-6 space-y-5">
              {found.items.map((i) => (
                <li key={`${i.name}${i.color}${i.size}`} className="grid grid-cols-[72px_1fr_auto] items-start gap-4">
                  <div className="relative size-[72px] border border-black bg-white">
                    <Img src={i.image} alt={i.name} sizes="72px" />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium tracking-[0.08em] uppercase">{i.name}</p>
                    <p className="mt-1 text-[11px] text-black/50">
                      {t.common.colorSize(i.color, i.size)} · {L.qty(i.qty)}
                    </p>
                  </div>
                  <p className="text-[12px] whitespace-nowrap">{vnd(i.price * i.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-8 space-y-2 border-t border-black/15 pt-5 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-black/55 uppercase">{L.subtotal}</dt>
                <dd>{vnd(found.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-black/55 uppercase">{L.shippingFee}</dt>
                <dd>{found.shippingFee ? vnd(found.shippingFee) : t.common.free}</dd>
              </div>
              <div className="flex justify-between border-t border-black pt-3 text-[14px] font-medium">
                <dt className="uppercase">{L.total}</dt>
                <dd>{vnd(found.total)}</dd>
              </div>
              <p className="text-right text-[11px] text-black/45">{t.common.vatIncluded}</p>
            </dl>
          </section>

          <section className="border border-black bg-white p-6 sm:p-8">
            <h2 className="text-[12px] font-medium tracking-[0.12em] uppercase">{L.deliveryPayment}</h2>
            <dl className="mt-6 space-y-5 text-[13px]">
              <div>
                <dt className="eyebrow text-black/45">{L.recipient}</dt>
                <dd className="mt-1">
                  {found.shipping.name} — {found.shipping.phone}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-black/45">{L.address}</dt>
                <dd className="mt-1 leading-5 text-black/70">{found.shipping.address}</dd>
              </div>
              <div>
                <dt className="eyebrow text-black/45">{L.method}</dt>
                <dd className="mt-1">
                  {t.payMethod[found.paymentMethod] ?? found.paymentMethod}
                  {found.paymentStatus === "paid" ? L.paid : ""}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => setFound(null)} className="btn-outline sm:w-60">
            {L.another}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-[480px] border border-black bg-white p-6 sm:p-8">
      <h2 className="text-[12px] font-medium tracking-[0.12em] uppercase">{L.form}</h2>
      <label className="mt-6 block">
        <span className="mb-1.5 block text-[12px] tracking-[0.1em] text-subtle uppercase">
          {L.orderCode} <span className="text-danger">*</span>
        </span>
        <input id="lookup-code" name="code" required maxLength={20} className="field" placeholder={L.codePh} autoComplete="off" />
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-[12px] tracking-[0.1em] text-subtle uppercase">
          {L.phone} <span className="text-danger">*</span>
        </span>
        <input id="lookup-phone" name="phone" type="tel" required maxLength={15} className="field" placeholder={L.phonePh} autoComplete="tel" />
      </label>
      {error && (
        <p id="lookup-error" role="alert" className="mt-3 text-[12px] text-danger">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-dark mt-6 w-full disabled:opacity-60">
        {pending ? L.searching : L.submit}
      </button>
      <p className="mt-4 text-center text-[11px] text-black/45">{L.privacy}</p>
    </form>
  );
}
