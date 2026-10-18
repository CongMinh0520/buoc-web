import type { CollectionConfig } from "payload";
import { adminOnly, isAdmin, isStaff } from "../access";

/** Tài khoản nhân viên đăng nhập trang quản trị /admin */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Nhân viên", plural: "Nhân viên" },
  admin: { useAsTitle: "email", group: "Hệ thống", defaultColumns: ["email", "name", "role"] },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8 giờ
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: { sameSite: "Strict", secure: process.env.NODE_ENV === "production" },
  },
  access: {
    admin: ({ req }) => isStaff(req),
    read: ({ req }) => {
      if (isAdmin(req)) return true;
      if (req.user?.collection === "users") return { id: { equals: req.user.id } };
      return false;
    },
    create: adminOnly,
    update: ({ req }) => {
      if (isAdmin(req)) return true;
      if (req.user?.collection === "users") return { id: { equals: req.user.id } };
      return false;
    },
    delete: adminOnly,
  },
  fields: [
    { name: "name", label: "Họ tên", type: "text" },
    {
      name: "role",
      label: "Vai trò",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Quản trị (toàn quyền)", value: "admin" },
        { label: "Biên tập & xử lý đơn", value: "editor" },
      ],
      access: { update: ({ req }) => isAdmin(req) },
    },
  ],
};
