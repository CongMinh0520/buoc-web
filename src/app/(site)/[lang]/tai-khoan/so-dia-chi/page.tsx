import { Suspense } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { AddressBook } from "@/components/account/AddressBook";
import { AccountSkeleton, LoginPrompt } from "@/components/account/LoginPrompt";
import { getCurrentCustomer } from "@/server/auth";
import { pageMeta } from "@/lib/seo";
import { getLocale, getT } from "@/i18n/server";

export async function generateMetadata() {
  const [locale, t] = await Promise.all([getLocale(), getT()]);
  return pageMeta({ locale, title: t.account.titles.address, path: "/tai-khoan/so-dia-chi", noindex: true });
}

async function Content() {
  const c = await getCurrentCustomer();
  if (!c) return <LoginPrompt />;
  const addresses = (c.addresses ?? []).map((a) => ({
    label: a.label,
    name: a.name,
    phone: a.phone,
    line: a.line,
    province: a.province,
    ward: a.ward,
    isDefault: Boolean(a.isDefault),
  }));
  return <AddressBook addresses={addresses} />;
}

export default async function AddressPage() {
  const t = await getT();
  return (
    <AccountShell title={t.account.titles.address} active="address">
      <Suspense fallback={<AccountSkeleton />}>
        <Content />
      </Suspense>
    </AccountShell>
  );
}
