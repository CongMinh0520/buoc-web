import { Suspense } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSkeleton, LoginPrompt } from "@/components/account/LoginPrompt";
import { NotificationList } from "@/components/account/NotificationList";
import { getCurrentCustomer } from "@/server/auth";
import { getPayloadClient } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { localizeGenerated } from "@/i18n/generated";
import { getLocale, getT } from "@/i18n/server";

export async function generateMetadata() {
  const [locale, t] = await Promise.all([getLocale(), getT()]);
  return pageMeta({ locale, title: t.account.titles.notice, path: "/tai-khoan/thong-bao", noindex: true });
}

async function Content() {
  const c = await getCurrentCustomer();
  if (!c) return <LoginPrompt />;
  const [locale, t] = await Promise.all([getLocale(), getT()]);
  const payload = await getPayloadClient();
  const res = await payload.find({ collection: "notifications", user: c, overrideAccess: false, sort: "-createdAt", limit: 100, depth: 0 });
  const items = res.docs.map((n) => ({
    id: n.id,
    title: localizeGenerated(n.title, locale),
    body: localizeGenerated(n.body, locale),
    date: n.createdAt,
    unread: !n.readAt,
    cta: n.ctaHref ? { href: n.ctaHref, label: n.ctaLabel ? localizeGenerated(n.ctaLabel, locale) : t.account.notifications.viewDetails } : null,
  }));
  return <NotificationList items={items} />;
}

export default async function NoticePage() {
  const t = await getT();
  return (
    <AccountShell title={t.account.titles.notice} active="notice">
      <Suspense fallback={<AccountSkeleton />}>
        <Content />
      </Suspense>
    </AccountShell>
  );
}
