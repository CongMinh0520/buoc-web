import type { CollectionConfig } from "payload";
import { publishedOrStaff, staffOnly } from "../access";
import { imageField, slugField } from "../fields";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";

/** Bộ sưu tập (đặt slug "lookbooks" để không trùng khái niệm "collection" của Payload) */
export const Lookbooks: CollectionConfig = {
  slug: "lookbooks",
  labels: { singular: "Bộ sưu tập", plural: "Bộ sưu tập" },
  admin: { useAsTitle: "title", group: "Sản phẩm", defaultColumns: ["title", "line", "_status"] },
  versions: { drafts: true },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: { afterChange: [revalidateCollection("catalog")], afterDelete: [revalidateCollectionDelete("catalog")] },
  fields: [
    { name: "title", label: "Tên bộ sưu tập", type: "text", localized: true, required: true },
    slugField("title"),
    { name: "line", label: "Thuộc dòng", type: "relationship", relationTo: "lines", required: true },
    { name: "desc", label: "Giới thiệu", type: "textarea", localized: true },
    imageField("image", "Ảnh bìa", true),
    { name: "products", label: "Sản phẩm", type: "relationship", relationTo: "products", hasMany: true },
  ],
};
