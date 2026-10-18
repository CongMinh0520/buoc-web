"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAuthModal, type AuthStep } from "@/components/providers/AuthProvider";
import { useSite } from "@/components/providers/SiteProvider";
import {
  forgotPasswordAction,
  loginAction,
  registerAction,
  resendOtpAction,
  resetPasswordAction,
  verifyEmailAction,
  verifyResetOtpAction,
} from "@/server/actions/auth";

const copy: Record<AuthStep, { title: string; desc: (email: string) => string; cta: string }> = {
  login: { title: "Đăng nhập", desc: () => "Chào mừng bạn quay lại. Đăng nhập để theo dõi đơn hàng và điểm thưởng.", cta: "Đăng nhập" },
  register: { title: "Đăng ký", desc: () => "Tạo tài khoản để lưu số đo chân, quản lý đơn hàng và nhận quyền lợi thành viên.", cta: "Đăng ký" },
  forgot: { title: "Quên mật khẩu", desc: () => "Nhập email đã đăng ký để nhận mã OTP đặt lại mật khẩu.", cta: "Gửi mã OTP" },
  "otp-register": { title: "Xác minh email", desc: (e) => `Mã OTP đã được gửi tới ${e}. Vui lòng nhập mã 6 số để hoàn tất đăng ký.`, cta: "Xác minh" },
  "otp-forgot": { title: "Xác minh OTP", desc: (e) => `Nếu ${e} đã đăng ký, mã OTP đã được gửi tới email đó. Nhập mã 6 số để tiếp tục.`, cta: "Xác minh" },
  reset: { title: "Đặt lại mật khẩu", desc: () => "Tạo mật khẩu mới (ít nhất 8 ký tự, có chữ và số).", cta: "Đặt lại mật khẩu" },
};

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

function OtpInputs() {
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
          aria-label={`Số OTP thứ ${i + 1}`}
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
  const c = copy[step];

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
          setNotice("Xác minh thành công. Mời bạn đăng nhập.");
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
          setNotice("Đã đổi mật khẩu. Mời bạn đăng nhập bằng mật khẩu mới.");
          return go("login");
        }
      }
    });
  };

  const resend = () =>
    startTransition(async () => {
      const r = await resendOtpAction({ email, purpose: step === "otp-register" ? "verify" : "reset" });
      setError(r.ok ? null : r.error);
      if (r.ok) setNotice("Đã gửi lại mã.");
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
        <button type="button" onClick={close} aria-label="Đóng" className="absolute top-4 right-4 p-1 text-[#0b0b0b] hover:opacity-60">
          <X size={20} strokeWidth={1.25} />
        </button>

        <h2 id="auth-title" className="text-center font-display text-[30px] font-medium tracking-[0.08em] text-[#0b0b0b] uppercase">
          {c.title}
        </h2>
        <p className="mx-auto mt-2.5 max-w-[330px] text-center text-[12px] leading-[19px] text-[#777]">{c.desc(email)}</p>

        {notice && <p className="mt-4 border border-black/15 bg-paper px-3 py-2 text-center text-[12px]">{notice}</p>}

        <div className="mt-6 grid gap-[15px]">
          {step === "register" && <Field label="Họ và tên *" name="name" placeholder="Nhập họ và tên" autoComplete="name" />}
          {(step === "login" || step === "register" || step === "forgot") && (
            <Field label="Email *" name="email" type="email" placeholder="Nhập email" autoComplete="email" />
          )}
          {step === "login" && <Field label="Mật khẩu *" name="password" type="password" placeholder="Nhập mật khẩu" autoComplete="current-password" />}
          {(step === "register" || step === "reset") && (
            <>
              <Field label={step === "reset" ? "Mật khẩu mới *" : "Mật khẩu *"} name="password" type="password" placeholder="Ít nhất 8 ký tự, có chữ và số" autoComplete="new-password" />
              <Field label="Xác nhận mật khẩu *" name="confirm" type="password" placeholder="Nhập lại mật khẩu" autoComplete="new-password" />
            </>
          )}
          {step === "register" && (
            <div className="grid gap-2.5 pt-1">
              <label className="flex cursor-pointer items-start gap-2.5">
                <input id="auth-acceptPrivacy" name="acceptPrivacy" type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-black" />
                <span className="text-[11px] leading-[17px] text-[#555]">
                  Tôi đồng ý để {brandName} xử lý dữ liệu cá nhân theo{" "}
                  <a href="/chinh-sach" target="_blank" rel="noopener" className="text-[#111] underline">
                    chính sách bảo mật
                  </a>{" "}
                  (bắt buộc)
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input id="auth-marketing" name="marketingOptIn" type="checkbox" className="mt-0.5 size-4 shrink-0 accent-black" />
                <span className="text-[11px] leading-[17px] text-[#555]">Nhận email về sản phẩm mới và ưu đãi (không bắt buộc)</span>
              </label>
            </div>
          )}
          {(step === "otp-register" || step === "otp-forgot") && (
            <div>
              <p className="mb-5 text-center text-[10px] tracking-[0.12em] text-[#666]">MÃ OTP</p>
              <OtpInputs />
              <button type="button" onClick={resend} disabled={pending} className="mx-auto mt-[18px] block text-[10px] tracking-[0.1em] text-[#555] uppercase underline">
                Gửi lại mã
              </button>
            </div>
          )}
          {step === "login" && (
            <button type="button" onClick={() => go("forgot")} className="justify-self-end text-[11px] text-[#555] underline">
              Quên mật khẩu?
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
          {pending ? "Đang xử lý…" : c.cta}
        </button>

        <p className="mt-[17px] text-center text-[11px] text-[#777]">
          {step === "login" && (
            <>
              Chưa có tài khoản?{" "}
              <button type="button" onClick={() => go("register")} className="font-medium text-[#111] underline">
                Đăng ký
              </button>
            </>
          )}
          {step === "register" && (
            <>
              Đã có tài khoản?{" "}
              <button type="button" onClick={() => go("login")} className="font-medium text-[#111] underline">
                Đăng nhập
              </button>
            </>
          )}
          {step === "forgot" && (
            <button type="button" onClick={() => go("login")} className="font-medium text-[#111] underline">
              Quay lại đăng nhập
            </button>
          )}
          {(step === "otp-register" || step === "otp-forgot") && (
            <button type="button" onClick={() => go(step === "otp-register" ? "register" : "forgot")} className="font-medium text-[#111] underline">
              Quay lại
            </button>
          )}
        </p>
      </form>
    </div>
  );
}
