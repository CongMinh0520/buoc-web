import { Suspense } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { AddressBook } from "@/components/account/AddressBook";
import { AccountSkeleton, LoginPrompt } from "@/components/account/LoginPrompt";
import { getCurrentCustomer } from "@/server/auth";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Sổ địa chỉ", path: "/tai-khoan/so-dia-chi", noindex: true });

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

export default function AddressPage() {
  return (
    <AccountShell title="Sổ địa chỉ" active="address">
      <Suspense fallback={<AccountSkeleton />}>
        <Content />
      </Suspense>
    </AccountShell>
  );
}
