"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatDate, formatVnd } from "@/lib/format";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipping"
  | "delivered"
  | "cancelled";
const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "Chờ thanh toán",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao hàng",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
};
const payLabel: Record<string, string> = {
  cod: "COD",
  vnpay: "VNPay",
  momo: "MoMo",
};

export type AccountOrder = {
  id: string;
  date: string;
  status: OrderStatus;
  payment: string;
  address: { name: string; line: string };
  items: {
    name: string;
    price: number;
    qty: number;
    image: string;
    note: string;
  }[];
};
import { Img } from "@/components/ui/Img";

const tabs: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "processing", label: "Đang xử lý" },
  { key: "pending", label: "Chờ thanh toán" },
  { key: "shipping", label: "Đang giao hàng" },
  { key: "delivered", label: "Đã giao hàng" },
  { key: "cancelled", label: "Đã hủy" },
];

const vnd = (n: number) => "VND " + formatVnd(n).replace(" ₫", "");

export function OrderList({ orders }: { orders: AccountOrder[] }) {
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [open, setOpen] = useState<string | null>(orders[0]?.id ?? null);
  const list = tab === "all" ? orders : orders.filter((o) => o.status === tab);

  return (
    <div className="max-w-[960px]">
      <div
        className="no-scrollbar flex gap-6 overflow-x-auto border-b border-black"
        role="tablist"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px shrink-0 border-b-2 pb-4 text-[11px] tracking-[0.12em] uppercase ${
              tab === t.key
                ? "border-black text-black"
                : "border-transparent text-black/45 hover:text-black"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="py-20 text-center text-[13px] text-black/50">
          {orders.length === 0
            ? "Bạn chưa có đơn hàng nào."
            : "Chưa có đơn hàng nào ở trạng thái này."}
        </p>
      ) : (
        <div className="mt-10 border-t border-black">
          {list.map((o) => {
            const isOpen = open === o.id;
            const total = o.items.reduce((s, i) => s + i.price * i.qty, 0);
            const qty = o.items.reduce((s, i) => s + i.qty, 0);
            return (
              <article key={o.id} className="border-b border-black">
                <button
                  onClick={() => setOpen(isOpen ? null : o.id)}
                  aria-expanded={isOpen}
                  className="grid w-full grid-cols-2 items-center gap-x-4 gap-y-2 p-5 text-left sm:p-6 md:grid-cols-[1.4fr_1fr_1.2fr_1.4fr_0.9fr_auto]"
                >
                  <span className="text-[12px] font-medium tracking-[0.08em]">
                    {o.id}
                  </span>
                  <span className="text-[11px] tracking-[0.08em] text-black/55 max-md:text-right">
                    {formatDate(o.date)}
                  </span>
                  <span className="text-[12px] tracking-[0.06em]">
                    {vnd(total)}
                  </span>
                  <span className="flex items-center gap-2 text-[11px] tracking-[0.08em] uppercase max-md:justify-end">
                    <span
                      className={`size-2.5 ${o.status === "cancelled" ? "border border-black" : "bg-black"}`}
                    />
                    {orderStatusLabel[o.status]}
                  </span>
                  <span className="text-[11px] tracking-[0.08em] text-black/55 uppercase">
                    {String(qty).padStart(2, "0")} sản phẩm
                  </span>
                  <span className="flex items-center justify-end gap-1.5 text-[11px] font-medium tracking-[0.1em] uppercase">
                    {isOpen ? "Thu lại" : "Xem chi tiết"}
                    <ChevronDown
                      size={16}
                      strokeWidth={1.5}
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div className="grid border-t border-black bg-paper-2 md:grid-cols-[3fr_2fr]">
                    <div className="space-y-6 p-5 sm:p-6 md:border-r md:border-black">
                      {o.items.map((i) => (
                        <div
                          key={i.name}
                          className="grid grid-cols-[88px_1fr] gap-4"
                        >
                          <div className="relative size-[88px] border border-black bg-white">
                            <Img src={i.image} alt={i.name} sizes="88px" />
                          </div>
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-[12px] font-medium tracking-[0.08em] uppercase">
                                {i.name}
                              </p>
                              <p className="text-[12px] tracking-[0.06em] whitespace-nowrap">
                                {vnd(i.price)}
                              </p>
                            </div>
                            <p className="py-2 text-[11px] leading-[18px] text-black/55">
                              {i.note}
                            </p>
                            <span className="inline-block border border-black px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase">
                              Số lượng: {String(i.qty).padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-5 sm:p-6">
                      <h4 className="text-[11px] font-medium tracking-[0.12em] uppercase">
                        Địa chỉ giao hàng
                      </h4>
                      <div className="mt-3 flex gap-3">
                        <span className="w-px bg-black" />
                        <div>
                          <p className="text-[12px] font-medium tracking-[0.02em]">
                            {o.address.name}
                          </p>
                          <p className="mt-1 text-[12px] leading-5 text-black/60">
                            {o.address.line}
                          </p>
                        </div>
                      </div>
                      <h4 className="mt-6 text-[11px] font-medium tracking-[0.12em] uppercase">
                        Hình thức thanh toán
                      </h4>
                      <span className="mt-3 inline-flex min-w-[120px] justify-center border border-black px-4 py-2.5 text-[11px] font-medium tracking-[0.1em] uppercase">
                        {payLabel[o.payment] ?? o.payment}
                      </span>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
