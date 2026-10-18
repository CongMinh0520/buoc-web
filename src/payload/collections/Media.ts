import type { CollectionConfig } from "payload";
import { anyone, staffOnly } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Ảnh", plural: "Thư viện ảnh" },
  admin: { group: "Nội dung" },
  access: { read: anyone, create: staffOnly, update: staffOnly, delete: staffOnly },
  upload: {
    // Chỉ nhận ảnh — chặn upload file thực thi/HTML
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    focalPoint: true,
    imageSizes: [
      { name: "thumb", width: 400 },
      { name: "card", width: 800 },
      { name: "hero", width: 1920 },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
    formatOptions: { format: "webp", options: { quality: 82 } },
  },
  fields: [{ name: "alt", label: "Mô tả ảnh (alt, quan trọng cho SEO)", type: "text", localized: true, required: true }],
};
