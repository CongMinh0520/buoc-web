import { OrderLookup } from "@/components/order/OrderLookup";
import { getSiteSettings } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata() {
  const s = await getSiteSettings();
  return pageMeta({ title: "Tra cứu đơn hàng", description: `Kiểm tra trạng thái đơn hàng ${s.brandName} bằng mã đơn và số điện thoại.`, path: "/tra-cuu-don-hang" });
}

export default function OrderLookupPage() {
  return (
    <div className="bg-paper px-4 pt-14 pb-24 sm:px-10">
      <header className="mb-10 text-center">
        <h1 className="font-display text-[44px] leading-none font-medium uppercase sm:text-[52px]">Tra cứu đơn hàng</h1>
        <p className="mx-auto mt-4 max-w-[460px] text-[14px] leading-6 text-black/55">
          Nhập mã đơn hàng và số điện thoại người nhận để xem chi tiết và trạng thái giao hàng.
        </p>
      </header>
      <OrderLookup />
    </div>
  );
}
