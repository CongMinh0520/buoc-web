import type { Product } from "./types";

/** Danh mục là bộ lọc cố định trên sản phẩm (không cần lưu trong CMS). Tên & mô tả theo ngôn ngữ: i18n/dictionaries → category.names */
export const categories = {
  nam: { filter: (p: Product) => p.gender === "nam" || p.gender === "unisex" },
  nu: { filter: (p: Product) => p.gender === "nu" || p.gender === "unisex" },
  cham: { filter: (p: Product) => p.line.key === "cham" },
  "tat-ca": { filter: () => true },
} as const;

export type CategorySlug = keyof typeof categories;
export const isCategory = (s: string): s is CategorySlug => s in categories;
