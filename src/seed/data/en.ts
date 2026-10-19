/**
 * Bản tiếng Anh của dữ liệu mẫu (seed ghi vào locale "en" sau khi tạo bản tiếng Việt).
 * Tên riêng — tên sản phẩm, bộ sưu tập, dòng, cửa hàng — giữ nguyên như thương hiệu.
 */
import type { LineKey } from "./site";

/** Màu: mã nội bộ (tiếng Việt) → tên hiển thị tiếng Anh */
export const colorEn: Record<string, string> = {
  Đen: "Black",
  "Nâu cognac": "Cognac",
  Kem: "Cream",
  "Xanh rêu": "Olive",
  "Đỏ rượu": "Burgundy",
  Cát: "Sand",
  "Hoa sen": "Lotus pink",
  "Vàng nghệ": "Turmeric",
};

/** Câu mô tả dùng chung giữa nhiều sản phẩm (chi tiết chất liệu, cách chọn size) */
export const sharedEn: Record<string, string> = {
  "Da bò thuộc thực vật nhập từ Ý, lót da dê mềm, đế khâu Goodyear có thể thay mới. Hoàn thiện bằng sáp ong và xi đánh tay.":
    "Italian vegetable-tanned calfskin, soft goatskin lining and a replaceable Goodyear-welted sole. Finished with beeswax and hand-applied polish.",
  "Phom chuẩn, vừa với bàn chân bè trung bình. Nếu chân bạn bè ngang, nên chọn lớn hơn nửa size. Trọng lượng khoảng 980g/đôi (size 41).":
    "Standard last that suits average-width feet. If your feet are wide, go half a size up. Approx. 980 g per pair (size 41).",
  "Phom thon, mũi vừa. Gót cao 6cm, có đệm êm ở mũi chân. Nếu giữa hai size, nên chọn size lớn hơn.":
    "Slim last with a medium toe. 6 cm heel with a cushioned forefoot. If you're between sizes, choose the larger one.",
  "Phom rộng, quai có thể điều chỉnh. Trọng lượng khoảng 420g/đôi.": "Roomy last with adjustable straps. Approx. 420 g per pair.",
};

