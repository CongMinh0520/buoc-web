import { APIError, type CollectionConfig } from "payload";
import { selfOrStaff, staffFieldOnly, staffOnly } from "../access";

/**
 * Khách hàng của cửa hàng (tách biệt với nhân viên `users`).
 * - Không vào được /admin (admin.user = "users").
 * - Đăng ký/đăng nhập/OTP đi qua server action có giới hạn tần suất; REST create bị khóa.
 * - Token lưu trong cookie HTTP-only, không lộ cho JavaScript.
 */
export const Customers: CollectionConfig = {
  slug: "customers",
  labels: { singular: "Khách hàng", plural: "Khách hàng" },
  admin: { useAsTitle: "email", group: "Khách hàng", defaultColumns: ["email", "name", "phone", "points", "createdAt"] },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: { sameSite: "Lax", secure: process.env.NODE_ENV === "production" },
  },
  access: {
    admin: () => false,
    create: staffOnly,
    read: selfOrStaff,
    update: selfOrStaff,
    delete: staffOnly,
  },
  hooks: {
    beforeLogin: [
      ({ user }) => {
        if (!user.emailVerified) {
          throw new APIError("Tài khoản chưa xác minh email. Vui lòng nhập mã OTP đã gửi tới email của bạn.", 403);
        }
      },
    ],
  },
  fields: [
    { name: "name", label: "Họ tên", type: "text", required: true, maxLength: 100 },
    { name: "phone", label: "Điện thoại", type: "text", maxLength: 20 },
    {
      type: "row",
      fields: [
        { name: "gender", label: "Giới tính", type: "select", options: ["Nữ", "Nam", "Khác"].map((v) => ({ label: v, value: v })) },
        { name: "birthday", label: "Ngày sinh", type: "date" },
        { name: "shoeSize", label: "Size giày", type: "text", maxLength: 4 },
      ],
    },
    { name: "marketingOptIn", label: "Nhận tin khuyến mãi", type: "checkbox", defaultValue: false },
    {
      name: "addresses",
      label: "Sổ địa chỉ",
      type: "array",
      maxRows: 10,
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", label: "Tên địa chỉ", type: "text", required: true, maxLength: 40 },
            { name: "isDefault", label: "Mặc định", type: "checkbox" },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "name", label: "Người nhận", type: "text", required: true, maxLength: 100 },
            { name: "phone", label: "Điện thoại", type: "text", required: true, maxLength: 20 },
          ],
        },
        { name: "line", label: "Địa chỉ cụ thể", type: "text", required: true, maxLength: 200 },
        {
          type: "row",
          fields: [
            { name: "province", label: "Tỉnh / Thành phố", type: "text", required: true, maxLength: 60 },
            { name: "ward", label: "Phường / Xã", type: "text", required: true, maxLength: 60 },
          ],
        },
      ],
    },
    // ——— Các trường dưới đây khách không tự sửa được ———
    {
      name: "points",
      label: "Điểm thưởng",
      type: "number",
      defaultValue: 0,
      access: { update: staffFieldOnly },
      admin: { position: "sidebar" },
    },
    {
      name: "emailVerified",
      label: "Đã xác minh email",
      type: "checkbox",
      defaultValue: false,
      access: { update: staffFieldOnly },
      admin: { position: "sidebar" },
    },
    {
      name: "consent",
      label: "Đồng ý xử lý dữ liệu cá nhân",
      type: "group",
      access: { update: staffFieldOnly },
      admin: { readOnly: true, description: "Bằng chứng đồng ý khi đăng ký (Luật Bảo vệ dữ liệu cá nhân 2025)." },
      fields: [
        { name: "privacyAcceptedAt", label: "Đồng ý chính sách bảo mật lúc", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
        { name: "policyVersions", label: "Phiên bản chính sách lúc đó", type: "text" },
        { name: "marketingChangedAt", label: "Đổi lựa chọn nhận tin khuyến mãi lúc", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
      ],
    },
    { name: "cart", type: "json", admin: { hidden: true } },
    // OTP: chỉ lưu mã đã băm, có hạn và giới hạn số lần thử; ẩn khỏi mọi API
    { name: "otpHash", type: "text", hidden: true },
    { name: "otpExpires", type: "date", hidden: true },
    { name: "otpAttempts", type: "number", hidden: true },
    { name: "otpPurpose", type: "text", hidden: true },
  ],
};
