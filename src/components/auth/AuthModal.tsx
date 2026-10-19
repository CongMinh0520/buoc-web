"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAuthModal } from "@/components/providers/AuthProvider";
import { useSite } from "@/components/providers/SiteProvider";
import { useLocalePath, useT } from "@/components/providers/LocaleProvider";
import {
  forgotPasswordAction,
  loginAction,
  registerAction,
  resendOtpAction,
  resetPasswordAction,
  verifyEmailAction,
  verifyResetOtpAction,
} from "@/server/actions/auth";


function Field(props: { label: string; name: string; placeholder: string; type?: string; autoComplete?: string }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.12em] text-[#666] uppercase">{props.label}</span>
      <input
        name={props.name}
        id={`auth-${props.name}`}
        type={props.type ?? "text"}
        required
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        className="mt-[7px] h-11 w-full border border-[#ddd] px-[13px] text-[13px] outline-none placeholder:text-[#aaa] focus:border-black"
      />
    </label>
  );
}

function OtpInputs({ digitLabel }: { digitLabel: (i: number) => string }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  return (
    <div className="flex justify-center gap-[9px]">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          name={`otp${i}`}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          required
          aria-label={digitLabel(i + 1)}
          onPaste={(e) => {
            const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (digits.length < 2) return;
            e.preventDefault();
            digits.split("").forEach((d, j) => {
              const el = refs.current[j];
              if (el) el.value = d;
            });
            refs.current[Math.min(digits.length, 5)]?.focus();
          }}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/\D/g, "");
            if (e.target.value && i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !e.currentTarget.value && i > 0) refs.current[i - 1]?.focus();
          }}
          className="h-12 w-[42px] border border-[#cfcfcf] text-center text-[18px] outline-none focus:border-black"
        />
      ))}
    </div>
  );
}

