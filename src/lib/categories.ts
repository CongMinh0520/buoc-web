import type { Product } from "./types";

/** Danh mục là bộ lọc cố định trên sản phẩm (không cần lưu trong CMS) */
export const categories = {
  nam: { title: "Nam", description: "Giày da nam đóng tay: Oxford, Derby, Loafer, Boot và sandal.", filter: (p: Product) => p.gender === "nam" || p.gender === "unisex" },
  nu: { title: "Nữ", description: "Giày da nữ thủ công: pump, sandal, bootie và giày bệt.", filter: (p: Product) => p.gender === "nu" || p.gender === "unisex" },
  cham: { title: "Chậm", description: "Dép, sandal và giày lười cho những ngày không vội.", filter: (p: Product) => p.line.key === "cham" },
  "tat-ca": { title: "Tất cả", description: "Toàn bộ sản phẩm đang bán.", filter: () => true },
} as const;

export type CategorySlug = keyof typeof categories;
export const isCategory = (s: string): s is CategorySlug => s in categories;
