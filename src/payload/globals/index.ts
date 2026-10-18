import type { Field, GlobalConfig } from "payload";
import { anyone, staffOnly } from "../access";
import { imageField } from "../fields";
import { revalidateGlobal } from "../hooks/revalidate";

const linkArray = (name: string, label: string): Field => ({
  name,
  label,
  type: "array",
  fields: [
    {
      type: "row",
      fields: [
        { name: "label", label: "Nhãn", type: "text", required: true, localized: true },
        { name: "href", label: "Đường dẫn", type: "text", required: true },
      ],
    },
  ],
});

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Cài đặt chung",
  admin: { group: "Cấu hình" },
  access: { read: anyone, update: staffOnly },
  hooks: { afterChange: [revalidateGlobal("site")] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Thương hiệu",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "brandName",
                  label: "Tên thương hiệu",
                  type: "text",
                  required: true,
                  admin: { description: "Dùng ở tiêu đề trang, SEO, email gửi khách, dữ liệu cấu trúc…" },
                },
                { name: "wordmark", label: "Logo chữ", type: "text", required: true, admin: { description: "Chữ hiển thị ở vị trí logo (đầu trang, chân trang)" } },
              ],
            },
            imageField("favicon", "Favicon (ảnh vuông, PNG ≥ 512×512)"),
            {
              name: "orderPrefix",
              label: "Tiền tố mã đơn hàng",
              type: "text",
              defaultValue: "DH",
              maxLength: 4,
              admin: { description: "2–4 chữ in hoa, không dấu. Ví dụ DH → mã đơn DH2610151234. Đổi tiền tố không ảnh hưởng đơn cũ." },
              validate: (v: unknown) => (v == null || v === "" || (typeof v === "string" && /^[A-Z]{2,4}$/.test(v)) ? true : "Chỉ dùng 2–4 chữ in hoa A–Z"),
            },
            { name: "tagline", label: "Khẩu hiệu", type: "text", localized: true },
            {
              type: "row",
              fields: [
                { name: "hotline", label: "Hotline", type: "text" },
                { name: "email", label: "Email", type: "email" },
              ],
            },
            {
              name: "socials",
              label: "Mạng xã hội",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", label: "Tên", type: "text", required: true },
                    { name: "href", label: "URL", type: "text", required: true },
                  ],
                },
              ],
            },
            { name: "copyright", label: "Dòng bản quyền", type: "text", localized: true },
            {
              name: "productStory",
              label: "Khối giới thiệu trên trang sản phẩm",
              type: "group",
              admin: { description: "Đoạn giới thiệu thương hiệu hiển thị dưới phần mua hàng của mọi sản phẩm. Để trống Tiêu đề để ẩn khối này." },
              fields: [
                { name: "eyebrow", label: "Dòng nhỏ phía trên", type: "text", localized: true },
                { name: "title", label: "Tiêu đề", type: "text", localized: true },
                { name: "text", label: "Nội dung", type: "textarea", localized: true },
                {
                  type: "row",
                  fields: [
                    { name: "ctaLabel", label: "Nhãn liên kết", type: "text", localized: true },
                    { name: "ctaHref", label: "Liên kết", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Pháp lý & doanh nghiệp",
          description:
            "Thông tin chủ quản website — bắt buộc công khai theo Luật Thương mại điện tử 2025 và Nghị định 248/2026/NĐ-CP. Hiển thị ở chân trang mọi trang.",
          fields: [
            {
              name: "company",
              label: "Chủ quản website",
              type: "group",
              fields: [
                { name: "name", label: "Tên doanh nghiệp / hộ kinh doanh", type: "text" },
                { name: "address", label: "Địa chỉ trụ sở", type: "text" },
                {
                  type: "row",
                  fields: [
                    { name: "representative", label: "Người đại diện theo pháp luật", type: "text" },
                    { name: "taxCode", label: "Mã số thuế", type: "text" },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "registrationNo", label: "Số Giấy chứng nhận ĐKDN / ĐKKD", type: "text" },
                    { name: "registrationIssued", label: "Ngày cấp, nơi cấp", type: "text", admin: { placeholder: "VD: 12/03/2024, Sở Tài chính TP. Hồ Chí Minh" } },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "complaintPhone", label: "SĐT tiếp nhận phản ánh, khiếu nại", type: "text" },
                    { name: "complaintEmail", label: "Email tiếp nhận phản ánh, khiếu nại", type: "email" },
                  ],
                },
              ],
            },
            {
              name: "priceNote",
              label: "Ghi chú giá",
              type: "text",
              localized: true,
              defaultValue: "Giá đã bao gồm VAT.",
              admin: { description: "Hiển thị dưới giá sản phẩm và ở bước thanh toán (nêu rõ giá đã/chưa gồm thuế, phí)." },
            },
          ],
        },
        {
          label: "Menu",
          fields: [linkArray("mainNav", "Menu chính"), linkArray("footerInfo", "Chân trang — Thông tin")],
        },
        {
          label: "SEO mặc định",
          fields: [
            { name: "seoTitle", label: "Tiêu đề mặc định", type: "text", localized: true },
            { name: "seoDescription", label: "Mô tả mặc định", type: "textarea", localized: true, maxLength: 300 },
            imageField("ogImage", "Ảnh chia sẻ mặc định (1200×630)"),
          ],
        },
      ],
    },
  ],
};

