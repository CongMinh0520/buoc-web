"use client";

import { useAuthModal } from "@/components/providers/AuthProvider";
import { useT } from "@/components/providers/LocaleProvider";

export function LoginPrompt() {
  const { open } = useAuthModal();
  const t = useT();
  return (
    <div className="max-w-[560px] border border-black bg-white p-8">
      <p className="label-caps font-medium">{t.account.loggedOut}</p>
      <p className="mt-3 text-[14px] leading-6 text-black/60">
        {t.account.loggedOutDesc}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => open("login")} className="btn-dark">
          {t.account.login}
        </button>
        <button onClick={() => open("register")} className="btn-outline">
          {t.account.createAccount}
        </button>
      </div>
    </div>
  );
}

export function AccountSkeleton() {
  const t = useT();
  return (
    <div
      className="max-w-[960px] animate-pulse space-y-4"
      aria-busy="true"
      aria-label={t.common.loading}
    >
      <div className="h-4 w-48 bg-black/10" />
      <div className="h-10 bg-black/5" />
      <div className="h-10 bg-black/5" />
      <div className="h-10 w-2/3 bg-black/5" />
    </div>
  );
}
