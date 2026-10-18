import type { Field } from "payload";

/** Chuyển chuỗi tiếng Việt thành slug: "Giày Oxford Hàng Ngang" → "giay-oxford-hang-ngang" */
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const slugField = (from = "title"): Field => ({
  name: "slug",
  type: "text",
  label: "Đường dẫn (slug)",
  unique: true,
  index: true,
  admin: { position: "sidebar", description: `Để trống sẽ tự tạo từ "${from}".` },
  hooks: {
    beforeValidate: [
      ({ value, data, originalDoc }) => {
        if (typeof value === "string" && value.trim()) return slugify(value);
        // Slug dùng chung cho mọi ngôn ngữ: đã có thì giữ nguyên (lưu bản tiếng Anh không đổi URL)
        if (typeof originalDoc?.slug === "string" && originalDoc.slug) return originalDoc.slug;
        const source = data?.[from];
        return typeof source === "string" ? slugify(source) : value;
      },
    ],
  },
});

/**
 * Ảnh: ưu tiên file tải lên Media; nếu chưa có thì dùng URL ngoài (vd ảnh Unsplash tạm thời).
 */
export const imageField = (name: string, label: string, required = false): Field => ({
  name,
  label,
  type: "group",
  fields: [
    { name: "media", label: "Ảnh tải lên", type: "upload", relationTo: "media" },
    {
      name: "url",
      label: "Hoặc URL ảnh ngoài",
      type: "text",
      admin: { description: "Chỉ dùng khi chưa có ảnh tải lên. Nên thay bằng ảnh thật trước khi chạy chính thức." },
      validate: (val: unknown, { siblingData }: { siblingData?: { media?: unknown } }) => {
        if (required && !val && !siblingData?.media) return "Cần ảnh tải lên hoặc URL ảnh.";
        if (val && typeof val === "string" && !/^https:\/\//.test(val)) return "URL phải bắt đầu bằng https://";
        return true;
      },
    },
  ],
});
