"use client";

import { useState, useTransition } from "react";
import { retryPaymentAction, switchToCodAction } from "@/server/actions/checkout";
import { useLocalePath, useT } from "@/components/providers/LocaleProvider";

export function PaymentRetry({ code, token, method }: { code: string; token: string; method: "vnpay" | "momo" }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const t = useT();
  const to = useLocalePath();

  const go = (fn: () => Promise<{ ok: boolean; error?: string; data?: { redirect: string } }>) =>
    start(async () => {
      setError(null);
      const r = await fn();
      if (r.ok && r.data) window.location.assign(to(r.data.redirect));
      else setError(r.error ?? t.common.error);
    });

  return (
    <div className="mt-10">
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button disabled={pending} onClick={() => go(() => retryPaymentAction({ code, token, method }))} className="btn-dark disabled:opacity-60 sm:w-60">
          {t.checkout.retry}
        </button>
        <button disabled={pending} onClick={() => go(() => switchToCodAction({ code, token }))} className="btn-outline disabled:opacity-60 sm:w-60">
          {t.checkout.switchCod}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-[12px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
