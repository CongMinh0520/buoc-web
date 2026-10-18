import type { CollectionConfig } from "payload";
import { publishedOrStaff, staffOnly } from "../access";
import { imageField, slugField } from "../fields";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Sản phẩm", plural: "Sản phẩm" },
  admin: {
    useAsTitle: "name",
    group: "Sản phẩm",
    defaultColumns: ["name", "line", "price", "gender", "_status"],
    listSearchableFields: ["name", "slug"],
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: { afterChange: [revalidateCollection("catalog")], afterDelete: [revalidateCollectionDelete("catalog")] },
  fields: [
    { name: "name", label: "Tên sản phẩm", type: "text", localized: true, required: true },
    slugField("name"),
    { name: "subtitle", label: "Mô tả ngắn", type: "text", localized: true },
    {
      type: "row",
      fields: [
        { name: "line", label: "Dòng", type: "relationship", relationTo: "lines", required: true },
        {
          name: "gender",
          label: "Đối tượng",
          type: "select",
          required: true,
          defaultValue: "unisex",
          options: [
            { label: "Nam", value: "nam" },
            { label: "Nữ", value: "nu" },
            { label: "Unisex", value: "unisex" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "price", label: "Giá bán (VND, đã gồm VAT)", type: "number", required: true, min: 0 },
        { name: "isNew", label: "Gắn nhãn Mới", type: "checkbox", defaultValue: false },
      ],
    },
    {
      name: "colors",
      label: "Màu",
      type: "array",
      minRows: 1,
      required: true,
      fields: [
        {
          type: "row",
          fields: [
            { name: "name", label: "Tên màu (mã nội bộ)", type: "text", required: true, admin: { description: "Dùng để khớp tồn kho bên dưới — không dịch" } },
            { name: "label", label: "Tên hiển thị", type: "text", localized: true, admin: { description: "Tên màu khách thấy. Để trống sẽ dùng Tên màu" } },
            {
              name: "hex",
              label: "Mã màu",
              type: "text",
              required: true,
              validate: (v: unknown) => (typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v) ? true : "Dạng #RRGGBB"),
            },
          ],
        },
      ],
    },
    {
      name: "variants",
      label: "Tồn kho theo màu & size",
      type: "array",
      admin: { description: "Mỗi dòng là một tổ hợp màu + size. Size xuất hiện trên trang theo thứ tự ở đây." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "color", label: "Màu (đúng tên ở trên)", type: "text", required: true },
            { name: "size", label: "Size", type: "text", required: true },
            { name: "stock", label: "Tồn kho", type: "number", required: true, min: 0, defaultValue: 0 },
            { name: "sku", label: "SKU", type: "text" },
          ],
        },
      ],
    },
    { name: "images", label: "Ảnh", type: "array", minRows: 1, fields: [imageField("image", "Ảnh", true)] },
    { name: "description", label: "Mô tả sản phẩm", type: "textarea", localized: true },
    { name: "details", label: "Chi tiết & chất liệu", type: "textarea", localized: true },
    { name: "sizing", label: "Bảng size & cách chọn", type: "textarea", localized: true },
  ],
};