export const productsEn: Record<string, { subtitle: string; description: string; details?: string }> = {
  "oxford-hang-ngang": {
    subtitle: "Plain toe, slim last, Goodyear welt",
    description:
      "The workshop's first Oxford, named after Hanoi's oldest tailoring street. The upper is cut from a single hide with hidden stitching — right with a suit or everyday trousers.",
  },
  "derby-pho-cu": {
    subtitle: "Open-laced Derby in pebble-grain leather",
    description: "A relaxed Derby with a softly rounded toe, easy from the office to a weekend café. Pebble grain hides scuffs well.",
  },
  "loafer-penny-sai-gon": {
    subtitle: "Suede loafer with a classic penny strap",
    description: "Lightly water-resistant suede with a leather sole and rubber heel. Built for hot, humid weather: breathable lining, slip on and go.",
  },
  "loafer-horsebit-mono": {
    subtitle: "Gold-plated brass bit, soft suede",
    description: "A loafer with a bit hand-cast in our workshop and a hand-stitched moccasin toe.",
  },
  "brogue-gio-chuong": {
    subtitle: "Decorative broguing, wingtip toe",
    description: "Perforations inspired by the waves of the Mekong Delta in the monsoon season.",
  },
  "chelsea-mua-ngau": {
    subtitle: "Elastic-sided boot, non-slip rubber sole",
    description: "A Chelsea boot for the rainy season: water-repellent leather, deep-lug rubber sole and elastic gussets on both sides.",
  },
  "boot-do-thi": {
    subtitle: "Lace-up boot in oiled leather, lug sole",
    description: "A high boot in Horween-style oiled leather that only gets better with wear.",
  },
  "chukka-dat-do": {
    subtitle: "Ankle boot with two eyelets",
    description: "A light, neat chukka in the red-earth brown of the Central Highlands, on a comfortable crepe sole.",
  },
  "boot-buoc-dem": {
    subtitle: "Polished-leather combat boot, 4 cm sole",
    description: "A jet-black boot for long nights, with a side zip for quick changes.",
  },
  "derby-mono-last": {
    subtitle: "One hide, one seam",
    description: "Atelier's minimalist experiment: the whole upper is built from a single hide with just one seam at the heel.",
  },
  "giay-den-toi-gian": {
    subtitle: "Plain dress shoe, nothing superfluous",
    description: "The black shoe that goes with everything — a medium round toe in lightly polished box calf.",
  },
  "slip-on-than-chi": {
    subtitle: "Soft-soled slip-on that folds flat",
    description: "A sole soft enough to fold into your pocket, made for long flights and days at home.",
    details: "Nappa lambskin, 6 mm natural rubber sole, linen lining.",
  },
  "plimsoll-ruou-vang": {
    subtitle: "Canvas plimsoll, vulcanised rubber sole",
    description: "Heavy 14 oz canvas dyed wine red, on a vulcanised sole with stitched foxing.",
    details: "Organic cotton canvas, vulcanised rubber sole, memory-foam insole.",
  },
  "sandal-quai-cheo": {
    subtitle: "Calfskin sandal with hand-woven cross straps",
    description: "Hand-woven cross straps hug the instep; the leather footbed absorbs moisture.",
    details: "Vegetable-tanned calfskin, recycled rubber sole, entirely hand-stitched.",
  },
  "dep-quai-ngang": {
    subtitle: "Single-strap leather slide, cork footbed",
    description: "The cork footbed moulds to your foot after a few weeks of wear.",
    details: "Calfskin, natural cork footbed, rubber outsole.",
  },
  "pump-sen-ha": {
    subtitle: "Lotus-print heel, almond toe",
    description: "The signature design of the Sen Hạ ’26 collection, with a hand-screen-printed pattern on goatskin.",
    details: "Screen-printed goatskin, 6 cm leather-covered heel, genuine leather sole.",
  },
  "pump-ngoc-trai": {
    subtitle: "Embossed leather in ivory",
    description: "Ivory like a Phú Quốc pearl, with an embossed grain that catches the light.",
    details: "Embossed calfskin, 6 cm heel, cushioned forefoot.",
  },
  "peep-toe-hoang-hon": {
    subtitle: "Open toe, architectural block heel",
    description: "A sturdy 7 cm block heel in the sunset brown of the Saigon River.",
    details: "Matte calfskin, leather-covered wooden heel, non-slip rubber sole.",
  },
  "sandal-nang-ha": {
    subtitle: "Ankle strap, turmeric-yellow leather",
    description: "A vivid turmeric yellow for summer, with a brass-buckled ankle strap.",
    details: "Calfskin, 5 cm heel, leather sole.",
  },
  "half-shoe-hai-mau": {
    subtitle: "Black and brown, pointed toe",
    description: "A classic two-tone with a low 3 cm heel for long days on your feet.",
  },
  "stiletto-dem": {
    subtitle: "9 cm stiletto in black velvet leather",
    description: "B.Lab's evening design in deep black velvet leather with a matte metal heel.",
    details: "Velvet leather, 9 cm metal heel, leather sole.",
  },
  "sandal-quai-manh": {
    subtitle: "Slender ankle strap in nude",
    description: "A 6 mm strap that flatters the ankle, in a nude that suits every skin tone.",
    details: "Calfskin, 8 cm heel, leather sole.",
  },
  "bootie-da-bo": {
    subtitle: "Ankle bootie, block heel",
    description: "A 5 cm block-heel bootie with an inside zip, comfortable all day.",
  },
  "sandal-da-mo": {
    subtitle: "Flat sole, woven straps",
    description: "Undyed natural leather that turns honey-coloured over time.",
    details: "Natural calfskin, natural rubber sole.",
  },
  "giay-bet-trang": {
    subtitle: "Lambskin ballet flat",
    description: "Lambskin as soft as a glove, on a thin, flexible sole.",
    details: "Nappa lambskin, 5 mm rubber sole.",
  },
  "pump-anh-kim": {
    subtitle: "Pointed toe, white shimmer finish",
    description: "Metallic white shimmer for evening, with a slender pointed toe.",
    details: "Shimmer-coated fabric over leather, 8 cm heel.",
  },
};

