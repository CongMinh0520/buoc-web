import Link from "next/link";
import { Suspense } from "react";
import { CircleAlert } from "lucide-react";
import { getPayloadClient, getSiteSettings } from "@/lib/cms";
import { checkOrderToken, findOrderByCode } from "@/server/orders";
import { pageMeta } from "@/lib/seo";
import { PaymentRetry } from "@/components/checkout/PaymentRetry";

export const metadata = pageMeta({ title: "Thanh toán thất bại", path: "/thanh-toan-that-bai", noindex: true });

async function Actions({ searchParams }: { searchParams: PageProps<"/thanh-toan-that-bai">["searchParams"] }) {
  const sp = await searchParams;
  const code = typeof sp.code === "string" ? sp.code : "";
  const t = typeof sp.t === "string" ? sp.t : "";
  const order = code && t && checkOrderToken(code, t) ? await findOrderByCode(await getPayloadClient(), code) : null;
  if (order && order.status === "pending" && order.paymentStatus !== "paid" && order.paymentMethod !== "cod") {
    return <PaymentRetry code={order.code} token={t} method={order.paymentMethod as "vnpay" | "momo"} />;
  }
  return (
    <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
      <Link href="/gio-hang" className="btn-dark sm:w-60">
        Về giỏ hàng
      </Link>
      <Link href="/tra-cuu-don-hang" className="btn-outline sm:w-60">
        Tra cứu đơn hàng
      </Link>
    </div>
  );
}

export default async function PaymentFailedPage(props: PageProps<"/thanh-toan-that-bai">) {
  const s = await getSiteSettings();
  return (
    <div className="bg-paper px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-[640px] text-center">
        <CircleAlert size={40} strokeWidth={1.1} className="mx-auto text-black/70" />
        <h1 className="mt-6 font-display text-[40px] leading-none font-medium uppercase sm:text-[48px]">Thanh toán thất bại</h1>
        <p className="mx-auto mt-4 max-w-[480px] text-[14px] leading-6 text-black/60">
          Giao dịch chưa được hoàn tất. Vui lòng kiểm tra lại thông tin thẻ hoặc chọn phương thức thanh toán khác.
        </p>

        <article className="mt-10 border border-black bg-white p-6 text-left sm:p-8">
          <h2 className="text-[12px] font-medium tracking-[0.12em] uppercase">Thông tin giao dịch</h2>
          <p className="mt-4 text-[15px] font-medium">Đơn hàng chưa được thanh toán</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] leading-[22px] text-black/65 marker:text-black/35">
            <li>Không có khoản tiền nào bị trừ. Bạn có thể thử thanh toán lại hoặc chuyển sang thanh toán khi nhận hàng.</li>
            <li>Đơn hàng được giữ trong 24 giờ.</li>
            <li>
              Nếu tài khoản đã bị trừ tiền nhưng đơn chưa được xác nhận, vui lòng gọi {s.hotline} hoặc email {s.email} để được kiểm tra trong 24 giờ.
            </li>
          </ul>
        </article>

        <Suspense fallback={null}>
          <Actions searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
