import type { CollectionConfig } from "payload";
import { anyone, publishedOrStaff, staffOnly } from "../access";
import { imageField, slugField } from "../fields";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";

const hooks = (tag: string) => ({
  afterChange: [revalidateCollection(tag)],
  afterDelete: [revalidateCollectionDelete(tag)],
});

export const Promotions: CollectionConfig = {
  slug: "promotions",
  labels: { singular: "Ưu đãi", plural: "Ưu đãi" },
  admin: { useAsTitle: "title", group: "Nội dung", defaultColumns: ["title", "startDate", "endDate", "_status"] },
  defaultSort: "-startDate",
  versions: { drafts: true },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: hooks("promotions"),
  fields: [
    { name: "title", label: "Tên chương trình", type: "text", localized: true, required: true },
    slugField("title"),
    {
      type: "row",
      fields: [
        { name: "startDate", label: "Bắt đầu", type: "date", required: true, admin: { date: { displayFormat: "dd/MM/yyyy" } } },
        { name: "endDate", label: "Kết thúc", type: "date", required: true, admin: { date: { displayFormat: "dd/MM/yyyy" } } },
      ],
    },
    { name: "desc", label: "Mô tả", type: "textarea", localized: true, required: true },
    imageField("image", "Ảnh", true),
    { name: "href", label: "Liên kết khi bấm “Khám phá”", type: "text", defaultValue: "/danh-muc/tat-ca" },
  ],
};

export const Policies: CollectionConfig = {
  slug: "policies",
  labels: { singular: "Chính sách", plural: "Chính sách" },
  admin: { useAsTitle: "title", group: "Nội dung", defaultColumns: ["order", "title", "effectiveDate"] },
  defaultSort: "order",
  versions: { drafts: true },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: hooks("policies"),
  fields: [
    { name: "title", label: "Tiêu đề", type: "text", localized: true, required: true },
    slugField("title"),
    {
      type: "row",
      fields: [
        { name: "order", label: "Thứ tự", type: "number", defaultValue: 0 },
        { name: "version", label: "Phiên bản", type: "text" },
        { name: "effectiveDate", label: "Ngày hiệu lực", type: "date", admin: { date: { displayFormat: "dd/MM/yyyy" } } },
      ],
    },
    { name: "content", label: "Nội dung", type: "richText", localized: true, required: true },
  ],
};

export const Stores: CollectionConfig = {
  slug: "stores",
  labels: { singular: "Cửa hàng", plural: "Cửa hàng" },
  admin: { useAsTitle: "name", group: "Nội dung", defaultColumns: ["name", "region", "phone"] },
  defaultSort: "order",
  access: { read: anyone, create: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: hooks("stores"),
  fields: [
    { name: "name", label: "Tên cửa hàng", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "region", label: "Khu vực (lọc trên trang)", type: "text", localized: true, required: true },
        { name: "footerRegion", label: "Nhóm ở chân trang", type: "text", localized: true, required: true },
        { name: "order", label: "Thứ tự", type: "number", defaultValue: 0 },
      ],
    },
    { name: "address", label: "Địa chỉ", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "phone", label: "Điện thoại", type: "text", required: true },
        { name: "hours", label: "Giờ mở cửa", type: "text", localized: true, required: true },
      ],
    },
    imageField("image", "Ảnh cửa hàng"),
  ],
};

export const Bookings: CollectionConfig = {
  slug: "bookings",
  labels: { singular: "Đăng ký xưởng mở", plural: "Đăng ký xưởng mở" },
  admin: { useAsTitle: "name", group: "Khách hàng", defaultColumns: ["name", "phone", "session", "store", "status", "createdAt"] },
  // Khách gửi qua server action (có giới hạn tần suất); REST công khai bị khóa
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: "name", label: "Họ tên", type: "text", required: true, maxLength: 100 },
    { name: "phone", label: "Điện thoại", type: "text", required: true, maxLength: 20 },
    { name: "session", label: "Buổi", type: "text", required: true },
    { name: "store", label: "Cửa hàng", type: "text" },
    {
      name: "status",
      label: "Trạng thái",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "Mới", value: "new" },
        { label: "Đã gọi xác nhận", value: "confirmed" },
        { label: "Hủy", value: "cancelled" },
      ],
    },
  ],
};
