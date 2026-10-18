// Nội dung các trang lẻ — thương hiệu hư cấu BƯỚC Atelier.
import { img } from "./images";
import type { LineKey } from "./site";

/* ───────── Ưu đãi ───────── */
export const promotions = [
  {
    slug: "uu-dai-mua-mua",
    title: "Ưu đãi mùa mưa",
    period: "01.10 — 31.10.2026",
    desc: "Giảm đến 25% cho boot và giày da kỵ nước. Tặng kèm bộ chăm sóc da lộn.",
    image: img.labChelsea,
    href: "/danh-muc/tat-ca",
  },
  {
    slug: "uu-dai-thanh-vien",
    title: "Ưu đãi thành viên",
    period: "01.09 — 30.11.2026",
    desc: "Nhân đôi điểm thưởng và miễn phí khắc tên trên lót giày cho thành viên BƯỚC.",
    image: img.craftThread,
    href: "/tai-khoan/tich-diem",
  },
  {
    slug: "doi-cu-lay-moi",
    title: "Đổi cũ lấy mới",
    period: "15.10 — 15.12.2026",
    desc: "Mang đôi giày da cũ bất kỳ đến cửa hàng, nhận ngay phiếu 500.000 ₫ cho đôi mới.",
    image: img.storeShelf,
    href: "/gioi-thieu#cua-hang",
  },
];

/* ───────── Tạp chí ───────── */
export type ArticleBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string; cite: string }
  | { type: "list"; items: string[] }
  | { type: "olist"; items: string[] }
  | { type: "table"; head: [string, string]; rows: [string, string][] }
  | { type: "images"; srcs: string[]; caption?: string };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Bộ sưu tập" | "Chăm sóc" | "Xưởng" | "Sự kiện";
  date: string;
  image: string;
  body?: ArticleBlock[];
};

const goodyearBody: ArticleBlock[] = [
  { type: "h2", text: "1. Tổng quan" },
  {
    type: "p",
    text: "Đế khâu Goodyear là kỹ thuật nối thân giày với đế bằng một dải da gọi là welt. Thay vì dán keo, người thợ khâu hai đường chỉ: một đường nối thân giày với welt, một đường nối welt với đế ngoài.",
  },
  {
    type: "p",
    text: "Cách làm này tốn thời gian gấp ba lần giày dán keo, nhưng cho phép thay đế nhiều lần. Một đôi giày tốt vì thế có thể đi cùng chủ nhân hơn mười năm.",
  },
  { type: "images", srcs: [img.craftTable, img.p.oxfordD], caption: "Dải welt được khâu tay quanh phom gỗ tại xưởng Đồng Khởi." },
  { type: "h2", text: "2. Câu chuyện phía sau" },
  {
    type: "p",
    text: "Năm 2014, xưởng BƯỚC bắt đầu với hai người thợ và một bộ phom gỗ mua lại từ một tiệm giày cũ ở Chợ Lớn. Đôi Oxford đầu tiên mất gần một tháng để hoàn thiện.",
  },
  { type: "quote", text: "Đôi giày đẹp nhất là đôi được sửa nhiều lần nhất.", cite: "Thợ cả, xưởng Đồng Khởi" },
  { type: "h2", text: "3. Chất liệu và quy trình" },
  {
    type: "list",
    items: [
      "Da bò thuộc thực vật, lên màu đẹp theo thời gian",
      "Chỉ lanh sáp ong, chịu nước và ma sát",
      "Đế da nhập từ Tây Ban Nha, có thể thay bằng đế cao su",
      "Lót bần (cork) định hình theo bàn chân",
    ],
  },
  { type: "p", text: "Mỗi đôi giày đi qua bốn công đoạn chính:" },
  {
    type: "olist",
    items: ["Cắt da theo rập và lạng mỏng mép", "Dựng thân giày trên phom gỗ trong 48 giờ", "Khâu welt và khâu đế", "Hoàn thiện, đánh xi và kiểm tra"],
  },
  {
    type: "table",
    head: ["Công đoạn", "Thời gian"],
    rows: [
      ["Cắt và lạng da", "2 giờ"],
      ["Dựng phom", "48 giờ"],
      ["Khâu welt & đế", "6–8 giờ"],
      ["Hoàn thiện", "3 giờ"],
    ],
  },
  { type: "h2", text: "4. Nhận biết giày khâu Goodyear" },
  {
    type: "p",
    text: "Lật đôi giày lên: nếu thấy một đường chỉ chạy vòng quanh mép đế, cách mép khoảng 3mm, đó là dấu hiệu của đế khâu. Giày dán keo thường có mép đế liền, không có đường chỉ.",
  },
  { type: "images", srcs: [img.storeCollection], caption: "Các mẫu Welt trưng bày tại cửa hàng Đồng Khởi." },
  { type: "h2", text: "5. Chăm sóc để đi lâu" },
  {
    type: "p",
    text: "Dùng cây giữ phom bằng gỗ tuyết tùng sau mỗi lần đi, không mang một đôi hai ngày liên tiếp, và đánh xi mỗi tháng một lần.",
  },
  {
    type: "p",
    text: "Khi đế mòn đến lớp welt, mang giày đến bất kỳ cửa hàng BƯỚC nào để thay đế. Thành viên được thay đế miễn phí lần đầu.",
  },
  { type: "h2", text: "6. Thông tin thêm" },
  { type: "p", text: "Bạn có thể đặt lịch ghé xưởng mở vào thứ Bảy hằng tuần để xem nghệ nhân khâu đế trực tiếp." },
];

