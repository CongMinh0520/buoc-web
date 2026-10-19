import { lang } from "next/root-params";
import { defaultLocale, isLocale, type Locale } from "./config";
import { dictionaries } from "./dictionaries";

/**
 * Ngôn ngữ của request hiện tại, đọc từ segment [lang] (root param).
 * Gọi được trong Server Component và hàm "use cache" — lang trở thành một phần của khóa cache.
 */
export async function getLocale(): Promise<Locale> {
  try {
    const l = await lang();
    return isLocale(l) ? l : defaultLocale;
  } catch {
    // Ngoài cây app/(site)/[lang] (sitemap, route handler…) không có root param → dùng tiếng Việt
    return defaultLocale;
  }
}

/** Từ điển giao diện theo ngôn ngữ hiện tại */
export async function getT() {
  return dictionaries[await getLocale()];
}
