"use client";

import { useState, useTransition } from "react";
import { FieldLabel, SectionTitle } from "./AccountShell";
import { useT } from "@/components/providers/LocaleProvider";
import {
  changePasswordAction,
  updateProfileAction,
} from "@/server/actions/account";

type Profile = {
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthday: string;
  shoeSize: string;
  marketingOptIn: boolean;
};

function Status({ msg }: { msg: { ok: boolean; text: string } | null }) {
  if (!msg) return null;
  return (
    <p
      role={msg.ok ? "status" : "alert"}
      className={`text-[12px] ${msg.ok ? "text-black/70" : "text-danger"}`}
    >
      {msg.text}
    </p>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [pending, start] = useTransition();
  const t = useT();
  const p = t.account.profile;

  return (
    <div className="max-w-[960px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          start(async () => {
            const r = await updateProfileAction({
              name: String(f.get("name") ?? ""),
              phone: String(f.get("phone") ?? ""),
              gender: String(f.get("gender") ?? "Khác"),
              birthday: String(f.get("birthday") ?? ""),
              shoeSize: String(f.get("shoeSize") ?? ""),
              marketingOptIn: f.get("marketing") === "on",
            });
            setMsg(
              r.ok
                ? { ok: true, text: p.saved }
                : { ok: false, text: r.error },
            );
          });
        }}
      >
        <SectionTitle>{p.basics}</SectionTitle>
        <div className="mt-8 grid gap-6">
          <label>
            <FieldLabel required>{p.name}</FieldLabel>
            <input
              id="pf-name"
              name="name"
              required
              maxLength={100}
              className="field"
              defaultValue={profile.name}
              autoComplete="name"
            />
          </label>
          <div className="grid gap-6 md:grid-cols-2">
            <label>
              <FieldLabel>{p.birthday}</FieldLabel>
              <input
                id="pf-birthday"
                name="birthday"
                type="date"
                className="field"
                defaultValue={profile.birthday}
              />
            </label>
            <label>
              <FieldLabel>{p.gender}</FieldLabel>
              <select
                id="pf-gender"
                name="gender"
                className="field"
                defaultValue={profile.gender || "Khác"}
              >
                {["Nữ", "Nam", "Khác"].map((g) => (
                  <option key={g} value={g}>
                    {p.genderOptions[g]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <label>
              <FieldLabel>{p.email}</FieldLabel>
              <input
                id="pf-email"
                type="email"
                className="field text-black/60"
                value={profile.email}
                readOnly
                aria-readonly
              />
            </label>
            <label>
              <FieldLabel>{p.phone}</FieldLabel>
              <input
                id="pf-phone"
                name="phone"
                type="tel"
                maxLength={15}
                className="field"
                defaultValue={profile.phone}
                autoComplete="tel"
              />
            </label>
          </div>
          <label>
            <FieldLabel>{p.shoeSize}</FieldLabel>
            <select
              id="pf-size"
              name="shoeSize"
              className="field md:max-w-[468px]"
              defaultValue={profile.shoeSize}
            >
              <option value="">{p.notSelected}</option>
              {["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"].map(
                (s) => (
                  <option key={s}>{s}</option>
                ),
              )}
            </select>
          </label>
        </div>
        <div className="mt-10">
          <SectionTitle>{p.other}</SectionTitle>
          <label className="mt-8 flex cursor-pointer items-start gap-3">
            <input
              id="pf-marketing"
              name="marketing"
              type="checkbox"
              defaultChecked={profile.marketingOptIn}
              className="mt-0.5 size-4 accent-black"
            />
            <span className="text-[12px] tracking-[0.06em] text-black/70 uppercase">
              {p.marketing}
            </span>
          </label>
        </div>
        <div className="mt-10 flex items-center justify-end gap-4">
          <Status msg={msg} />
          <button
            type="submit"
            disabled={pending}
            className="btn-dark disabled:opacity-60"
          >
            {p.save}
          </button>
        </div>
      </form>

      <form
        className="mt-14"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const f = new FormData(form);
          start(async () => {
            const r = await changePasswordAction({
              current: String(f.get("current") ?? ""),
              next: String(f.get("next") ?? ""),
              confirm: String(f.get("confirm") ?? ""),
            });
            setPwMsg(
              r.ok
                ? { ok: true, text: p.passwordChanged }
                : { ok: false, text: r.error },
            );
            if (r.ok) form.reset();
          });
        }}
      >
        <SectionTitle>{p.security}</SectionTitle>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <label>
            <FieldLabel>{p.currentPassword}</FieldLabel>
            <input
              id="pw-current"
              name="current"
              type="password"
              required
              className="field"
              autoComplete="current-password"
            />
          </label>
          <label>
            <FieldLabel>{p.newPassword}</FieldLabel>
            <input
              id="pw-next"
              name="next"
              type="password"
              required
              minLength={8}
              className="field"
              autoComplete="new-password"
            />
          </label>
          <label>
            <FieldLabel>{p.confirmPassword}</FieldLabel>
            <input
              id="pw-confirm"
              name="confirm"
              type="password"
              required
              className="field"
              autoComplete="new-password"
            />
          </label>
        </div>
        <div className="mt-8 flex items-center justify-end gap-4">
          <Status msg={pwMsg} />
          <button
            type="submit"
            disabled={pending}
            className="btn-outline disabled:opacity-60"
          >
            {p.changePassword}
          </button>
        </div>
      </form>
    </div>
  );
}
