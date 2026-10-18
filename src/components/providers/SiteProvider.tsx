"use client";

import { createContext, useContext } from "react";

/** Thông tin thương hiệu (cấu hình trên admin → Cài đặt chung) cho các component phía trình duyệt */
export type SiteInfo = { brandName: string; wordmark: string };

const SiteContext = createContext<SiteInfo>({ brandName: "", wordmark: "" });

export function SiteProvider({ value, children }: { value: SiteInfo; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
