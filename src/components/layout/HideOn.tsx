"use client";

import { usePathname } from "next/navigation";

/** Ẩn nội dung trên một số route (vd: trang Chào mừng toàn màn hình không có header/footer) */
export const CHROMELESS_ROUTES = ["/chao-mung"];

export function HideOn({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (CHROMELESS_ROUTES.includes(pathname)) return null;
  return <>{children}</>;
}
