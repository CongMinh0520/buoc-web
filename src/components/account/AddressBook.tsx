"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FieldLabel } from "./AccountShell";
import {
  deleteAddressAction,
  saveAddressAction,
  setDefaultAddressAction,
} from "@/server/actions/account";

export type Address = {
  label: string;
  name: string;
  phone: string;
  line: string;
  province: string;
  ward: string;
  isDefault: boolean;
};

const PROVINCES = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Khánh Hòa",
  "Lâm Đồng",
  "Đồng Nai",
  "Bình Dương",
  "Quảng Ninh",
];

function AddressForm({
  initial,
  onCancel,
  onSave,
  pending,
  error,
}: {
  initial: Address | null;
  onCancel: () => void;
  onSave: (a: Address) => void;
  pending: boolean;
  error: string | null;
}) {
  return (
    <form
      className="mt-10 border border-black bg-white p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const s = (k: string) => String(f.get(k) ?? "").trim();
        onSave({
          label: s("label"),
          name: s("name"),
          phone: s("phone"),
          line: s("line"),
          province: s("province"),
          ward: s("ward"),
          isDefault: f.get("isDefault") === "on",
        });
      }}
    >
      <h3 className="text-[12px] font-medium tracking-[0.12em] uppercase">
        {initial ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
      </h3>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label>
          <FieldLabel required>Tên địa chỉ</FieldLabel>
          <input
            name="label"
            required
            maxLength={40}
            className="field"
            placeholder="VD: Nhà riêng, Văn phòng"
            defaultValue={initial?.label}
          />
        </label>
        <label>
          <FieldLabel required>Số điện thoại</FieldLabel>
          <input
            name="phone"
            type="tel"
            required
            maxLength={15}
            className="field"
            placeholder="Nhập số điện thoại"
            defaultValue={initial?.phone}
            autoComplete="tel"
          />
        </label>
        <label className="md:col-span-2">
          <FieldLabel required>Họ và tên</FieldLabel>
          <input
            name="name"
            required
            maxLength={100}
            className="field"
            placeholder="Nhập họ và tên người nhận"
            defaultValue={initial?.name}
            autoComplete="name"
          />
        </label>
        <label className="md:col-span-2">
          <FieldLabel required>Địa chỉ cụ thể</FieldLabel>
          <input
            name="line"
            required
            maxLength={200}
            className="field"
            placeholder="Số nhà, tên đường"
            defaultValue={initial?.line}
            autoComplete="street-address"
          />
        </label>
        <label>
          <FieldLabel required>Tỉnh / Thành phố</FieldLabel>
          <input
            name="province"
            required
            list="ab-provinces"
            maxLength={60}
            className="field"
            placeholder="Chọn hoặc nhập tỉnh / thành phố"
            defaultValue={initial?.province}
          />
          <datalist id="ab-provinces">
            {PROVINCES.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </label>
        <label>
          <FieldLabel required>Phường / Xã</FieldLabel>
          <input
            name="ward"
            required
            maxLength={60}
            className="field"
            placeholder="Nhập phường / xã"
            defaultValue={initial?.ward}
          />
        </label>
        <label className="flex cursor-pointer items-center gap-3 md:col-span-2">
          <input
            name="isDefault"
            type="checkbox"
            defaultChecked={initial?.isDefault}
            className="size-4 accent-black"
          />
          <span className="text-[12px] tracking-[0.08em] text-black/70 uppercase">
            Đặt làm địa chỉ mặc định
          </span>
        </label>
      </div>
      {error && (
        <p role="alert" className="mt-5 text-[12px] text-danger">
          {error}
        </p>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 text-[12px] tracking-[0.1em] text-black/55 uppercase underline"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={pending}
          className="btn-dark px-6 disabled:opacity-60"
        >
          Lưu địa chỉ
        </button>
      </div>
    </form>
  );
}

export function AddressBook({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  // editing: null = đóng, -1 = thêm mới, >=0 = sửa địa chỉ tại index
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const run = (
    fn: () => Promise<{ ok: true } | { ok: false; error: string }>,
    after?: () => void,
  ) =>
    start(async () => {
      setError(null);
      const r = await fn();
      if (!r.ok) return setError(r.error);
      after?.();
      router.refresh();
    });

  return (
    <div className="max-w-[960px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] tracking-[0.08em] text-black/45 uppercase">
          Quản lý thông tin giao hàng và thông tin nhận hóa đơn
        </p>
        <button
          onClick={() => setEditing(-1)}
          disabled={addresses.length >= 10}
          className="btn-dark shrink-0 px-5 text-[11px] disabled:opacity-50"
        >
          Thêm địa chỉ mới
        </button>
      </div>

      {editing !== null && (
        <AddressForm
          key={editing}
          initial={editing >= 0 ? addresses[editing] : null}
          pending={pending}
          error={error}
          onCancel={() => {
            setEditing(null);
            setError(null);
          }}
          onSave={(a) =>
            run(
              () =>
                saveAddressAction({
                  index: editing >= 0 ? editing : null,
                  address: a,
                }),
              () => setEditing(null),
            )
          }
        />
      )}

      {editing === null && error && (
        <p role="alert" className="mt-6 text-[12px] text-danger">
          {error}
        </p>
      )}

      {addresses.length === 0 ? (
        <p className="mt-10 border border-black/15 bg-white py-16 text-center text-[13px] text-black/50">
          Bạn chưa lưu địa chỉ nào.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2" aria-busy={pending}>
          {addresses.map((a, idx) => (
            <article
              key={`${idx}-${a.line}`}
              className="flex flex-col border border-black bg-white p-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                {a.isDefault && (
                  <span className="w-fit bg-black px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-white uppercase">
                    Mặc định
                  </span>
                )}
                <span className="py-1 text-[10px] font-medium tracking-[0.12em] text-black/45 uppercase">
                  {a.label}
                </span>
              </div>
              <h3 className="mt-4 font-display text-[26px] leading-tight font-medium tracking-[0.03em] uppercase">
                {a.name}
              </h3>
              <p className="mt-3 text-[13px] leading-[21px] tracking-[0.04em] text-black/55 uppercase">
                {a.line}, {a.ward}, {a.province}
              </p>
              <p className="mt-3 text-[13px] tracking-[0.04em] text-black/55">
                {a.phone}
              </p>
              <div className="mt-8 flex flex-wrap gap-4 border-t border-subtle pt-6 text-[11px] tracking-[0.1em] text-black/55 uppercase [&>button:disabled]:opacity-40">
                <button
                  className="hover:text-black"
                  disabled={pending}
                  onClick={() => setEditing(idx)}
                >
                  Chỉnh sửa
                </button>
                <button
                  className="hover:text-black"
                  disabled={pending}
                  onClick={() => {
                    if (confirm("Xóa địa chỉ này?"))
                      run(() => deleteAddressAction(idx));
                  }}
                >
                  Xóa địa chỉ
                </button>
                {!a.isDefault && (
                  <button
                    className="hover:text-black"
                    disabled={pending}
                    onClick={() => run(() => setDefaultAddressAction(idx))}
                  >
                    Đặt làm mặc định
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
