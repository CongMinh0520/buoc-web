import { lang } from "next/root-params";
import { defaultLocale, isLocale, type Locale } from "./config";
import { dictionaries } from "./dictionaries";

/**
 * Ngôn ngữ của request hiện tại, đọc từ segment [lang] (root param).
 * Gọi được trong Server Component và hàm "use cache" — lang trở thành một phần của khóa cache.
 */
export async function getLocale(): Promise<Locale> {
  const l = await lang().catch(() => defaultLocale);
  return isLocale(l) ? l : defaultLocale;
}

/** Từ điển giao diện theo ngôn ngữ hiện tại */
export async function getT() {
  return dictionaries[await getLocale()];
}
