import { getProducts } from "@/lib/cms";
import type { Locale } from "@/i18n/config";

/**
 * Chỉ mục tìm kiếm tĩnh (JSON) cho ô tìm kiếm phía trình duyệt.
 * Mỗi ngôn ngữ một file (/search-index.json, /en/search-index.json); prerender và làm mới khi danh mục thay đổi (cache tag "catalog").
 */
export async function searchIndex(locale: Locale) {
  const products = await getProducts(locale);
  return Response.json(products, { headers: { "Cache-Control": "public, max-age=0, s-maxage=31536000, stale-while-revalidate" } });
}
