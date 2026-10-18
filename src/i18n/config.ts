/**
 * Ngôn ngữ của website. Tiếng Việt là mặc định và giữ URL không tiền tố (/san-pham/…);
 * tiếng Anh nằm dưới /en/… với cùng slug. src/proxy.ts viết lại URL không tiền tố thành /vi/… ở nội bộ.
 * File này dùng được ở cả server lẫn client.
 */
export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (locales as readonly string[]).includes(v);

/** Thêm tiền tố ngôn ngữ cho đường dẫn nội bộ: ("en", "/gio-hang") → "/en/gio-hang"; tiếng Việt giữ nguyên */
export function localePath(lang: Locale, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path; // liên kết ngoài, mailto:, #…
  const bare = stripLocale(path);
  if (lang === defaultLocale) return bare;
  return bare === "/" ? `/${lang}` : `/${lang}${bare}`;
}

/** Bỏ tiền tố ngôn ngữ: "/en/gio-hang?x=1" → "/gio-hang?x=1" */
export function stripLocale(path: string): string {
  for (const l of locales) {
    if (path === `/${l}`) return "/";
    if (path.startsWith(`/${l}/`) || path.startsWith(`/${l}?`) || path.startsWith(`/${l}#`)) {
      const rest = path.slice(l.length + 1);
      return rest.startsWith("/") ? rest : `/${rest}`;
    }
  }
  return path;
}

/** Mã ngôn ngữ cho thẻ <html lang>, Open Graph, Intl */
export const htmlLang: Record<Locale, string> = { vi: "vi", en: "en" };
export const ogLocale: Record<Locale, string> = { vi: "vi_VN", en: "en_US" };
export const intlLocale: Record<Locale, string> = { vi: "vi-VN", en: "en-GB" };