export const HomePage: GlobalConfig = {
  slug: "home",
  label: "Trang chủ",
  admin: { group: "Trang" },
  access: { read: anyone, update: staffOnly },
  hooks: { afterChange: [revalidateGlobal("home")] },
  fields: [
    {
      name: "hero",
      label: "Hero",
      type: "group",
      fields: [
        { name: "overline", label: "Dòng nhỏ", type: "text", localized: true },
        { name: "title", label: "Tiêu đề", type: "text", localized: true, required: true },
        {
          type: "row",
          fields: [
            { name: "ctaLabel", label: "Nhãn nút", type: "text", localized: true },
            { name: "ctaHref", label: "Liên kết nút", type: "text" },
          ],
        },
        imageField("image", "Ảnh nền", true),
      ],
    },
    {
      name: "lineSections",
      label: "Các khối dòng sản phẩm",
      type: "array",
      admin: { description: "Mỗi khối gồm phần giới thiệu dòng và các thẻ bộ sưu tập (2, 3 hoặc 5 thẻ)." },
      fields: [
        { name: "line", label: "Dòng", type: "relationship", relationTo: "lines", required: true },
        { name: "lookbooks", label: "Bộ sưu tập hiển thị", type: "relationship", relationTo: "lookbooks", hasMany: true },
      ],
    },
    {
      name: "storeBanner",
      label: "Băng ảnh cửa hàng",
      type: "group",
      fields: [
        { name: "eyebrow", label: "Dòng nhỏ", type: "text", localized: true },
        { name: "text", label: "Nội dung", type: "textarea", localized: true },
        {
          type: "row",
          fields: [
            { name: "ctaLabel", label: "Nhãn liên kết", type: "text", localized: true },
            { name: "ctaHref", label: "Liên kết", type: "text" },
          ],
        },
        imageField("image", "Ảnh"),
      ],
    },
    {
      name: "quote",
      label: "Trích dẫn",
      type: "group",
      fields: [
        { name: "eyebrow", label: "Dòng nhỏ", type: "text", localized: true },
        { name: "text", label: "Câu trích dẫn", type: "textarea", localized: true },
        { name: "cite", label: "Người nói", type: "text", localized: true },
        imageField("image", "Ảnh nền"),
      ],
    },
    {
      name: "closing",
      label: "Băng ảnh cuối (dòng Chậm)",
      type: "group",
      fields: [
        { name: "line", label: "Dòng", type: "relationship", relationTo: "lines" },
        { name: "title", label: "Tiêu đề", type: "text", localized: true },
        { name: "ctaLabel", label: "Nhãn liên kết", type: "text", localized: true },
        imageField("image", "Ảnh"),
      ],
    },
    {
      name: "journal",
      label: "Khối Tạp chí",
      type: "group",
      fields: [
        { name: "title", label: "Tiêu đề", type: "text", localized: true },
        { name: "desc", label: "Mô tả", type: "textarea", localized: true },
      ],
    },
  ],
};

