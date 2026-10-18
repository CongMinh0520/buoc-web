import { APIError, type CollectionBeforeDeleteHook, type CollectionConfig } from "payload";
import { anyone, staffOnly } from "../access";
import { imageField } from "../fields";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";

/** Không cho xóa dòng còn được sản phẩm / bộ sưu tập / trang chủ sử dụng (tránh lỗi ràng buộc DB, báo rõ cho biên tập viên) */
const preventDeleteInUse: CollectionBeforeDeleteHook = async ({ req, id }) => {
  const where = { line: { equals: id } };
  const [products, lookbooks, home] = await Promise.all([
    req.payload.count({ collection: "products", where, req, overrideAccess: true }),
    req.payload.count({ collection: "lookbooks", where, req, overrideAccess: true }),
    req.payload.findGlobal({ slug: "home", depth: 0, req, overrideAccess: true }).catch(() => null),
  ]);
  const ref = (v: unknown) => (v && typeof v === "object" ? (v as { id: unknown }).id : v);
  const onHome = Boolean(home && ((home.lineSections ?? []).some((s) => ref(s.line) === id) || ref(home.closing?.line) === id));
  const uses = [
    products.totalDocs && `${products.totalDocs} sản phẩm`,
    lookbooks.totalDocs && `${lookbooks.totalDocs} bộ sưu tập`,
    onHome && "Trang chủ",
  ].filter(Boolean);
  if (uses.length) {
    const err = new APIError(`Không thể xóa: dòng này đang được dùng bởi ${uses.join(", ")}. Hãy chuyển hoặc gỡ chúng trước.`, 400, { inUse: uses }, true);
    err.name = "LineInUseError"; // tên lớp bị minify khi build → đặt tên rõ để Payload trả thông báo cho admin
    throw err;
  }
};

/** Dòng sản phẩm: Atelier, Welt, B.Lab, Chậm… */
export const Lines: CollectionConfig = {
  slug: "lines",
  labels: { singular: "Dòng sản phẩm", plural: "Dòng sản phẩm" },
  admin: { useAsTitle: "label", group: "Sản phẩm", defaultColumns: ["label", "key", "order"] },
  defaultSort: "order",
  access: { read: anyone, create: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: { beforeDelete: [preventDeleteInUse], afterChange: [revalidateCollection("catalog")], afterDelete: [revalidateCollectionDelete("catalog")] },
  fields: [
    {
      name: "key",
      label: "Mã (dùng trong URL /dong/…)",
      type: "text",
      required: true,
      unique: true,
      index: true,
      validate: (v: unknown) => (typeof v === "string" && /^[a-z0-9-]+$/.test(v) ? true : "Chỉ dùng chữ thường, số, dấu gạch ngang"),
    },
    { name: "label", label: "Tên hiển thị", type: "text", localized: true, required: true },
    { name: "overline", label: "Dòng phụ", type: "text", localized: true },
    { name: "intro", label: "Giới thiệu", type: "textarea", localized: true },
    { name: "tagline", label: "Câu khẩu hiệu (trên ảnh lớn đầu trang)", type: "text", localized: true },
    { name: "tint", label: "Màu nền gradient (CSS)", type: "text", defaultValue: "rgba(0,0,0,0)" },
    { name: "order", label: "Thứ tự", type: "number", defaultValue: 0 },
    imageField("hero", "Ảnh lớn đầu trang"),
    {
      name: "slides",
      label: "Ảnh trình chiếu",
      type: "array",
      fields: [imageField("image", "Ảnh", true), { name: "caption", label: "Chú thích", type: "text", localized: true }],
    },
  ],
};
