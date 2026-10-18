"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FieldLabel, SectionTitle } from "./AccountShell";
import { deleteAccountAction } from "@/server/actions/account";
import { useAuthModal } from "@/components/providers/AuthProvider";

/** Quyền của chủ thể dữ liệu: tải dữ liệu của tôi, xóa tài khoản */
export function PrivacyPanel() {
  const { setCustomer } = useAuthModal();
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <section className="mt-14 max-w-[960px]">
      <SectionTitle>Dữ liệu cá nhân</SectionTitle>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[560px] text-[13px] leading-5 text-black/60">
          Tải xuống toàn bộ thông tin chúng tôi lưu về bạn: hồ sơ, sổ địa chỉ, đơn hàng, điểm thưởng và thông báo (tệp JSON).
        </p>
        <a href="/api/account/export" download className="btn-outline shrink-0">
          Tải dữ liệu của tôi
        </a>
      </div>

      <div className="mt-8 border-t border-black/15 pt-6">
        {!openDelete ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[560px] text-[13px] leading-5 text-black/60">
              Xóa vĩnh viễn tài khoản, sổ địa chỉ, điểm thưởng và thông báo. Đơn hàng đã đặt vẫn được lưu theo thời hạn pháp luật yêu cầu (phục vụ hóa
              đơn, bảo hành, khiếu nại) nhưng không còn gắn với tài khoản.
            </p>
            <button type="button" onClick={() => setOpenDelete(true)} className="shrink-0 text-[12px] tracking-[0.1em] text-danger uppercase underline underline-offset-4">
              Xóa tài khoản
            </button>
          </div>
        ) : (
          <form
            className="border border-danger/40 bg-white p-6"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setError(null);
              start(async () => {
                const r = await deleteAccountAction({ password: String(f.get("password") ?? ""), confirm: String(f.get("confirm") ?? "") });
                if (!r.ok) return setError(r.error);
                setCustomer(null);
                router.replace("/");
                router.refresh();
              });
            }}
          >
            <p className="text-[13px] font-medium">Xác nhận xóa tài khoản</p>
            <p className="mt-1 text-[12px] text-black/60">Thao tác này không thể hoàn tác. Điểm thưởng hiện có sẽ bị hủy.</p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label>
                <FieldLabel required>Mật khẩu hiện tại</FieldLabel>
                <input id="del-password" name="password" type="password" required className="field" autoComplete="current-password" />
              </label>
              <label>
                <FieldLabel required>Gõ chữ XÓA để xác nhận</FieldLabel>
                <input id="del-confirm" name="confirm" required className="field" autoComplete="off" />
              </label>
            </div>
            {error && (
              <p role="alert" className="mt-4 text-[12px] text-danger">
                {error}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setOpenDelete(false)} className="px-4 text-[12px] tracking-[0.1em] text-black/55 uppercase underline">
                Hủy
              </button>
              <button type="submit" disabled={pending} className="btn-dark bg-danger disabled:opacity-60">
                Xóa vĩnh viễn
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