export const articles: Article[] = [
  {
    slug: "de-khau-goodyear",
    title: "Đế khâu Goodyear: vì sao đi được mười năm",
    excerpt: "Nhìn cận cảnh 200 mũi khâu làm nên độ bền của một đôi giày thủ công.",
    category: "Xưởng",
    date: "10/10/2026",
    image: img.news3,
    body: goodyearBody,
  },
  {
    slug: "ra-mat-sen-ha-26",
    title: "Ra mắt bộ sưu tập Sen Hạ ’26",
    excerpt: "Mười hai thiết kế lấy cảm hứng từ đầm sen tháng Sáu, nhuộm tay bằng màu thực vật.",
    category: "Bộ sưu tập",
    date: "02/10/2026",
    image: img.atelierSenHa,
  },
  {
    slug: "cham-soc-da-lon-mua-mua",
    title: "Chăm sóc giày da lộn mùa mưa",
    excerpt: "Năm bước đơn giản để đôi giày da lộn vượt qua những cơn mưa chiều Sài Gòn.",
    category: "Chăm sóc",
    date: "25/09/2026",
    image: img.news2,
  },
  {
    slug: "mot-ngay-trong-xuong",
    title: "Một ngày trong xưởng Đồng Khởi",
    excerpt: "Từ 7 giờ sáng đến lúc tắt đèn: nhịp làm việc của bốn người thợ đóng giày.",
    category: "Xưởng",
    date: "18/09/2026",
    image: img.craftTable,
  },
  {
    slug: "pop-up-ha-noi",
    title: "Pop-up mùa thu tại Hàng Bông",
    excerpt: "Không gian thử giày và đo chân miễn phí trong ba tuần tại phố cổ Hà Nội.",
    category: "Sự kiện",
    date: "09/09/2026",
    image: img.storeWall,
  },
  {
    slug: "chon-size-giay-tay",
    title: "Chọn size giày tây cho bàn chân bè",
    excerpt: "Đo chân đúng cách và những phom giày phù hợp với bàn chân người Việt.",
    category: "Chăm sóc",
    date: "28/08/2026",
    image: img.p.derbyA,
  },
  {
    slug: "xuong-mo-thang-tam",
    title: "Xưởng mở tháng Tám: làm dép da cùng nghệ nhân",
    excerpt: "Ba giờ để tự tay cắt, khâu và mang về một đôi dép da của riêng bạn.",
    category: "Sự kiện",
    date: "15/08/2026",
    image: img.craftTools,
  },
  {
    slug: "da-thuoc-thuc-vat",
    title: "Da thuộc thực vật: chậm mà bền",
    excerpt: "Vì sao chúng tôi chọn quy trình thuộc da kéo dài 40 ngày bằng vỏ cây.",
    category: "Xưởng",
    date: "02/08/2026",
    image: img.craftThread,
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

/* ───────── Chính sách ───────── */
export type PolicyBlock = { heading: string; paragraphs?: string[]; items?: string[] };

export const policies: { id: string; title: string; version?: string; effective?: string; blocks: PolicyBlock[] }[] = [
  {
    id: "ho-tro",
    title: "Hình thức hỗ trợ trực tuyến",
    version: "01/2026",
    effective: "01/10/2026",
    blocks: [
      {
        heading: "1. Hỗ trợ qua website",
        paragraphs: ["Khách hàng có thể liên hệ BƯỚC qua khung trò chuyện trên website để được hỗ trợ:"],
        items: [
          "Tư vấn sản phẩm và chọn size;",
          "Hỗ trợ đặt hàng và thanh toán;",
          "Kiểm tra tình trạng đơn hàng;",
          "Hỗ trợ đổi size, đổi trả và hoàn tiền;",
          "Đặt lịch thay đế, bảo dưỡng giày;",
          "Tiếp nhận phản ánh và khiếu nại.",
        ],
      },
      {
        heading: "2. Hỗ trợ qua email",
        paragraphs: [
          "Khách hàng gửi yêu cầu về xinchao@buoc-atelier.vn. Nội dung nên ghi rõ mã đơn hàng và vấn đề cần hỗ trợ. Chúng tôi phản hồi trong vòng 24 giờ làm việc.",
        ],
      },
      {
        heading: "3. Hỗ trợ qua hotline",
        paragraphs: ["Hotline: 0900 000 000 (8:00 — 21:00 mỗi ngày, kể cả cuối tuần và ngày lễ)."],
      },
      {
        heading: "4. Hỗ trợ qua mạng xã hội",
        paragraphs: [
          "Khách hàng nên kiểm tra dấu xác thực của trang chính thức trước khi trao đổi. BƯỚC không bán hàng qua tài khoản cá nhân.",
        ],
      },
      {
        heading: "5. Thời gian xử lý",
        paragraphs: [
          "Yêu cầu đổi size được xử lý trong 2 ngày làm việc. Yêu cầu cần kiểm tra đơn hàng hoặc vận chuyển có thể mất 3–5 ngày làm việc.",
        ],
      },
      {
        heading: "6. Thông tin khách hàng cần cung cấp",
        items: ["Họ và tên;", "Số điện thoại hoặc email;", "Mã đơn hàng;", "Tên sản phẩm và size;", "Hình ảnh hoặc video liên quan, nếu có."],
      },
      {
        heading: "7. An toàn khi được hỗ trợ",
        paragraphs: ["BƯỚC không bao giờ yêu cầu khách hàng cung cấp:"],
        items: ["Mật khẩu ngân hàng;", "Mã OTP;", "Mã PIN hoặc mã bảo mật thẻ;", "Mật khẩu tài khoản."],
      },
      {
        heading: "8. Hiệu lực",
        paragraphs: ["Chính sách có hiệu lực từ ngày 01/10/2026 và có thể được cập nhật; phiên bản mới sẽ được đăng tại trang này."],
      },
    ],
  },
  {
    id: "phan-anh",
    title: "Tiếp nhận và giải quyết phản ánh, khiếu nại",
    blocks: [
      {
        heading: "Quy trình",
        items: [
          "Tiếp nhận phản ánh qua hotline, email hoặc cửa hàng;",
          "Xác minh thông tin trong 2 ngày làm việc;",
          "Đề xuất phương án và phản hồi khách hàng;",
          "Hoàn tất xử lý trong tối đa 7 ngày làm việc.",
        ],
      },
    ],
  },
  {
    id: "gia",
    title: "Chính sách giá",
    blocks: [
      {
        heading: "Giá niêm yết",
        paragraphs: ["Giá trên website đã bao gồm VAT và giống nhau ở mọi cửa hàng BƯỚC, trừ khi có chương trình ưu đãi riêng."],
      },
    ],
  },
  {
    id: "giao-hang",
    title: "Giao hàng, đổi size và hoàn tiền",
    blocks: [
      {
        heading: "Giao hàng",
        paragraphs: ["Miễn phí giao hàng toàn quốc. Nội thành TP. Hồ Chí Minh và Hà Nội nhận hàng trong 1–2 ngày, các tỉnh khác 3–5 ngày."],
      },
      {
        heading: "Đổi size",
        paragraphs: ["Đổi size miễn phí trong 30 ngày với giày chưa qua sử dụng ngoài trời, còn nguyên hộp và phụ kiện."],
      },
    ],
  },
  {
    id: "thanh-toan",
    title: "Chính sách thanh toán",
    blocks: [{ heading: "Hình thức", items: ["Thanh toán khi nhận hàng (COD);", "Thẻ ATM nội địa, Visa, Mastercard;", "Ví điện tử và chuyển khoản QR."] }],
  },
  {
    id: "dieu-kien",
    title: "Điều kiện hạn chế khi cung cấp hàng hóa",
    blocks: [
      {
        heading: "Sản phẩm đặt riêng",
        paragraphs: ["Giày đóng theo số đo riêng hoặc có khắc tên không áp dụng đổi trả, trừ trường hợp lỗi sản xuất."],
      },
    ],
  },
  {
    id: "bao-mat",
    title: "Bảo vệ thông tin cá nhân",
    blocks: [
      {
        heading: "Phạm vi",
        paragraphs: ["BƯỚC chỉ thu thập thông tin cần thiết để giao hàng và chăm sóc khách hàng, không chia sẻ cho bên thứ ba vì mục đích quảng cáo."],
      },
    ],
  },
];

/* ───────── Về BƯỚC ───────── */
export const milestones = [
  { year: "2014", title: "Xưởng hai người thợ", image: img.craftTools, text: "Bắt đầu trong một căn gác ở Chợ Lớn với bộ phom gỗ mua lại." },
  { year: "2018", title: "Cửa hàng đầu tiên", image: img.storeWall, text: "Mở cửa hàng kiêm xưởng mở trên đường Đồng Khởi." },
  { year: "2024", title: "Năm cửa hàng", image: img.storeCollection, text: "Có mặt tại Sài Gòn, Hà Nội, Đà Nẵng và Cần Thơ." },
];

export const storeList = [
  { name: "BƯỚC Đồng Khởi", region: "Hồ Chí Minh", address: "68 Đồng Khởi, phường Sài Gòn, TP. Hồ Chí Minh", phone: "0900 000 001", hours: "9:00 — 21:30", image: img.storeWall },
  { name: "BƯỚC Thảo Điền", region: "Hồ Chí Minh", address: "21 Xuân Thủy, phường An Khánh, TP. Hồ Chí Minh", phone: "0900 000 002", hours: "9:00 — 21:00", image: img.storeShelf },
  { name: "BƯỚC Hàng Bông", region: "Hà Nội", address: "102 Hàng Bông, phường Hoàn Kiếm, Hà Nội", phone: "0900 000 003", hours: "8:30 — 21:30", image: img.storeCollection },
  { name: "BƯỚC Bạch Đằng", region: "Đà Nẵng", address: "15 Bạch Đằng, phường Hải Châu, Đà Nẵng", phone: "0900 000 004", hours: "9:00 — 21:00", image: img.storeRack },
  { name: "BƯỚC Ninh Kiều", region: "Cần Thơ", address: "9 Hai Bà Trưng, phường Ninh Kiều, Cần Thơ", phone: "0900 000 005", hours: "9:00 — 20:30", image: img.footwearDisplay },
];

/* ───────── Bộ sưu tập ───────── */
export const collections: { slug: string; title: string; line: LineKey; desc: string; image: string; products: string[] }[] = [
  {
    slug: "sen-ha-26",
    title: "Sen Hạ ’26",
    line: "atelier",
    desc: "Mười hai thiết kế nhuộm tay bằng màu thực vật, lấy cảm hứng từ đầm sen tháng Sáu. Mỗi đôi được đóng tay trên phom gỗ trong 21 ngày, với họa tiết in lụa thủ công lên da dê.",
    image: img.atelierSenHa,
    products: ["pump-sen-ha", "pump-ngoc-trai", "sandal-nang-ha", "brogue-gio-chuong", "derby-mono-last", "giay-den-toi-gian", "chukka-dat-do", "loafer-horsebit-mono", "half-shoe-hai-mau", "bootie-da-bo", "oxford-hang-ngang", "giay-bet-trang", "sandal-da-mo"],
  },
  {
    slug: "gio-chuong",
    title: "Gió Chướng",
    line: "atelier",
    desc: "Hoa văn đục lỗ gợi sóng nước miền Tây mùa gió chướng, da cognac chuyển màu theo năm tháng.",
    image: img.atelierGioChuong,
    products: ["brogue-gio-chuong", "chukka-dat-do", "derby-pho-cu", "loafer-penny-sai-gon", "oxford-hang-ngang", "bootie-da-bo"],
  },
  {
    slug: "mono-last",
    title: "Mono Last",
    line: "atelier",
    desc: "Một tấm da, một đường may — thử nghiệm tối giản nhất của xưởng.",
    image: img.atelierMonoLast,
    products: ["derby-mono-last", "giay-den-toi-gian", "slip-on-than-chi", "giay-bet-trang"],
  },
  {
    slug: "the-loafer-edit",
    title: "The Loafer Edit",
    line: "welt",
    desc: "Giày lười da lộn cho khí hậu nóng ẩm — lót thoáng, xỏ chân là đi.",
    image: img.weltLoafer,
    products: ["loafer-penny-sai-gon", "loafer-horsebit-mono", "slip-on-than-chi", "half-shoe-hai-mau"],
  },
  {
    slug: "dem-sai-gon",
    title: "Đêm Sài Gòn",
    line: "lab",
    desc: "Da nhung đen, gót kim loại phủ mờ và đế dày cho những buổi tối dài.",
    image: img.labDem,
    products: ["stiletto-dem", "pump-anh-kim", "boot-buoc-dem", "chelsea-mua-ngau", "sandal-quai-manh", "peep-toe-hoang-hon"],
  },
  {
    slug: "boot-do-thi",
    title: "Boot Đô Thị",
    line: "lab",
    desc: "Boot da dầu và Chelsea kỵ nước cho mùa mưa thành phố.",
    image: img.labBoot,
    products: ["boot-do-thi", "chelsea-mua-ngau", "boot-buoc-dem", "chukka-dat-do", "bootie-da-bo"],
  },
];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

/* ───────── Tài khoản: tích điểm & thông báo ───────── */
export const loyalty = {
  name: "TRẦN MINH ANH",
  tier: "Bạc",
  points: 1240,
  nextTier: "Vàng",
  nextAt: 2000,
  perks: [
    { title: "Thay đế miễn phí lần đầu", desc: "Áp dụng cho mọi đôi giày đế khâu Goodyear." },
    { title: "Khắc tên trên lót giày", desc: "Miễn phí cho mọi đơn hàng của thành viên." },
    { title: "Quà sinh nhật", desc: "Phiếu 300.000 ₫ và bộ chăm sóc da trong tháng sinh nhật." },
  ],
  history: [
    { label: "Đơn hàng #BU26100412", date: "04/10/2026", points: 930 },
    { label: "Đơn hàng #BU26091877", date: "18/09/2026", points: 560 },
    { label: "Đổi phiếu quà tặng", date: "02/09/2026", points: -250 },
  ],
};

export const notifications = [
  {
    id: "n1",
    unread: true,
    date: "05/10/2026",
    title: "Đơn hàng #BU26100412 đang được giao",
    body: "Đơn hàng đã rời kho và đang trên đường đến bạn. Dự kiến giao trong 1–2 ngày.",
    cta: { label: "Xem đơn hàng", href: "/tai-khoan/lich-su-don-hang" },
  },
  {
    id: "n2",
    unread: false,
    date: "02/10/2026",
    title: "Bộ sưu tập mới — Sen Hạ ’26",
    body: "Mười hai thiết kế nhuộm tay bằng màu thực vật đã có mặt tại cửa hàng và website.",
    cta: { label: "Xem bộ sưu tập", href: "/bo-suu-tap/sen-ha-26" },
  },
  {
    id: "n3",
    unread: false,
    date: "20/09/2026",
    title: "Chào mừng bạn đến với BƯỚC",
    body: "Bạn đã trở thành thành viên. Tham khảo quyền lợi và cách tích điểm dành cho thành viên mới.",
    cta: { label: "Xem quyền lợi", href: "/tai-khoan/tich-diem" },
  },
];
