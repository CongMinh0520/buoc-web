import { Suspense } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSkeleton, LoginPrompt } from "@/components/account/LoginPrompt";
import { OrderList, type AccountOrder, type OrderStatus } from "@/components/account/OrderList";
import { getCurrentCustomer } from "@/server/auth";
import { getPayloadClient } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Lịch sử đơn hàng", path: "/tai-khoan/lich-su-don-hang", noindex: true });

async function Content() {
  const c = await getCurrentCustomer();
  if (!c) return <LoginPrompt />;
  const payload = await getPayloadClient();
  // overrideAccess: false + user → Payload chỉ trả về đơn của chính khách này
  const res = await payload.find({ collection: "orders", user: c, overrideAccess: false, sort: "-createdAt", limit: 50, depth: 0 });
  const orders: AccountOrder[] = res.docs.map((o) => ({
    id: `#${o.code}`,
    date: o.createdAt,
    status: o.status as OrderStatus,
    payment: o.paymentMethod,
    address: { name: `${o.shipping.name.toUpperCase()} — ${o.shipping.phone}`, line: `${o.shipping.line}, ${o.shipping.ward}, ${o.shipping.province}` },
    items: o.items.map((i) => ({ name: i.name, price: i.price, qty: i.qty, image: i.image ?? "", note: `Màu ${i.color} · Size ${i.size}` })),
  }));
  return <OrderList orders={orders} />;
}

export default function OrdersPage() {
  return (
    <AccountShell title="Lịch sử đơn hàng" active="orders">
      <Suspense fallback={<AccountSkeleton />}>
        <Content />
      </Suspense>
    </AccountShell>
  );
}
