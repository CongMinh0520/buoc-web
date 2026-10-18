"use client";

import { useAuthModal } from "@/components/providers/AuthProvider";

export function LoginPrompt() {
  const { open } = useAuthModal();
  return (
    <div className="max-w-[560px] border border-black bg-white p-8">
      <p className="label-caps font-medium">Bạn chưa đăng nhập</p>
      <p className="mt-3 text-[14px] leading-6 text-black/60">
        Đăng nhập để xem thông tin tài khoản, đơn hàng, điểm thưởng và thông báo
        của bạn.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => open("login")} className="btn-dark">
          Đăng nhập
        </button>
        <button onClick={() => open("register")} className="btn-outline">
          Tạo tài khoản
        </button>
      </div>
    </div>
  );
}

export function AccountSkeleton() {
  return (
    <div
      className="max-w-[960px] animate-pulse space-y-4"
      aria-busy="true"
      aria-label="Đang tải"
    >
      <div className="h-4 w-48 bg-black/10" />
      <div className="h-10 bg-black/5" />
      <div className="h-10 bg-black/5" />
      <div className="h-10 w-2/3 bg-black/5" />
    </div>
  );
}
