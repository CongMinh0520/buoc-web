import type { Block, CollectionConfig } from "payload";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { publishedOrStaff, staffOnly } from "../access";
import { imageField, slugField } from "../fields";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";

export const GalleryBlock: Block = {
  slug: "gallery",
  labels: { singular: "Ảnh / bộ ảnh", plural: "Ảnh / bộ ảnh" },
  fields: [
    { name: "images", label: "Ảnh", type: "array", minRows: 1, maxRows: 3, fields: [imageField("image", "Ảnh", true)] },
    { name: "caption", label: "Chú thích", type: "text", localized: true },
  ],
};

export const TableBlock: Block = {
  slug: "simpleTable",
  labels: { singular: "Bảng 2 cột", plural: "Bảng 2 cột" },
  fields: [
    {
      type: "row",
      fields: [
        { name: "headA", label: "Tiêu đề cột 1", type: "text", localized: true, required: true },
        { name: "headB", label: "Tiêu đề cột 2", type: "text", localized: true, required: true },
      ],
    },
    {
      name: "rows",
      label: "Dòng",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            { name: "a", label: "Cột 1", type: "text", localized: true, required: true },
            { name: "b", label: "Cột 2", type: "text", localized: true, required: true },
          ],
        },
      ],
    },
  ],
};

export const QuoteBlock: Block = {
  slug: "pullQuote",
  labels: { singular: "Trích dẫn", plural: "Trích dẫn" },
  fields: [
    { name: "text", label: "Nội dung", type: "textarea", localized: true, required: true },
    { name: "cite", label: "Người nói", type: "text", localized: true },
  ],
};

export const articleEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [...defaultFeatures, BlocksFeature({ blocks: [GalleryBlock, TableBlock, QuoteBlock] })],
});

export const Articles: CollectionConfig = {
  slug: "articles",
  labels: { singular: "Bài viết", plural: "Tạp chí" },
  admin: { useAsTitle: "title", group: "Nội dung", defaultColumns: ["title", "category", "publishedAt", "_status"] },
  defaultSort: "-publishedAt",
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: { afterChange: [revalidateCollection("articles")], afterDelete: [revalidateCollectionDelete("articles")] },
  fields: [
    { name: "title", label: "Tiêu đề", type: "text", localized: true, required: true },
    slugField("title"),
    {
      type: "row",
      fields: [
        {
          name: "category",
          label: "Chủ đề",
          type: "select",
          required: true,
          options: ["Bộ sưu tập", "Xưởng", "Chăm sóc", "Sự kiện"].map((v) => ({ label: v, value: v })),
        },
        { name: "publishedAt", label: "Ngày đăng", type: "date", required: true, admin: { date: { displayFormat: "dd/MM/yyyy" } } },
      ],
    },
    { name: "excerpt", label: "Tóm tắt", type: "textarea", localized: true, required: true, maxLength: 300 },
    imageField("cover", "Ảnh bìa", true),
    { name: "content", label: "Nội dung", type: "richText", localized: true, editor: articleEditor },
  ],
};
