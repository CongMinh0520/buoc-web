"use client";

import Link from "@/components/ui/LocaleLink";
import { useLocalePath, useT } from "@/components/providers/LocaleProvider";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useAuthModal } from "@/components/providers/AuthProvider";
import { checkoutProfileAction, placeOrderAction, quoteCartAction, type QuoteLine } from "@/server/actions/checkout";
import { formatVnd } from "@/lib/format";
import { Img } from "@/components/ui/Img";
import { FieldLabel } from "@/components/account/AccountShell";

type Quote = { lines: QuoteLine[]; subtotal: number; shippingFee: number; total: number; methods: { vnpay: boolean; momo: boolean } };
type Method = "cod" | "vnpay" | "momo";

const METHODS: Method[] = ["cod", "vnpay", "momo"];

export function CheckoutView({ brandName, priceNote }: { brandName: string; priceNote: string }) {
  const { items, ready, clear } = useCart();
  const t = useT();
  const to = useLocalePath();
  const c = t.checkout;
  const methodInfo = c.methods;
  // Tên sản phẩm/màu hiển thị theo ngôn ngữ lúc thêm vào giỏ (báo giá từ server dùng dữ liệu gốc)
  const shown = (slug: string, color: string, size: string) => items.find((i) => i.slug === slug && i.color === color && i.size === size);
  const { customer, open } = useAuthModal();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof checkoutProfileAction>>>(null);
  const [method, setMethod] = useState<Method>("cod");
  const [wantInvoice, setWantInvoice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const payloadItems = useMemo(() => items.map(({ slug, color, size, qty }) => ({ slug, color, size, qty })), [items]);

  useEffect(() => {
    if (!ready || payloadItems.length === 0) return;
    let alive = true;
    quoteCartAction(payloadItems).then((r) => {
      if (!alive) return;
      if (r.ok) {
        setQuote(r.data!);
        setQuoteError(null);
      } else setQuoteError(r.error);
    });
    return () => {
      alive = false;
    };
  }, [ready, payloadItems]);

  useEffect(() => {
    checkoutProfileAction().then(setProfile);
  }, [customer]);

  if (!ready) return <div className="min-h-[50vh]" />;
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-28 text-center">
        <p className="font-display text-[30px] font-medium uppercase">{t.cart.empty}</p>
        <Link href="/danh-muc/tat-ca" className="btn-outline mt-8">
          {t.cart.continue}
        </Link>
      </div>
    );
  }

  const hasProblem = quote?.lines.some((l) => l.problem);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "");
    setError(null);
    start(async () => {
      const r = await placeOrderAction({
        items: payloadItems,
        email: v("email"),
        shipping: { name: v("name"), phone: v("phone"), line: v("line"), ward: v("ward"), province: v("province"), note: v("note") || undefined },
        paymentMethod: method,
        acceptTerms: f.get("acceptTerms") === "on",
        invoice: wantInvoice
          ? { companyName: v("invCompany"), taxCode: v("invTax"), address: v("invAddress"), email: v("invEmail") }
          : undefined,
      });
      if (!r.ok) return setError(r.error);
      clear();
      window.location.assign(to(r.data!.redirect));
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1fr_400px]" key={profile?.email ?? "guest"}>
      <div className="space-y-10">
        {!customer && (
          <p className="border border-black/15 bg-white px-4 py-3 text-[13px] text-black/65">
            {c.haveAccount}{" "}
            <button type="button" onClick={() => open("login")} className="text-black underline">
              {c.login}
            </button>{" "}
            {c.loginHint}
          </p>
        )}
        <section>
          <h2 className="border-b border-black pb-2 text-[12px] font-medium tracking-[0.12em] uppercase">{c.shippingInfo}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="md:col-span-2">
              <FieldLabel required>{c.email}</FieldLabel>
              <input id="co-email" name="email" type="email" required defaultValue={profile?.email} className="field" autoComplete="email" />
            </label>
            <label>
              <FieldLabel required>{c.recipient}</FieldLabel>
              <input id="co-name" name="name" required defaultValue={profile?.name} className="field" autoComplete="name" />
            </label>
            <label>
              <FieldLabel required>{c.phone}</FieldLabel>
              <input id="co-phone" name="phone" type="tel" required defaultValue={profile?.phone} className="field" autoComplete="tel" />
            </label>
            <label className="md:col-span-2">
              <FieldLabel required>{c.line}</FieldLabel>
              <input id="co-line" name="line" required defaultValue={profile?.line} className="field" placeholder={c.linePh} autoComplete="street-address" />
            </label>
            <label>
              <FieldLabel required>{c.ward}</FieldLabel>
              <input id="co-ward" name="ward" required defaultValue={profile?.ward} className="field" />
            </label>
            <label>
              <FieldLabel required>{c.province}</FieldLabel>
              <input id="co-province" name="province" required defaultValue={profile?.province} className="field" autoComplete="address-level1" />
            </label>
            <label className="md:col-span-2">
              <FieldLabel>{c.note}</FieldLabel>
              <textarea id="co-note" name="note" maxLength={500} rows={3} className="field h-auto py-2" placeholder={c.notePh} />
            </label>
          </div>
        </section>

        <section>
          <label className="flex cursor-pointer items-center gap-3">
            <input id="co-invoice" type="checkbox" checked={wantInvoice} onChange={(e) => setWantInvoice(e.target.checked)} className="size-4 accent-black" />
            <span className="text-[12px] font-medium tracking-[0.12em] uppercase">{c.invoice}</span>
          </label>
          {wantInvoice && (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="md:col-span-2">
                <FieldLabel required>{c.company}</FieldLabel>
                <input id="co-inv-company" name="invCompany" required maxLength={200} className="field" autoComplete="organization" />
              </label>
              <label>
                <FieldLabel required>{c.taxCode}</FieldLabel>
                <input id="co-inv-tax" name="invTax" required inputMode="numeric" maxLength={14} pattern="\d{10}(-\d{3})?" className="field" placeholder={c.taxCodePh} />
              </label>
              <label>
                <FieldLabel required>{c.invoiceEmail}</FieldLabel>
                <input id="co-inv-email" name="invEmail" type="email" required maxLength={120} className="field" />
              </label>
              <label className="md:col-span-2">
                <FieldLabel required>{c.companyAddress}</FieldLabel>
                <input id="co-inv-address" name="invAddress" required maxLength={300} className="field" />
              </label>
            </div>
          )}
        </section>

        <section>
          <h2 className="border-b border-black pb-2 text-[12px] font-medium tracking-[0.12em] uppercase">{c.paymentMethod}</h2>
          <div className="mt-6 grid gap-3">
            {METHODS.map((m) => {
              const disabled = m !== "cod" && quote ? !quote.methods[m] : false;
              return (
                <label key={m} className={`flex cursor-pointer items-start gap-4 border bg-white p-4 ${method === m ? "border-black" : "border-black/15"} ${disabled ? "cursor-not-allowed opacity-45" : ""}`}>
                  <input type="radio" name="payment" checked={method === m} disabled={disabled} onChange={() => setMethod(m)} className="mt-1 accent-black" />
                  <span>
                    <span className="block text-[13px] font-medium">{methodInfo[m].label}</span>
                    <span className="mt-1 block text-[12px] text-black/55">{disabled ? c.notConfigured : methodInfo[m].desc}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="h-fit border border-black bg-white p-6 lg:sticky lg:top-20">
        <h2 className="label-caps font-medium">{c.yourOrder}</h2>
        {quoteError && <p className="mt-4 text-[12px] text-danger">{quoteError}</p>}
        {!quote && !quoteError && <p className="mt-6 text-[12px] text-black/50">{c.checking}</p>}
        {quote && (
          <>
            <ul className="mt-5 space-y-4">
              {quote.lines.map((l) => (
                <li key={`${l.slug}|${l.color}|${l.size}`} className="grid grid-cols-[56px_1fr_auto] gap-3">
                  <div className="relative size-14 border border-black/15 bg-stone">
                    <Img src={l.image} alt={l.name} sizes="56px" />
                  </div>
                  <div className="text-[12px]">
                    <p className="font-medium tracking-[0.04em] uppercase">{shown(l.slug, l.color, l.size)?.name ?? l.name}</p>
                    <p className="text-black/55">
                      {t.common.colorSize(shown(l.slug, l.color, l.size)?.colorLabel ?? l.color, l.size)} · ×{l.qty}
                    </p>
                    {l.problem && <p className="text-danger">{l.problem}</p>}
                  </div>
                  <p className="text-[12px] whitespace-nowrap">{formatVnd(l.price * l.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 border-t border-black/15 pt-4 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-black/55">{c.subtotal}</dt>
                <dd>{formatVnd(quote.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-black/55">{c.shipping}</dt>
                <dd>{quote.shippingFee ? formatVnd(quote.shippingFee) : t.common.free}</dd>
              </div>
              <div className="flex justify-between border-t border-black pt-3 text-[15px] font-medium">
                <dt className="uppercase">{c.total}</dt>
                <dd>{formatVnd(quote.total)}</dd>
              </div>
              {priceNote && <p className="text-right text-[11px] text-black/45">{priceNote}</p>}
            </dl>
          </>
        )}
        {hasProblem && (
          <p className="mt-4 text-[12px] text-danger">
            {c.outOfStock}{" "}
            <Link href="/gio-hang" className="underline">
              {c.updateCart}
            </Link>
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 text-[12px] leading-5 text-danger">
            {error}
          </p>
        )}
        {/* Khách phải chủ động đồng ý điều kiện giao dịch chung trước khi đặt (Nghị định 248/2026/NĐ-CP) */}
        <label className="mt-6 flex cursor-pointer items-start gap-3">
          <input id="co-terms" name="acceptTerms" type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-black" />
          <span className="text-[12px] leading-5 text-black/70">
            {c.termsBefore}
            <Link href="/chinh-sach" target="_blank" className="text-black underline">
              {c.terms}
            </Link>
            {c.termsAfter(brandName)}
          </span>
        </label>
        <button type="submit" disabled={pending || !quote || hasProblem} className="btn-dark mt-5 w-full disabled:opacity-50">
          {pending ? t.common.processing : method === "cod" ? c.placeOrder : c.payWith(methodInfo[method].label)}
        </button>
      </aside>
    </form>
  );
}
