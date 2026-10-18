"use client";

import { useState, useTransition } from "react";
import { retryPaymentAction, switchToCodAction } from "@/server/actions/checkout";

export function PaymentRetry({ code, token, method }: { code: string; token: string; method: "vnpay" | "momo" }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const go = (fn: () => Promise<{ ok: boolean; error?: string; data?: { redirect: string } }>) =>
    start(async () => {
      setError(null);
      const r = await fn();
      if (r.ok && r.data) window.location.assign(r.data.redirect);
      else setError(r.error ?? "Có lỗi xảy ra.");
    });

  return (
    <div className="mt-10">
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button disabled={pending} onClick={() => go(() => retryPaymentAction({ code, token, method }))} className="btn-dark disabled:opacity-60 sm:w-60">
          Thử lại thanh toán
        </button>
        <button disabled={pending} onClick={() => go(() => switchToCodAction({ code, token }))} className="btn-outline disabled:opacity-60 sm:w-60">
          Chuyển sang thanh toán khi nhận hàng
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
