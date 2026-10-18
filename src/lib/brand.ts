/**
 * Tên thương hiệu thật được cấu hình trên admin (Cài đặt chung → Thương hiệu).
 * Giá trị dưới đây chỉ dùng khi database còn trống (vừa deploy, chưa nhập Cài đặt chung).
 */
export const FALLBACK_BRAND_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Cửa hàng";