export const linesEn: Record<LineKey, { overline: string; intro: string; tagline: string; slides: string[] }> = {
  atelier: {
    overline: "Handmade since 2014",
    intro: "Leather shoes made by hand on wooden lasts, with Goodyear-welted soles and vegetable-tanned leather — each pair takes 21 days to finish.",
    tagline: "Handcrafted on wooden lasts",
    slides: ["Sen Hạ ’26 — hand-dyed with plant colours", "21 days for one pair", "Mono Last — one hide, one seam"],
  },
  welt: {
    overline: "Goodyear welted craft",
    intro: "Two hundred stitches join upper and sole, so the shoe can be resoled, worn for ten years and look better with age.",
    tagline: "Welted soles, made to last ten years",
    slides: ["Oxford Hàng Ngang", "The Loafer Edit", "200 stitches between upper and sole"],
  },
  lab: {
    overline: "Avant-garde editorial",
    intro: "BƯỚC's laboratory of form: chunky soles, architectural cuts and experimental materials for the city at night.",
    tagline: "Sculpted shapes for the city at night",
    slides: ["Đêm Sài Gòn", "Mule Kiến Trúc", "Chelsea Mưa Ngâu"],
  },
  cham: {
    overline: "Slow living footwear",
    intro: "Slides, sandals and loafers for days with nowhere to rush — soft, light and breathable.",
    tagline: "Slow living",
    slides: ["Leather sandals for unhurried days", "Hand-woven straps, soft cork footbeds", "Slow down a little"],
  },
};

export const collectionsEn: Record<string, string> = {
  "sen-ha-26":
    "Twelve designs hand-dyed with plant colours, inspired by lotus ponds in June. Each pair is made by hand on a wooden last over 21 days, with a pattern hand-screen-printed onto goatskin.",
  "gio-chuong": "Perforated patterns that echo the waves of the Mekong Delta in the monsoon season, in cognac leather that deepens over the years.",
  "mono-last": "One hide, one seam — the workshop's most minimalist experiment.",
  "the-loafer-edit": "Suede loafers for a hot, humid climate — breathable lining, slip on and go.",
  "dem-sai-gon": "Black velvet leather, matte metal heels and chunky soles for long evenings.",
  "boot-do-thi": "Oiled-leather boots and water-repellent Chelseas for the city's rainy season.",
};

export const articlesEn: Record<string, { title: string; excerpt: string }> = {
  "de-khau-goodyear": { title: "The Goodyear welt: why it lasts ten years", excerpt: "A close look at the 200 stitches behind a handmade shoe's durability." },
  "ra-mat-sen-ha-26": { title: "Introducing the Sen Hạ ’26 collection", excerpt: "Twelve designs inspired by June's lotus ponds, hand-dyed with plant colours." },
  "cham-soc-da-lon-mua-mua": { title: "Caring for suede in the rainy season", excerpt: "Five simple steps to get your suede shoes through Saigon's afternoon downpours." },
  "mot-ngay-trong-xuong": { title: "A day in the Đồng Khởi workshop", excerpt: "From 7 a.m. until the lights go out: the rhythm of four shoemakers at work." },
  "pop-up-ha-noi": { title: "An autumn pop-up on Hàng Bông", excerpt: "Three weeks of fittings and free foot measuring in Hanoi's Old Quarter." },
  "chon-size-giay-tay": { title: "Choosing dress shoes for wide feet", excerpt: "How to measure your feet properly, and the lasts that suit Vietnamese feet." },
  "xuong-mo-thang-tam": { title: "August open workshop: make leather slides with our artisans", excerpt: "Three hours to cut, stitch and take home a pair of leather slides of your own." },
  "da-thuoc-thuc-vat": { title: "Vegetable-tanned leather: slow but strong", excerpt: "Why we choose a 40-day tanning process using tree bark." },
};

