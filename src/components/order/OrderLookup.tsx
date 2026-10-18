"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { lookupOrderAction } from "@/server/actions/checkout";
import { formatDate, formatNumber } from "@/lib/format";
import { Img } from "@/components/ui/Img";

type Found = Extract<Awaited<ReturnType<typeof lookupOrderAction>>, { ok: true }>["data"];

const steps = [
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "processing", label: "Đang xử lý" },
  { key: "shipping", label: "Đang giao hàng" },
  { key: "delivered", label: "Đã giao hàng" },
];
const stepIndex: Record<string, number> = { pending: -2, confirmed: 0, processing: 1, shipping: 2, delivered: 3, cancelled: -1 };
const payLabel: Record<string, string> = { cod: "Thanh toán khi nhận hàng", vnpay: "VNPay", momo: "Ví MoMo" };
const vnd = (n: number) => `VND ${formatNumber(n)}`;

export function OrderLookup() {
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<Found | null>(null);
  const [pending, start] = useTransition();

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
              Mã đơn hàng <span className="font-medium">{found.code}</span>
            </p>
            <p className="text-[12px] text-black/50">Đặt ngày {formatDate(found.date)}</p>
          </div>
          {current === -1 && <p className="mt-6 inline-block border border-black px-4 py-2 text-[12px] tracking-[0.1em] uppercase">Đã hủy</p>}
          {current === -2 && <p className="mt-6 inline-block border border-black px-4 py-2 text-[12px] tracking-[0.1em] uppercase">Chờ thanh toán</p>}
          {current >= 0 && (
            <ol className="mt-8 grid grid-cols-4">
              {steps.map((s, i) => {
                const done = i <= current;
                return (
                  <li key={s.key} className="relative flex flex-col items-center text-center">
                    {i > 0 && <span className={`absolute top-4 right-1/2 h-px w-full ${i <= current ? "bg-black" : "bg-black/15"}`} />}
                    <span className={`relative grid size-8 place-items-center rounded-full border text-[12px] ${done ? "border-black bg-black text-white" : "border-black/25 bg-white text-black/40"}`}>
                      {i < current ? <Check size={14} strokeWidth={2} /> : i + 1}
                    </span>
                    <span className={`mt-3 text-[10px] tracking-[0.1em] uppercase sm:text-[11px] ${done ? "text-black" : "text-black/40"}`}>{s.label}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </article>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <section className="border border-black bg-white p-6 sm:p-8">
            <h2 className="text-[12px] font-medium tracking-[0.12em] uppercase">Chi tiết đơn hàng ({qty} sản phẩm)</h2>
            <ul className="mt-6 space-y-5">
              {found.items.map((i) => (
                <li key={`${i.name}${i.color}${i.size}`} className="grid grid-cols-[72px_1fr_auto] items-start gap-4">
                  <div className="relative size-[72px] border border-black bg-white">
                    <Img src={i.image} alt={i.name} sizes="72px" />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium tracking-[0.08em] uppercase">{i.name}</p>
                    <p className="mt-1 text-[11px] text-black/50">
                      {i.color} · Size {i.size} · SL: {i.qty}
                    </p>
                  </div>
                  <p className="text-[12px] whitespace-nowrap">{vnd(i.price * i.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-8 space-y-2 border-t border-black/15 pt-5 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-black/55 uppercase">Tạm tính</dt>
                <dd>{vnd(found.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-black/55 uppercase">Phí vận chuyển</dt>
                <dd>{found.shippingFee ? vnd(found.shippingFee) : "Miễn phí"}</dd>
              </div>
              <div className="flex justify-between border-t border-black pt-3 text-[14px] font-medium">
                <dt className="uppercase">Tổng cộng</dt>
                <dd>{vnd(found.total)}</dd>
              </div>
              <p className="text-right text-[11px] text-black/45">Giá đã bao gồm VAT</p>
            </dl>
          </section>

          <section className="border border-black bg-white p-6 sm:p-8">
            <h2 className="text-[12px] font-medium tracking-[0.12em] uppercase">Giao hàng &amp; thanh toán</h2>
            <dl className="mt-6 space-y-5 text-[13px]">
              <div>
                <dt className="eyebrow text-black/45">Người nhận</dt>
                <dd className="mt-1">
                  {found.shipping.name} — {found.shipping.phone}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-black/45">Địa chỉ giao hàng</dt>
                <dd className="mt-1 leading-5 text-black/70">{found.shipping.address}</dd>
              </div>
              <div>
                <dt className="eyebrow text-black/45">Phương thức thanh toán</dt>
                <dd className="mt-1">
                  {payLabel[found.paymentMethod] ?? found.paymentMethod}
                  {found.paymentStatus === "paid" ? " · Đã thanh toán" : ""}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => setFound(null)} className="btn-outline sm:w-60">
            Tra cứu đơn hàng khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-[480px] border border-black bg-white p-6 sm:p-8">
      <h2 className="text-[12px] font-medium tracking-[0.12em] uppercase">Thông tin tra cứu</h2>
      <label className="mt-6 block">
        <span className="mb-1.5 block text-[12px] tracking-[0.1em] text-subtle uppercase">
          Mã đơn hàng <span className="text-danger">*</span>
        </span>
        <input id="lookup-code" name="code" required maxLength={20} className="field" placeholder="Mã đơn trong email xác nhận" autoComplete="off" />
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-[12px] tracking-[0.1em] text-subtle uppercase">
          Số điện thoại người nhận <span className="text-danger">*</span>
        </span>
        <input id="lookup-phone" name="phone" type="tel" required maxLength={15} className="field" placeholder="VD: 0912345678" autoComplete="tel" />
      </label>
      {error && (
        <p id="lookup-error" role="alert" className="mt-3 text-[12px] text-danger">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-dark mt-6 w-full disabled:opacity-60">
        {pending ? "Đang tra cứu…" : "Tra cứu"}
      </button>
      <p className="mt-4 text-center text-[11px] text-black/45">Cần cả mã đơn và số điện thoại để bảo vệ thông tin của bạn.</p>
    </form>
  );
}
