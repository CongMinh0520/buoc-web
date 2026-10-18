import { getProducts } from "@/lib/cms";

/**
 * Chỉ mục tìm kiếm tĩnh (JSON) cho ô tìm kiếm phía trình duyệt.
 * Được prerender và làm mới khi danh mục sản phẩm thay đổi (cache tag "catalog").
 */
export async function searchIndex() {
  const products = await getProducts();
  return Response.json(products, { headers: { "Cache-Control": "public, max-age=0, s-maxage=31536000, stale-while-revalidate" } });
}
