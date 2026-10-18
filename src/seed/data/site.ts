// Toàn bộ nội dung là thương hiệu hư cấu, dùng để dựng giao diện mẫu.

export const brand = {
  wordmark: "bước",
  name: "BƯỚC Atelier",
  tagline: "Mỗi bước đi là một đường khâu — giày thủ công từ Sài Gòn.",
  founder: "Xưởng giày BƯỚC",
  email: "xinchao@buoc-atelier.vn",
  hotline: "0900 000 000",
  copyright: "© 2026 BƯỚC ATELIER. BẢN QUYỀN ĐƯỢC BẢO LƯU.",
};

export type LineKey = "atelier" | "welt" | "lab" | "cham";

export const lines: Record<
  LineKey,
  { key: LineKey; label: string; overline: string; intro: string; tint: string }
> = {
  atelier: {
    key: "atelier",
    label: "ATELIER",
    overline: "Thủ công từ 2014",
    intro:
      "Giày da đóng tay trên phom gỗ, đế khâu Goodyear và da thuộc thực vật — mỗi đôi cần 21 ngày để hoàn thiện.",
    tint: "rgba(176, 141, 87, 0.22)",
  },
  welt: {
    key: "welt",
    label: "WELT",
    overline: "Goodyear welted craft",
    intro:
      "Hai trăm mũi khâu nối thân và đế, cho đôi giày thay được đế, đi được mười năm và đẹp hơn theo năm tháng.",
    tint: "rgba(74, 93, 78, 0.22)",
  },
  lab: {
    key: "lab",
    label: "B.LAB",
    overline: "Avant-garde editorial",
    intro:
      "Phòng thí nghiệm hình khối của BƯỚC: đế dày, đường cắt kiến trúc và chất liệu thử nghiệm cho thành phố về đêm.",
    tint: "rgba(28, 36, 52, 0.22)",
  },
  cham: {
    key: "cham",
    label: "CHẬM",
    overline: "Slow living footwear",
    intro: "Dép, sandal và giày lười cho những ngày không cần vội — mềm, nhẹ và thở được.",
    tint: "rgba(0,0,0,0)",
  },
};

export const mainNav = [
  { label: "Nam", href: "/danh-muc/nam" },
  { label: "Nữ", href: "/danh-muc/nu" },
  { label: "Chậm", href: "/dong/cham" },
  { label: "Ưu đãi", href: "/uu-dai" },
  { label: "Xưởng mở", href: "/xuong-mo" },
  { label: "Tạp chí", href: "/tap-chi" },
];

export const stores = [
  {
    region: "TP. Hồ Chí Minh",
    items: [
      "BƯỚC Đồng Khởi — 68 Đồng Khởi, phường Sài Gòn, TP. Hồ Chí Minh",
      "BƯỚC Thảo Điền — 21 Xuân Thủy, phường An Khánh, TP. Hồ Chí Minh",
    ],
  },
  { region: "Hà Nội", items: ["BƯỚC Hàng Bông — 102 Hàng Bông, phường Hoàn Kiếm, Hà Nội"] },
  { region: "Miền Trung", items: ["BƯỚC Bạch Đằng — 15 Bạch Đằng, phường Hải Châu, Đà Nẵng"] },
  {
    region: "Miền Tây",
    items: ["BƯỚC Ninh Kiều — 9 Hai Bà Trưng, phường Ninh Kiều, Cần Thơ"],
  },
];

export const footerCollections: { line: string; items: { label: string; href: string }[] }[] = [
  {
    line: "Atelier",
    items: [
      { label: "Sen Hạ ’26", href: "/bo-suu-tap/sen-ha-26" },
      { label: "Gió Chướng", href: "/bo-suu-tap/gio-chuong" },
      { label: "Mono Last", href: "/bo-suu-tap/mono-last" },
    ],
  },
  {
    line: "Welt",
    items: [
      { label: "Dòng Welt", href: "/dong/welt" },
      { label: "The Loafer Edit", href: "/bo-suu-tap/the-loafer-edit" },
      { label: "Oxford Hàng Ngang", href: "/san-pham/oxford-hang-ngang" },
    ],
  },
  {
    line: "B.Lab",
    items: [
      { label: "Đêm Sài Gòn", href: "/bo-suu-tap/dem-sai-gon" },
      { label: "Dòng B.Lab", href: "/dong/lab" },
      { label: "Boot Đô Thị", href: "/bo-suu-tap/boot-do-thi" },
    ],
  },
];

export const footerInfo = [
  { label: "Về BƯỚC", href: "/gioi-thieu" },
  { label: "Tạp chí", href: "/tap-chi" },
  { label: "Xưởng mở", href: "/xuong-mo" },
  { label: "Ưu đãi", href: "/uu-dai" },
  { label: "Tra cứu đơn hàng", href: "/tra-cuu-don-hang" },
  { label: "Điều khoản & Chính sách", href: "/chinh-sach" },
];
