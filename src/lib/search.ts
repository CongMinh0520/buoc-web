import type { Product } from "./types";
import { localePath, type Locale } from "@/i18n/config";

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
    const hay = normalize(`${p.name} ${p.subtitle} ${p.line.label} ${p.colors.map((c) => c.label).join(" ")}`);
    return words.every((w) => hay.includes(w));
  });
}

const cache = new Map<Locale, Promise<Product[]>>();
/** Tải chỉ mục tìm kiếm (theo ngôn ngữ) một lần mỗi phiên trình duyệt */
export function loadSearchIndex(locale: Locale) {
  let p = cache.get(locale);
  if (!p) {
    p = fetch(localePath(locale, "/search-index.json"))
      .then((r) => (r.ok ? (r.json() as Promise<Product[]>) : []))
      .catch(() => {
        cache.delete(locale);
        return [];
      });
    cache.set(locale, p);
  }
  return p;
}
