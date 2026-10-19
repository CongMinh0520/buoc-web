import Link from "@/components/ui/LocaleLink";
import { getLocale, getT } from "@/i18n/server";
import { Suspense } from "react";
import { CircleAlert } from "lucide-react";
import { getPayloadClient, getSiteSettings } from "@/lib/cms";
import { checkOrderToken, findOrderByCode } from "@/server/orders";
import { pageMeta } from "@/lib/seo";
import { PaymentRetry } from "@/components/checkout/PaymentRetry";

export async function generateMetadata() {
  const [locale, t] = await Promise.all([getLocale(), getT()]);
  return pageMeta({ locale, title: t.paymentFailed.metaTitle, path: "/thanh-toan-that-bai", noindex: true });
}

async function Actions({ searchParams }: { searchParams: PageProps<"/[lang]/thanh-toan-that-bai">["searchParams"] }) {
  const sp = await searchParams;
  const code = typeof sp.code === "string" ? sp.code : "";
  const token = typeof sp.t === "string" ? sp.t : "";
  const order = code && token && checkOrderToken(code, token) ? await findOrderByCode(await getPayloadClient(), code) : null;
  if (order && order.status === "pending" && order.paymentStatus !== "paid" && order.paymentMethod !== "cod") {
    return <PaymentRetry code={order.code} token={token} method={order.paymentMethod as "vnpay" | "momo"} />;
  }
  const t = await getT();
  return (
    <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
      <Link href="/gio-hang" className="btn-dark sm:w-60">
        {t.paymentFailed.backToCart}
      </Link>
      <Link href="/tra-cuu-don-hang" className="btn-outline sm:w-60">
        {t.paymentFailed.track}
      </Link>
    </div>
  );
}

export default async function PaymentFailedPage(props: PageProps<"/[lang]/thanh-toan-that-bai">) {
  const [s, t] = await Promise.all([getSiteSettings(), getT()]);
  const f = t.paymentFailed;
  return (
    <div className="bg-paper px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-[640px] text-center">
        <CircleAlert size={40} strokeWidth={1.1} className="mx-auto text-black/70" />
        <h1 className="mt-6 font-display text-[40px] leading-none font-medium uppercase sm:text-[48px]">{f.title}</h1>
        <p className="mx-auto mt-4 max-w-[480px] text-[14px] leading-6 text-black/60">
          {f.desc}
        </p>

        <article className="mt-10 border border-black bg-white p-6 text-left sm:p-8">
          <h2 className="text-[12px] font-medium tracking-[0.12em] uppercase">{f.info}</h2>
          <p className="mt-4 text-[15px] font-medium">{f.unpaid}</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] leading-[22px] text-black/65 marker:text-black/35">
            <li>{f.noCharge}</li>
            <li>{f.held}</li>
            <li>{f.charged(s.hotline, s.email)}</li>
          </ul>
        </article>

        <Suspense fallback={null}>
          <Actions searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
