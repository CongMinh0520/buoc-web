/**
 * Với Cache Components, generateStaticParams phải trả về ít nhất một phần tử — kể cả khi CMS chưa có dữ liệu
 * (lần deploy đầu trên database trống, hoặc biên tập viên xóa hết bài). Khi rỗng, trả về một tham số giữ chỗ;
 * trang tương ứng không tìm thấy dữ liệu và trả 404. Các trang thật vẫn được tạo khi có người truy cập.
 */
export const PLACEHOLDER_PARAM = "__placeholder__";

export function atLeastOne<K extends string>(key: K, values: string[]): Record<K, string>[] {
  const list = values.length ? values : [PLACEHOLDER_PARAM];
  return list.map((v) => ({ [key]: v }) as Record<K, string>);
}
