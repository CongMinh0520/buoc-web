/** Hạng thành viên theo điểm tích lũy (1 điểm cho mỗi 10.000 ₫ của đơn đã giao) */
export const customerTier = (points: number) =>
  points >= 5000
    ? { tier: "Kim cương", next: null as string | null, nextAt: null as number | null }
    : points >= 2000
      ? { tier: "Vàng", next: "Kim cương", nextAt: 5000 }
      : { tier: "Bạc", next: "Vàng", nextAt: 2000 };

/** Đặc quyền theo hạng — nội dung tĩnh, có thể chuyển sang CMS khi cần */
export const tierPerks: Record<string, { title: string; desc: string }[]> = {
  "Bạc": [
    { title: "Khắc tên trên lót giày", desc: "Miễn phí cho mọi đơn hàng của thành viên." },
    { title: "Đánh xi trọn đời", desc: "Mang giày đến bất kỳ cửa hàng nào trong hệ thống để được chăm sóc miễn phí." },
    { title: "Quà sinh nhật", desc: "Phiếu 150.000 ₫ trong tháng sinh nhật." },
  ],
  "Vàng": [
    { title: "Thay đế miễn phí lần đầu", desc: "Áp dụng cho mọi đôi giày đế khâu Goodyear." },
    { title: "Khắc tên trên lót giày", desc: "Miễn phí cho mọi đơn hàng của thành viên." },
    { title: "Quà sinh nhật", desc: "Phiếu 300.000 ₫ và bộ chăm sóc da trong tháng sinh nhật." },
  ],
  "Kim cương": [
    { title: "Thay đế miễn phí trọn đời", desc: "Cho mọi đôi giày mua tại cửa hàng." },
    { title: "Đặt riêng theo khuôn chân", desc: "Ưu tiên lịch đo và giảm 15% phí làm khuôn." },
    { title: "Quà sinh nhật", desc: "Phiếu 500.000 ₫ và một buổi xưởng mở riêng." },
  ],
};
