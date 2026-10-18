import type { Access, FieldAccess, PayloadRequest } from "payload";

/** Người dùng đăng nhập vào trang quản trị (collection `users`) */
export const isStaff = (req: PayloadRequest) => req.user?.collection === "users";
export const isAdmin = (req: PayloadRequest) =>
  req.user?.collection === "users" && (req.user as { role?: string }).role === "admin";

export const staffOnly: Access = ({ req }) => isStaff(req);
export const adminOnly: Access = ({ req }) => isAdmin(req);
export const anyone: Access = () => true;
export const nobody: Access = () => false;

/** Nội dung công khai: khách chỉ đọc bản đã xuất bản, nhân viên đọc cả bản nháp */
export const publishedOrStaff: Access = ({ req }) => {
  if (isStaff(req)) return true;
  return { _status: { equals: "published" } };
};

/** Khách hàng chỉ thấy bản ghi của chính mình (field `customer`) */
export const ownCustomerOrStaff: Access = ({ req }) => {
  if (isStaff(req)) return true;
  if (req.user?.collection === "customers") return { customer: { equals: req.user.id } };
  return false;
};

/** Khách hàng chỉ đọc/sửa tài khoản của chính mình */
export const selfOrStaff: Access = ({ req }) => {
  if (isStaff(req)) return true;
  if (req.user?.collection === "customers") return { id: { equals: req.user.id } };
  return false;
};

export const staffFieldOnly: FieldAccess = ({ req }) => isStaff(req);
