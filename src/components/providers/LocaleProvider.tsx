"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { defaultLocale, localePath, stripLocale, type Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";

const LocaleContext = createContext<Locale>(defaultLocale);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);

/** Từ điển giao diện theo ngôn ngữ đang xem */
export const useT = () => dictionaries[useContext(LocaleContext)];

/** Đường dẫn hiện tại đã bỏ tiền tố ngôn ngữ ("/en/gio-hang" → "/gio-hang") — dùng để so sánh route */
export function useBarePathname() {
  return stripLocale(usePathname() ?? "/");
}

/** Hàm thêm tiền tố ngôn ngữ cho đường dẫn nội bộ (dùng với router.push, window.location…) */
export function useLocalePath() {
  const locale = useContext(LocaleContext);
  return (path: string) => localePath(locale, path);
}