/** Thân bài đầy đủ của bài "Đế khâu Goodyear" (các bài khác dùng đoạn giữ chỗ) */
export type BodyBlock =
  | { type: "h2" | "p"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list" | "olist"; items: string[] }
  | { type: "table"; head: [string, string]; rows: [string, string][] }
  | { type: "images"; srcs: string[]; caption?: string };

export const goodyearBodyEn: BodyBlock[] = [
  { type: "h2", text: "1. Overview" },
  {
    type: "p",
    text: "A Goodyear welt joins the upper to the sole with a strip of leather called the welt. Instead of glue, the shoemaker sews two seams: one joining the upper to the welt, and one joining the welt to the outsole.",
  },
  { type: "p", text: "It takes three times longer than a cemented shoe, but it means the sole can be replaced again and again. A good pair can stay with its owner for more than ten years." },
  { type: "images", srcs: [], caption: "The welt is hand-stitched around a wooden last in our Đồng Khởi workshop." },
  { type: "h2", text: "2. The story behind it" },
  {
    type: "p",
    text: "In 2014, the BƯỚC workshop started with two shoemakers and a set of wooden lasts bought from an old shoe shop in Chợ Lớn. The first Oxford took almost a month to finish.",
  },
  { type: "quote", text: "The most beautiful shoe is the one that has been repaired the most.", cite: "Master shoemaker, Đồng Khởi workshop" },
  { type: "h2", text: "3. Materials and process" },
  {
    type: "list",
    items: [
      "Vegetable-tanned calfskin that develops a rich patina over time",
      "Beeswaxed linen thread, resistant to water and abrasion",
      "Leather soles from Spain, replaceable with rubber",
      "A cork insole that moulds to your foot",
    ],
  },
  { type: "p", text: "Every pair goes through four main stages:" },
  { type: "olist", items: ["Cutting the leather to pattern and skiving the edges", "Lasting the upper on a wooden last for 48 hours", "Stitching the welt and the sole", "Finishing, polishing and inspection"] },
  {
    type: "table",
    head: ["Stage", "Time"],
    rows: [
      ["Cutting and skiving", "2 hours"],
      ["Lasting", "48 hours"],
      ["Welt & sole stitching", "6–8 hours"],
      ["Finishing", "3 hours"],
    ],
  },
  { type: "h2", text: "4. How to spot a Goodyear-welted shoe" },
  {
    type: "p",
    text: "Turn the shoe over: a line of stitching running around the edge of the sole, about 3 mm in, is the sign of a stitched sole. Cemented shoes usually have a plain edge with no stitching.",
  },
  { type: "images", srcs: [], caption: "Welt models on display at our Đồng Khởi store." },
  { type: "h2", text: "5. Care for a longer life" },
  { type: "p", text: "Use cedar shoe trees after every wear, don't wear the same pair two days running, and polish once a month." },
  { type: "p", text: "When the sole wears down to the welt, bring your shoes to any BƯỚC store to be resoled. Members get their first resole free." },
  { type: "h2", text: "6. Find out more" },
  { type: "p", text: "Book a visit to our open workshop any Saturday to watch an artisan stitch a sole in person." },
];

export const placeholderBodyEn =
  "The full article is still being finished by our editors. In the meantime, visit your nearest store or book an open workshop to talk with our artisans in person.";

export const promotionsEn: Record<string, { title: string; desc: string }> = {
  "uu-dai-mua-mua": { title: "Rainy season offer", desc: "Up to 25% off boots and water-repellent leather shoes, with a free suede care kit." },
  "uu-dai-thanh-vien": { title: "Member offer", desc: "Double reward points and free insole engraving for BƯỚC members." },
  "doi-cu-lay-moi": { title: "Trade in, trade up", desc: "Bring any pair of old leather shoes to a store and get a 500,000 ₫ voucher towards a new pair." },
};

type PolicyBlockEn = { heading: string; paragraphs?: string[]; items?: string[] };
export const policiesEn: Record<string, { title: string; blocks: PolicyBlockEn[] }> = {
  "ho-tro": {
    title: "Online support",
    blocks: [
      {
        heading: "1. Support on our website",
        paragraphs: ["Customers can contact BƯỚC through the chat window on our website for help with:"],
        items: ["Product advice and choosing a size;", "Placing an order and paying;", "Checking order status;", "Size exchanges, returns and refunds;", "Booking resoling and shoe care;", "Feedback and complaints."],
      },
      {
        heading: "2. Support by email",
        paragraphs: ["Send your request to xinchao@buoc-atelier.vn, including your order number and what you need help with. We reply within 24 working hours."],
      },
      { heading: "3. Support by phone", paragraphs: ["Hotline: 0900 000 000 (8:00 — 21:00 every day, including weekends and public holidays)."] },
      {
        heading: "4. Support on social media",
        paragraphs: ["Please check for the verified badge on our official pages before messaging. BƯỚC never sells through personal accounts."],
      },
      {
        heading: "5. Response times",
        paragraphs: ["Size exchange requests are handled within 2 working days. Requests that need an order or delivery check may take 3–5 working days."],
      },
      { heading: "6. Information to provide", items: ["Full name;", "Phone number or email;", "Order number;", "Product name and size;", "Relevant photos or video, if any."] },
      { heading: "7. Staying safe", paragraphs: ["BƯỚC will never ask you for:"], items: ["Your online banking password;", "One-time codes (OTP);", "Your card PIN or security code;", "Your account password."] },
      {
        heading: "8. Effective date",
        paragraphs: ["This policy takes effect on 01/10/2026 and may be updated; new versions will be published on this page."],
      },
    ],
  },
  "phan-anh": {
    title: "Handling feedback and complaints",
    blocks: [
      {
        heading: "Process",
        items: ["We receive feedback by phone, email or in store;", "We verify the details within 2 working days;", "We propose a solution and reply to you;", "We resolve the matter within 7 working days at most."],
      },
    ],
  },
  gia: {
    title: "Pricing policy",
    blocks: [{ heading: "Listed prices", paragraphs: ["Prices on our website include VAT and are the same in every BƯỚC store, unless a specific offer applies."] }],
  },
  "giao-hang": {
    title: "Delivery, size exchanges and refunds",
    blocks: [
      { heading: "Delivery", paragraphs: ["Free nationwide delivery. Orders within Ho Chi Minh City and Hanoi arrive in 1–2 days; other provinces in 3–5 days."] },
      { heading: "Size exchanges", paragraphs: ["Free size exchanges within 30 days for shoes that haven't been worn outdoors, in their original box with all accessories."] },
    ],
  },
  "thanh-toan": {
    title: "Payment policy",
    blocks: [{ heading: "Payment methods", items: ["Cash on delivery (COD);", "Domestic ATM cards, Visa, Mastercard;", "E-wallets and QR bank transfer."] }],
  },
  "dieu-kien": {
    title: "Conditions and limitations of supply",
    blocks: [{ heading: "Made-to-order products", paragraphs: ["Shoes made to individual measurements or with engraving can't be returned or exchanged, except for manufacturing defects."] }],
  },
  "bao-mat": {
    title: "Personal data protection",
    blocks: [{ heading: "Scope", paragraphs: ["BƯỚC only collects the information needed to deliver your order and look after you, and never shares it with third parties for advertising."] }],
  },
};

export const storeRegionEn: Record<string, string> = { "Hồ Chí Minh": "Ho Chi Minh City", "Hà Nội": "Hanoi", "Đà Nẵng": "Da Nang", "Cần Thơ": "Can Tho" };
export const footerRegionEn: Record<string, string> = { "TP. Hồ Chí Minh": "Ho Chi Minh City", "Hà Nội": "Hanoi", "Miền Trung": "Central Vietnam", "Miền Tây": "Mekong Delta" };

export const milestonesEn: Record<string, { title: string; text: string }> = {
  "2014": { title: "A two-person workshop", text: "We started in an attic in Chợ Lớn with a set of second-hand wooden lasts." },
  "2018": { title: "Our first store", text: "A store and open workshop on Đồng Khởi Street." },
  "2024": { title: "Five stores", text: "Now in Saigon, Hanoi, Da Nang and Can Tho." },
};

export const navEn: Record<string, string> = {
  Nam: "Men",
  Nữ: "Women",
  Chậm: "Chậm",
  "Ưu đãi": "Offers",
  "Xưởng mở": "Open workshop",
  "Tạp chí": "Journal",
  "Về BƯỚC": "About BƯỚC",
  "Tra cứu đơn hàng": "Track an order",
  "Điều khoản & Chính sách": "Terms & policies",
};

export const siteEn = (brandName: string) => ({
  tagline: "Every step is a stitch — handmade shoes from Saigon.",
  copyright: "© 2026 BƯỚC ATELIER. ALL RIGHTS RESERVED.",
  priceNote: "Prices include VAT. Free nationwide delivery.",
  productStory: {
    eyebrow: `${brandName} Craftsmanship`,
    title: "200 stitches for one pair of shoes",
    text: `Every pair of ${brandName} shoes passes through the hands of four artisans: cutting, lasting, sole stitching and finishing. Nothing is rushed — because a crooked stitch stays with a shoe for ten years.`,
    ctaLabel: `More about ${brandName}`,
  },
  seoTitle: `${brandName} — Handmade shoes from Vietnam`,
  seoDescription: "Leather shoes made by hand on wooden lasts, with Goodyear-welted soles and vegetable-tanned leather. Stores in Ho Chi Minh City, Hanoi, Da Nang and Can Tho.",
});

export const homeEn = {
  hero: { overline: "Handmade leather shoes · Spring/Summer 2026", title: "Sen Hạ ’26", ctaLabel: "Explore the collection" },
  storeBanner: { eyebrow: "Our stores", text: "Visit the open workshop on Đồng Khởi — get measured, choose your leather, watch our artisans at work.", ctaLabel: "Book a workshop visit" },
  quote: { eyebrow: "From the BƯỚC workshop", text: "A good pair of shoes won't take you faster — it will take you further.", cite: "Master shoemaker, Đồng Khởi workshop" },
  closing: { title: "Slow down a little.", ctaLabel: "Discover the Chậm line" },
  journal: { title: "Journal", desc: "Shoemaking stories, leather care and memorable steps from the BƯỚC community." },
};

export const aboutEn = {
  title: "The BƯỚC story",
  subtitle: "The journey of a Vietnamese handmade shoe workshop",
  quote: "BƯỚC was born from the belief that a good pair of shoes doesn't need to shout — it just needs to walk with you for a long time.",
  originTitle: "Origins",
  originText:
    "In 2014, two shoemakers opened a small workshop in an attic in Chợ Lớn, with a set of wooden lasts bought from a shoe shop that had closed down. They made shoes to order for friends, then for friends of friends. Ten years later BƯỚC has five stores, but every pair is still made the old way: on a wooden last, by hand, over 21 days.",
  wideCaption: "Every BƯỚC store is designed like a workshop: customers try on shoes at the front, artisans work just behind the glass.",
  milestonesTitle: "Milestones that shaped BƯỚC",
  heritageEyebrow: "Living heritage",
  heritageTitle: "Showroom & workshop",
  heritageText: "From the fitting counter to the stitching bench at the back, every detail is open for you to see. We want you to know how your shoes are made, and by whom.",
  facts: [
    { label: "Material", value: "Vegetable-tanned leather" },
    { label: "Craft", value: "Made by hand on wooden lasts" },
    { label: "Finishing", value: "21 days per pair" },
  ],
};

export const workshopEn = {
  heroTitle: "Where your shoes are made, right before your eyes.",
  intro:
    "At the BƯỚC workshop we believe luxury lies in time: time for leather to rest on the last, for waxed thread to settle into every hole, for a shoemaker to check a detail a third time. The open workshop is our invitation to sit down beside the bench and watch it happen.",
  quoteA: "A crooked stitch stays with a shoe for ten years, so we don't rush.",
  quoteB: "Every pair passes through four pairs of hands: cutting, lasting, sole stitching and finishing. You can meet all four on Saturday mornings.",
  galleryAlt: [
    "A workbench with wooden lasts and tools",
    "Shoemaking tools",
    "Linen thread and leather shears",
    "An Oxford being finished",
    "The open workshop on Đồng Khởi",
    "The workbench at the end of the day",
  ],
  benchTitle: "The workbench",
  benchText: "When we design a shoe, we measure in millimetres and check by hand. The workbench on Đồng Khởi has seen more than four thousand pairs, and it's still where every new design begins.",
  bookingTitle: "Book an open workshop",
  bookingDesc: "Up to 8 people per session, guided by an artisan. You take home what you make.",
  bookingNote: "Free for members · 350,000 ₫ for guests, materials included.",
  sessions: [
    { title: "Hand-stitch a pair of leather slides", day: "Saturday" },
    { title: "Shoe polishing and care", day: "Saturday" },
    { title: "Foot measuring & choosing a last", day: "Sunday" },
  ],
};
