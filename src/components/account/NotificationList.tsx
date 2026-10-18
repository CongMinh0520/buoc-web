"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { notificationAction } from "@/server/actions/account";
import { formatDate } from "@/lib/format";

export type NotificationItem = {
  id: number;
  title: string;
  body: string;
  date: string;
  unread: boolean;
  cta: { href: string; label: string } | null;
};
type Op = { op: "read" | "delete" | "read-all" | "delete-all"; id?: number };

export function NotificationList({ items }: { items: NotificationItem[] }) {
  const router = useRouter();
  const [, start] = useTransition();
  // Cập nhật lạc quan, rồi đồng bộ lại từ server
  const [list, apply] = useOptimistic(items, (l: NotificationItem[], a: Op) => {
    if (a.op === "read-all") return l.map((n) => ({ ...n, unread: false }));
    if (a.op === "delete-all") return [];
    if (a.op === "read")
      return l.map((n) => (n.id === a.id ? { ...n, unread: false } : n));
    return l.filter((n) => n.id !== a.id);
  });
  const act = (a: Op) =>
    start(async () => {
      apply(a);
      await notificationAction(a);
      router.refresh();
    });
  const unread = list.filter((n) => n.unread).length;

  return (
    <div className="max-w-[960px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] tracking-[0.08em] text-black/55 uppercase">
          {unread > 0
            ? `Có ${unread} thông báo chưa đọc`
            : "Không có thông báo chưa đọc"}
        </p>
        {list.length > 0 && (
          <div className="flex gap-5 text-[11px] tracking-[0.1em] uppercase">
            <button
              onClick={() => act({ op: "read-all" })}
              className="underline underline-offset-4 disabled:opacity-40"
              disabled={unread === 0}
            >
              Đánh dấu tất cả đã đọc
            </button>
            <button
              onClick={() =>
                confirm("Xóa tất cả thông báo?") && act({ op: "delete-all" })
              }
              className="text-black/55 underline underline-offset-4 hover:text-black"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {list.length === 0 ? (
        <p className="mt-8 border border-black/15 bg-white py-16 text-center text-[13px] text-black/50">
          Bạn chưa có thông báo nào.
        </p>
      ) : (
        <ul className="mt-8 border border-black bg-white">
          {list.map((n, i) => (
            <li
              key={n.id}
              className={`px-5 py-6 sm:px-6 ${i > 0 ? "border-t border-black/15" : ""} ${n.unread ? "" : "bg-paper/60"}`}
            >
              <div className="flex gap-4">
                <span
                  className={`mt-1.5 size-2 shrink-0 ${n.unread ? "bg-black" : "border border-black/30"}`}
                  aria-label={n.unread ? "Chưa đọc" : "Đã đọc"}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p
                      className={`text-[13px] tracking-[0.04em] ${n.unread ? "font-medium" : ""}`}
                    >
                      {n.title}
                    </p>
                    <span className="text-[11px] text-black/45">
                      {formatDate(n.date)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-5 text-black/60">
                    {n.body}{" "}
                    {n.cta && (
                      <Link
                        href={n.cta.href}
                        className="text-black underline underline-offset-2"
                      >
                        {n.cta.label}
                      </Link>
                    )}
                  </p>
                  <div className="mt-4 flex gap-5 text-[11px] tracking-[0.1em] text-black/55 uppercase">
                    {n.unread && (
                      <button
                        onClick={() => act({ op: "read", id: n.id })}
                        className="hover:text-black"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                    <button
                      onClick={() => act({ op: "delete", id: n.id })}
                      className="hover:text-black"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
