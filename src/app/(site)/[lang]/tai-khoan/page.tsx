import { Suspense } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSkeleton, LoginPrompt } from "@/components/account/LoginPrompt";
import { ProfileForm } from "@/components/account/ProfileForm";
import { PrivacyPanel } from "@/components/account/PrivacyPanel";
import { getCurrentCustomer } from "@/server/auth";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Thông tin tài khoản",
  path: "/tai-khoan",
  noindex: true,
});

async function Content() {
  const c = await getCurrentCustomer();
  if (!c) return <LoginPrompt />;
  return (
    <>
      <ProfileForm
        profile={{
          name: c.name,
          email: c.email,
          phone: c.phone ?? "",
          gender: c.gender ?? "",
          birthday: c.birthday ? c.birthday.slice(0, 10) : "",
          shoeSize: c.shoeSize ?? "",
          marketingOptIn: c.marketingOptIn ?? false,
        }}
      />
      <PrivacyPanel />
    </>
  );
}

export default function AccountInfoPage() {
  return (
    <AccountShell title="Thông tin tài khoản" active="info">
      <Suspense fallback={<AccountSkeleton />}>
        <Content />
      </Suspense>
    </AccountShell>
  );
}
