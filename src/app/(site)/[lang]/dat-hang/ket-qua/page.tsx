import Link from "@/components/ui/LocaleLink";
import { getLocale, getT } from "@/i18n/server";
import { Suspense } from "react";
import { CircleCheck } from "lucide-react";
import { getPayloadClient } from "@/lib/cms";
import { checkOrderToken, findOrderByCode } from "@/server/orders";
import { formatDate, formatVnd } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { Img } from "@/components/ui/Img";

export async function generateMetadata() {
  const [locale, t] = await Promise.all([getLocale(), getT()]);
  return pageMeta({ locale, title: t.orderResult.metaTitle, path: "/dat-hang/ket-qua", noindex: true });
}

async function Result({ searchParams }: { searchParams: PageProps<"/[lang]/dat-hang/ket-qua">["searchParams"] }) {
  const sp = await searchParams;
  const code = typeof sp.code === "string" ? sp.code : "";
  const token = typeof sp.t === "string" ? sp.t : "";
  const t = await getT();
  const r = t.orderResult;
  const valid = code && token && checkOrderToken(code, token);
  const order = valid ? await findOrderByCode(await getPayloadClient(), code) : null;

  if (!order) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-[30px] font-medium">{r.notFound}</p>
        <Link href="/tra-cuu-don-hang" className="btn-outline mt-8">
          {r.track}
        </Link>
      </div>
    );
  }

  const paid = order.paymentStatus === "paid";
  return (
    <div className="mx-auto max-w-[720px] text-center">
      <CircleCheck size={44} strokeWidth={1.1} className="mx-auto" />
      <h1 className="mt-6 font-display text-[40px] leading-none font-medium uppercase sm:text-[48px]">{r.thanks}</h1>
      <p className="mx-auto mt-4 max-w-[480px] text-[14px] leading-6 text-black/60">
        {r.recordedBefore}
        <b className="font-medium text-black">#{order.code}</b>
        {r.recordedAfter}
        {order.paymentMethod === "cod" ? r.payOnDelivery : paid ? r.paid : "."}
        {r.emailSent(order.email)}
      </p>

      <article className="mt-10 border border-black bg-white p-6 text-left sm:p-8">
        <div className="flex flex-wrap justify-between gap-2 text-[12px] tracking-[0.08em] uppercase">
          <span>#{order.code}</span>
          <span className="text-black/55">
            {formatDate(order.createdAt)} · {t.orderStatus[order.status] ?? order.status}
          </span>
        </div>
        <ul className="mt-6 space-y-4">
          {order.items.map((i) => (
            <li key={`${i.name}${i.color}${i.size}`} className="grid grid-cols-[64px_1fr_auto] items-start gap-4">
              <div className="relative size-16 border border-black/15 bg-stone">
                <Img src={i.image} alt={i.name} sizes="64px" />
              </div>
              <div className="text-[12px]">
                <p className="font-medium tracking-[0.06em] uppercase">{i.name}</p>
                <p className="mt-1 text-black/55">
                  {t.common.colorSize(i.color, i.size)} · ×{i.qty}
                </p>
              </div>
              <p className="text-[12px]">{formatVnd(i.price * i.qty)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t border-black pt-4 text-[15px] font-medium">
          <span className="uppercase">{r.total}</span>
          <span>{formatVnd(order.total)}</span>
        </div>
        <p className="mt-6 text-[12px] leading-5 text-black/60">
          {r.deliverTo}: {order.shipping.name} — {order.shipping.phone}
          <br />
          {order.shipping.line}, {order.shipping.ward}, {order.shipping.province}
        </p>
      </article>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/danh-muc/tat-ca" className="btn-dark sm:w-60">
          {r.continue}
        </Link>
        <Link href="/tra-cuu-don-hang" className="btn-outline sm:w-60">
          {r.track}
        </Link>
      </div>
    </div>
  );
}

export default function OrderResultPage(props: PageProps<"/[lang]/dat-hang/ket-qua">) {
  return (
    <div className="bg-paper px-4 py-20">
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <Result searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
