import type { Locale } from "./config";
import { dictionaries } from "./dictionaries";

/**
 * Một số câu được hệ thống tự sinh và lưu thẳng vào dữ liệu khách hàng bằng tiếng Việt
 * (lịch sử điểm, thông báo trạng thái đơn — xem payload/collections/Orders.ts). Khi xem bản tiếng Anh,
 * dịch các mẫu câu đã biết; câu khác (do nhân viên tự viết) giữ nguyên.
 */
const FIXED_EN: Record<string, string> = {
  "Quà chào mừng thành viên": "Member welcome gift",
  "Đổi phiếu quà tặng": "Voucher redemption",
  "Trạng thái đơn hàng của bạn vừa được cập nhật.": "Your order status has just been updated.",
  "Xem đơn hàng": "View order",
  "Xem chi tiết": "View details",
  "Xem quyền lợi": "View benefits",
  "Xem bộ sưu tập": "View collection",
};

export function localizeGenerated(text: string, locale: Locale): string {
  if (locale === "vi" || !text) return text;
  if (FIXED_EN[text]) return FIXED_EN[text];
  const order = text.match(/^Đơn hàng #(\S+?)(?:: (.+))?$/);
  if (order) {
    const [, code, status] = order;
    if (!status) return `Order #${code}`;
    // Nhãn trạng thái tiếng Việt → khóa → nhãn tiếng Anh
    const key = Object.entries(dictionaries.vi.orderStatus).find(([, v]) => v === status)?.[0];
    return `Order #${code}: ${key ? dictionaries[locale].orderStatus[key] : status}`;
  }
  return text;
}