export const AboutPage: GlobalConfig = {
  slug: "about",
  label: "Trang Giới thiệu",
  admin: { group: "Trang" },
  access: { read: anyone, update: staffOnly },
  hooks: { afterChange: [revalidateGlobal("about")] },
  fields: [
    { name: "title", label: "Tiêu đề", type: "text", localized: true, required: true },
    { name: "subtitle", label: "Phụ đề", type: "text", localized: true },
    imageField("heroImage", "Ảnh lớn"),
    { name: "quote", label: "Trích dẫn", type: "textarea", localized: true },
    { name: "originTitle", label: "Tiêu đề Nguồn gốc", type: "text", localized: true },
    { name: "originText", label: "Nội dung Nguồn gốc", type: "textarea", localized: true },
    imageField("wideImage", "Ảnh ngang"),
    { name: "wideCaption", label: "Chú thích ảnh ngang", type: "text", localized: true },
    { name: "milestonesTitle", label: "Tiêu đề cột mốc", type: "text", localized: true },
    {
      name: "milestones",
      label: "Cột mốc",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            { name: "year", label: "Năm", type: "text", required: true },
            { name: "title", label: "Tiêu đề", type: "text", localized: true, required: true },
          ],
        },
        { name: "text", label: "Mô tả", type: "textarea", localized: true },
        imageField("image", "Ảnh"),
      ],
    },
    { name: "heritageEyebrow", label: "Di sản — dòng nhỏ", type: "text", localized: true },
    { name: "heritageTitle", label: "Di sản — tiêu đề", type: "text", localized: true },
    imageField("heritageImage", "Di sản — ảnh"),
    { name: "heritageText", label: "Di sản — nội dung", type: "textarea", localized: true },
    {
      name: "facts",
      label: "Thông số",
      type: "array",
      maxRows: 4,
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", label: "Nhãn", type: "text", localized: true, required: true },
            { name: "value", label: "Giá trị", type: "text", localized: true, required: true },
          ],
        },
      ],
    },
  ],
};

export const WorkshopPage: GlobalConfig = {
  slug: "workshop",
  label: "Trang Xưởng mở",
  admin: { group: "Trang" },
  access: { read: anyone, update: staffOnly },
  hooks: { afterChange: [revalidateGlobal("workshop")] },
  fields: [
    { name: "heroTitle", label: "Tiêu đề đầu trang", type: "text", localized: true, required: true },
    imageField("heroImage", "Ảnh lớn đầu trang"),
    { name: "intro", label: "Đoạn giới thiệu", type: "textarea", localized: true },
    { name: "quoteA", label: "Trích dẫn 1", type: "textarea", localized: true },
    { name: "quoteB", label: "Trích dẫn 2", type: "textarea", localized: true },
    {
      name: "gallery",
      label: "Ảnh (theo thứ tự xuất hiện, 6 ảnh)",
      type: "array",
      maxRows: 6,
      fields: [imageField("image", "Ảnh", true), { name: "alt", label: "Mô tả ảnh", type: "text", localized: true }],
    },
    { name: "benchTitle", label: "Tiêu đề khối cuối", type: "text", localized: true },
    { name: "benchText", label: "Nội dung khối cuối", type: "textarea", localized: true },
    { name: "bookingTitle", label: "Tiêu đề đặt lịch", type: "text", localized: true },
    { name: "bookingDesc", label: "Mô tả đặt lịch", type: "textarea", localized: true },
    { name: "bookingNote", label: "Ghi chú giá", type: "text", localized: true },
    {
      name: "sessions",
      label: "Lịch các buổi",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            { name: "title", label: "Tên buổi", type: "text", localized: true, required: true },
            { name: "day", label: "Ngày", type: "text", localized: true, required: true },
            { name: "time", label: "Giờ", type: "text", required: true },
            { name: "seats", label: "Chỗ trống", type: "number", defaultValue: 8 },
          ],
        },
      ],
    },
  ],
};
