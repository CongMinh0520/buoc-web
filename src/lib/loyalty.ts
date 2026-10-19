/** Hạng thành viên theo điểm tích lũy (1 điểm cho mỗi 10.000 ₫ của đơn đã giao) */
export const customerTier = (points: number) =>
  points >= 5000
    ? { tier: "Kim cương", next: null as string | null, nextAt: null as number | null }
    : points >= 2000
      ? { tier: "Vàng", next: "Kim cương", nextAt: 5000 }
      : { tier: "Bạc", next: "Vàng", nextAt: 2000 };

// Tên hạng hiển thị và đặc quyền theo ngôn ngữ: i18n/dictionaries → loyalty.tiers / loyalty.perkList
