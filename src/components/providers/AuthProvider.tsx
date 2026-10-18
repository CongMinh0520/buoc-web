"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";
import { logoutAction, meAction } from "@/server/actions/auth";
import type { PublicCustomer } from "@/lib/types";

export type AuthStep = "login" | "register" | "forgot" | "otp-register" | "otp-forgot" | "reset";

type AuthContextValue = {
  open: (step?: AuthStep) => void;
  close: () => void;
  step: AuthStep | null;
  go: (step: AuthStep) => void;
  customer: PublicCustomer | null;
  setCustomer: (c: PublicCustomer | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<AuthStep | null>(null);
  const [customer, setCustomer] = useState<PublicCustomer | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Trang là HTML tĩnh; trạng thái đăng nhập (và số thông báo chưa đọc) được hỏi riêng sau khi tải / khi đổi trang
  useEffect(() => {
    let alive = true;
    meAction()
      .then((c) => alive && setCustomer(c))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [pathname]);

  const open = useCallback((s: AuthStep = "login") => setStep(s), []);
  const close = useCallback(() => setStep(null), []);
  const logout = useCallback(async () => {
    await logoutAction();
    setCustomer(null);
    router.refresh();
  }, [router]);

  const value = useMemo(() => ({ open, close, step, go: setStep, customer, setCustomer, logout }), [open, close, step, customer, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthModal phải dùng bên trong <AuthProvider>");
  return ctx;
}
