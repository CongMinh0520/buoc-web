import type { Product } from "./types";

/** Bỏ dấu tiếng Việt để tìm "giay" cũng ra "giày" */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");

export function searchProducts(products: Product[], q: string) {
  const n = normalize(q.trim());
  if (!n) return [];
  const words = n.split(/\s+/);
  return products.filter((p) => {
    const hay = normalize(`${p.name} ${p.subtitle} ${p.line.label} ${p.colors.map((c) => c.name).join(" ")}`);
    return words.every((w) => hay.includes(w));
  });
}

let cache: Promise<Product[]> | null = null;
/** Tải chỉ mục tìm kiếm một lần mỗi phiên trình duyệt */
export function loadSearchIndex() {
  cache ??= fetch("/search-index.json")
    .then((r) => (r.ok ? (r.json() as Promise<Product[]>) : []))
    .catch(() => {
      cache = null;
      return [];
    });
  return cache;
}
