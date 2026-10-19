// Chỉ mục tìm kiếm sản phẩm (JSON tĩnh) theo ngôn ngữ — xử lý tại src/server/api/search-index.ts
import { defaultLocale, isLocale } from "@/i18n/config";
import { searchIndex } from "@/server/api/search-index";

export async function GET(_req: Request, { params }: RouteContext<"/[lang]/search-index.json">) {
  const { lang } = await params;
  return searchIndex(isLocale(lang) ? lang : defaultLocale);
}
