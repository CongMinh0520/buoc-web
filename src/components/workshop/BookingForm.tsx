"use client";

import { useState, useTransition } from "react";
import { FieldLabel } from "@/components/account/AccountShell";
import { createBookingAction } from "@/server/actions/site";

type Session = { title: string; day: string; time: string; seats: number };

export function BookingForm({ sessions, stores, note }: { sessions: Session[]; stores: string[]; note?: string | null }) {
  const [session, setSession] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const label = (s: Session) => `${s.title} — ${s.day} ${s.time}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="eyebrow text-black/50">Lịch tuần này</p>
        <ul className="mt-4 border-t border-black">
          {sessions.map((s, i) => (
            <li key={s.title + s.day + s.time} className="border-b border-black">
              <label className="flex cursor-pointer items-start gap-4 py-5">
                <input type="radio" name="session" checked={session === i} onChange={() => setSession(i)} className="mt-1 accent-black" />
                <span className="flex-1">
                  <span className="block text-[13px] font-medium tracking-[0.06em] uppercase">{s.title}</span>
                  <span className="mt-1 block text-[12px] text-black/55">
                    {s.day} · {s.time}
                  </span>
                </span>
                <span className="text-[11px] tracking-[0.08em] text-black/50 uppercase">Còn {s.seats} chỗ</span>
              </label>
            </li>
          ))}
        </ul>
        {note && <p className="mt-4 text-[12px] leading-5 text-black/50">{note}</p>}
      </div>

      {done ? (
        <div className="border border-black bg-white p-8" role="status">
          <p className="label-caps font-medium">Đã ghi nhận đăng ký</p>
          <p className="mt-3 text-[14px] leading-6 text-black/65">
            Chúng tôi sẽ gọi xác nhận trong vòng 24 giờ cho buổi “{sessions[session]?.title}” ({sessions[session]?.day}, {sessions[session]?.time}).
          </p>
          <button onClick={() => setDone(false)} className="btn-outline mt-6">
            Đăng ký buổi khác
          </button>
        </div>
      ) : (
        <form
          className="grid gap-5 border border-black bg-white p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            setError(null);
            start(async () => {
              const r = await createBookingAction({
                name: String(f.get("name") ?? ""),
                phone: String(f.get("phone") ?? ""),
                store: String(f.get("store") ?? ""),
                session: sessions[session] ? label(sessions[session]) : "",
                website: String(f.get("website") ?? ""),
              });
              if (r.ok) setDone(true);
              else setError(r.error);
            });
          }}
        >
          <p className="label-caps font-medium">Đặt lịch</p>
          <label>
            <FieldLabel required>Họ và tên</FieldLabel>
            <input id="booking-name" name="name" required maxLength={100} className="field" placeholder="Nhập họ và tên" autoComplete="name" />
          </label>
          <label>
            <FieldLabel required>Số điện thoại</FieldLabel>
            <input id="booking-phone" name="phone" required type="tel" maxLength={15} className="field" placeholder="Nhập số điện thoại" autoComplete="tel" />
          </label>
          <label>
            <FieldLabel>Cửa hàng</FieldLabel>
            <select id="booking-store" name="store" className="field">
              {stores.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          {/* bẫy bot: ẩn với người dùng */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          {error && (
            <p role="alert" className="text-[12px] text-danger">
              {error}
            </p>
          )}
          <button type="submit" disabled={pending} className="btn-dark mt-2 disabled:opacity-60">
            {pending ? "Đang gửi…" : "Giữ chỗ"}
          </button>
        </form>
      )}
    </div>
  );
}