export function AuthModal() {
  const { step, close, go, setCustomer } = useAuthModal();
  const { brandName } = useSite();
  const t = useT();
  const to = useLocalePath();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [ticket, setTicket] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!step) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [step, close]);

  const [lastStep, setLastStep] = useState(step);
  if (lastStep !== step) {
    setLastStep(step);
    setError(null);
    if (step !== "login") setNotice(null);
  }

  if (!step) return null;
  const c = t.auth.steps[step];

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "");
    const code = Array.from({ length: 6 }, (_, i) => v(`otp${i}`)).join("");
    setError(null);
    startTransition(async () => {
      switch (step) {
        case "login": {
          const r = await loginAction({ email: v("email"), password: v("password") });
          if (!r.ok) return setError(r.error);
          setCustomer(r.data ?? null);
          close();
          router.refresh();
          return;
        }
        case "register": {
          const r = await registerAction({
            name: v("name"),
            email: v("email"),
            password: v("password"),
            confirm: v("confirm"),
            acceptPrivacy: f.get("acceptPrivacy") === "on",
            marketingOptIn: f.get("marketingOptIn") === "on",
          });
          if (!r.ok) return setError(r.error);
          setEmail(r.data!.email);
          return go("otp-register");
        }
        case "otp-register": {
          const r = await verifyEmailAction({ email, code });
          if (!r.ok) return setError(r.error);
          setNotice(t.auth.verified);
          return go("login");
        }
        case "forgot": {
          const r = await forgotPasswordAction({ email: v("email") });
          if (!r.ok) return setError(r.error);
          setEmail(r.data!.email);
          return go("otp-forgot");
        }
        case "otp-forgot": {
          const r = await verifyResetOtpAction({ email, code });
          if (!r.ok) return setError(r.error);
          setTicket(r.data!.ticket);
          return go("reset");
        }
        case "reset": {
          const r = await resetPasswordAction({ email, ticket, password: v("password"), confirm: v("confirm") });
          if (!r.ok) return setError(r.error);
          setNotice(t.auth.passwordChanged);
          return go("login");
        }
      }
    });
  };

  const resend = () =>
    startTransition(async () => {
      const r = await resendOtpAction({ email, purpose: step === "otp-register" ? "verify" : "reset" });
      setError(r.ok ? null : r.error);
      if (r.ok) setNotice(t.auth.codeResent);
    });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <form
        key={step}
        onSubmit={submit}
        className="relative my-auto w-full max-w-[422px] border border-[#e4e4e4] bg-white px-6 pt-[34px] pb-[30px] sm:px-[34px]"
      >
        <button type="button" onClick={close} aria-label={t.common.close} className="absolute top-4 right-4 p-1 text-[#0b0b0b] hover:opacity-60">
          <X size={20} strokeWidth={1.25} />
        </button>

        <h2 id="auth-title" className="text-center font-display text-[30px] font-medium tracking-[0.08em] text-[#0b0b0b] uppercase">
          {c.title}
        </h2>
        <p className="mx-auto mt-2.5 max-w-[330px] text-center text-[12px] leading-[19px] text-[#777]">{c.desc.replace("{email}", email)}</p>

        {notice && <p className="mt-4 border border-black/15 bg-paper px-3 py-2 text-center text-[12px]">{notice}</p>}

        <div className="mt-6 grid gap-[15px]">
          {step === "register" && <Field label={t.auth.fullName} name="name" placeholder={t.auth.fullNamePh} autoComplete="name" />}
          {(step === "login" || step === "register" || step === "forgot") && (
            <Field label={t.auth.email} name="email" type="email" placeholder={t.auth.emailPh} autoComplete="email" />
          )}
          {step === "login" && <Field label={t.auth.password} name="password" type="password" placeholder={t.auth.passwordPh} autoComplete="current-password" />}
          {(step === "register" || step === "reset") && (
            <>
              <Field label={step === "reset" ? t.auth.newPassword : t.auth.password} name="password" type="password" placeholder={t.auth.newPasswordPh} autoComplete="new-password" />
              <Field label={t.auth.confirmPassword} name="confirm" type="password" placeholder={t.auth.confirmPasswordPh} autoComplete="new-password" />
            </>
          )}
          {step === "register" && (
            <div className="grid gap-2.5 pt-1">
              <label className="flex cursor-pointer items-start gap-2.5">
                <input id="auth-acceptPrivacy" name="acceptPrivacy" type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-black" />
                <span className="text-[11px] leading-[17px] text-[#555]">
                  {t.auth.consentBefore(brandName)}
                  <a href={to("/chinh-sach")} target="_blank" rel="noopener" className="text-[#111] underline">
                    {t.auth.privacyPolicy}
                  </a>{" "}
                  {t.common.required}
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input id="auth-marketing" name="marketingOptIn" type="checkbox" className="mt-0.5 size-4 shrink-0 accent-black" />
                <span className="text-[11px] leading-[17px] text-[#555]">{t.auth.marketing}</span>
              </label>
            </div>
          )}
          {(step === "otp-register" || step === "otp-forgot") && (
            <div>
              <p className="mb-5 text-center text-[10px] tracking-[0.12em] text-[#666]">{t.auth.otpLabel}</p>
              <OtpInputs digitLabel={t.auth.otpDigit} />
              <button type="button" onClick={resend} disabled={pending} className="mx-auto mt-[18px] block text-[10px] tracking-[0.1em] text-[#555] uppercase underline">
                {t.auth.resend}
              </button>
            </div>
          )}
          {step === "login" && (
            <button type="button" onClick={() => go("forgot")} className="justify-self-end text-[11px] text-[#555] underline">
              {t.auth.forgot}
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-4 text-[12px] leading-5 text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 h-[46px] w-full bg-[#050505] text-[11px] tracking-[0.14em] text-white uppercase hover:bg-ink-3 disabled:opacity-60"
        >
          {pending ? t.common.processing : c.cta}
        </button>

        <p className="mt-[17px] text-center text-[11px] text-[#777]">
          {step === "login" && (
            <>
              {t.auth.noAccount}{" "}
              <button type="button" onClick={() => go("register")} className="font-medium text-[#111] underline">
                {t.auth.steps.register.cta}
              </button>
            </>
          )}
          {step === "register" && (
            <>
              {t.auth.hasAccount}{" "}
              <button type="button" onClick={() => go("login")} className="font-medium text-[#111] underline">
                {t.auth.steps.login.cta}
              </button>
            </>
          )}
          {step === "forgot" && (
            <button type="button" onClick={() => go("login")} className="font-medium text-[#111] underline">
              {t.auth.backToLogin}
            </button>
          )}
          {(step === "otp-register" || step === "otp-forgot") && (
            <button type="button" onClick={() => go(step === "otp-register" ? "register" : "forgot")} className="font-medium text-[#111] underline">
              {t.common.back}
            </button>
          )}
        </p>
      </form>
    </div>
  );
}
