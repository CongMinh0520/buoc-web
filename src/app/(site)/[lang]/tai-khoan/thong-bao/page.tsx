import { Suspense } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSkeleton, LoginPrompt } from "@/components/account/LoginPrompt";
import { NotificationList } from "@/components/account/NotificationList";
import { getCurrentCustomer } from "@/server/auth";
import { getPayloadClient } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Thông báo", path: "/tai-khoan/thong-bao", noindex: true });

async function Content() {
  const c = await getCurrentCustomer();
  if (!c) return <LoginPrompt />;
  const payload = await getPayloadClient();
  const res = await payload.find({ collection: "notifications", user: c, overrideAccess: false, sort: "-createdAt", limit: 100, depth: 0 });
  const items = res.docs.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    date: n.createdAt,
    unread: !n.readAt,
    cta: n.ctaHref ? { href: n.ctaHref, label: n.ctaLabel || "Xem chi tiết" } : null,
  }));
  return <NotificationList items={items} />;
}

export default function NoticePage() {
  return (
    <AccountShell title="Thông báo của tôi" active="notice">
      <Suspense fallback={<AccountSkeleton />}>
        <Content />
      </Suspense>
    </AccountShell>
  );
}
