/**
 * Seed dữ liệu mẫu cho BƯỚC Atelier.
 * Chạy: npm run seed   (cần DATABASE_URI và PAYLOAD_SECRET)
 * Script xóa dữ liệu nội dung/bán hàng cũ rồi tạo lại — KHÔNG chạy trên production đang có đơn thật.
 */
import fs from "node:fs";
import { getPayload } from "payload";
import crypto from "node:crypto";
import config from "@payload-config";
import {
  lines as lineData,
  mainNav,
  footerInfo,
  brand,
  type LineKey,
} from "./data/site";
import { products as productData } from "./data/products";
import {
  articles,
  collections,
  milestones,
  policies,
  promotions,
  storeList,
} from "./data/content";
import { img } from "./data/images";
import { block, h, list, p, root } from "./lexical";
import {
  aboutEn,
  articlesEn,
  collectionsEn,
  colorEn,
  footerRegionEn,
  goodyearBodyEn,
  homeEn,
  linesEn,
  milestonesEn,
  navEn,
  placeholderBodyEn,
  policiesEn,
  productsEn,
  promotionsEn,
  sharedEn,
  siteEn,
  storeRegionEn,
  workshopEn,
  type BodyBlock,
} from "./data/en";

const payload = await getPayload({ config });
const ctx = { disableRevalidate: true };
const ext = (url: string) => ({ media: null, url });
/** Ghi bản tiếng Anh (locale "en") cho tài liệu vừa tạo bằng tiếng Việt */
const EN = { locale: "en" as const, context: ctx, overrideAccess: true };
/** Mảng có trường dịch: giữ id từng dòng để bản tiếng Anh gắn đúng vào dòng đã tạo (không tạo dòng mới) */
const withIds = <T extends { id?: string | null }, U>(rows: T[] | null | undefined, map: (row: T, i: number) => U) =>
  (rows ?? []).map((row, i) => ({ ...row, ...map(row, i), id: row.id }));

if (
  process.env.NODE_ENV === "production" &&
  process.env.ALLOW_PROD_SEED !== "yes"
) {
  throw new Error(
    "Từ chối seed trên production. Đặt ALLOW_PROD_SEED=yes nếu thật sự muốn.",
  );
}

// Production: chỉ seed nội dung CMS, không bao giờ xóa khách hàng / đơn hàng, không tạo khách mẫu
const isProd = process.env.NODE_ENV === "production";
const customerData = [
  "notifications",
  "loyalty-transactions",
  "orders",
  "bookings",
  "customers",
] as const;
const contentData = [
  "lookbooks",
  "products",
  "lines",
  "articles",
  "promotions",
  "policies",
  "stores",
] as const;
const wipe = isProd ? contentData : [...customerData, ...contentData];
// Gỡ tham chiếu từ Trang chủ trước, nếu không thì không xóa được các dòng sản phẩm cũ
await payload.updateGlobal({ slug: "home", data: { lineSections: [], closing: { line: null } }, context: ctx, overrideAccess: true }).catch(() => {});
for (const c of wipe) {
  await payload.delete({
    collection: c,
    where: { id: { exists: true } },
    context: ctx,
    overrideAccess: true,
  });
}
payload.logger.info("Đã xóa dữ liệu cũ");

// ——— Nhân viên quản trị ———
const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@buoc.local";
const adminPassword =
  process.env.SEED_ADMIN_PASSWORD ||
  crypto.randomBytes(9).toString("base64url");
const existing = await payload.find({
  collection: "users",
  where: { email: { equals: adminEmail } },
  limit: 1,
});
if (existing.docs.length === 0) {
  await payload.create({
    collection: "users",
    data: {
      email: adminEmail,
      password: adminPassword,
      name: "Quản trị",
      role: "admin",
    },
  });
  payload.logger.info(
    `Tài khoản admin: ${adminEmail} / ${adminPassword}  (đổi mật khẩu sau khi đăng nhập)`,
  );
}

// ——— Dòng sản phẩm ———
const lineHero: Record<LineKey, string> = {
  atelier: img.atelierSenHa,
  welt: img.weltOxford,
  lab: img.labBoot,
  cham: img.cham,
};
const lineTagline: Record<LineKey, string> = {
  atelier: "Thủ công từ phom gỗ",
  welt: "Đế khâu, đi mười năm",
  lab: "Hình khối cho thành phố đêm",
  cham: "Phong cách sống chậm",
};
const lineSlides: Record<LineKey, [string, string][]> = {
  atelier: [
    [img.atelierSenHa, "Sen Hạ ’26 — nhuộm tay bằng màu thực vật"],
    [img.craftTable, "21 ngày cho một đôi giày"],
    [img.atelierMonoLast, "Mono Last — một tấm da, một đường may"],
  ],
  welt: [
    [img.weltOxford, "Oxford Hàng Ngang"],
    [img.weltLoafer, "The Loafer Edit"],
    [img.craftQuote, "200 mũi khâu nối thân và đế"],
  ],
  lab: [
    [img.labDem, "Đêm Sài Gòn"],
    [img.labMule, "Mule Kiến Trúc"],
    [img.labChelsea, "Chelsea Mưa Ngâu"],
  ],
  cham: [
    [img.cham, "Sandal da cho những ngày không vội"],
    [img.sandalsAssorted, "Quai đan tay, đế bần mềm"],
    [img.feetDangling, "Đi chậm lại một chút"],
  ],
};
const lineIds = {} as Record<LineKey, number>;
let order = 0;
for (const key of Object.keys(lineData) as LineKey[]) {
  const l = lineData[key];
  const doc = await payload.create({
    collection: "lines",
    context: ctx,
    data: {
      key,
      label: l.label,
      overline: l.overline,
      intro: l.intro,
      tint: l.tint,
      tagline: lineTagline[key],
      order: order++,
      hero: ext(lineHero[key]),
      slides: lineSlides[key].map(([url, caption]) => ({
        image: ext(url),
        caption,
      })),
    },
  });
  lineIds[key] = doc.id as number;
  const en = linesEn[key];
  await payload.update({
    collection: "lines",
    id: doc.id,
    ...EN,
    data: {
      label: l.label,
      overline: en.overline,
      intro: en.intro,
      tagline: en.tagline,
      slides: withIds(doc.slides, (_, i) => ({ caption: en.slides[i] })),
    },
  });
}

// ——— Sản phẩm ———
const productIds: Record<string, number> = {};
for (const [i, pr] of productData.entries()) {
  const variants = pr.colors.flatMap((c, ci) =>
    pr.sizes.map((size, si) => ({
      color: c.name,
      size,
      stock: (i * 7 + ci * 5 + si * 3) % 9, // có vài size hết hàng để thử giao diện
      sku: `${pr.slug.slice(0, 10).toUpperCase()}-${ci}${size}`,
    })),
  );
  const doc = await payload.create({
    collection: "products",
    context: ctx,
    data: {
      name: pr.name,
      slug: pr.slug,
      subtitle: pr.subtitle,
      line: lineIds[pr.line],
      gender: pr.gender,
      price: pr.price,
      isNew: Boolean(pr.isNew),
      colors: pr.colors,
      variants,
      images: pr.images.map((u) => ({ image: ext(u) })),
      description: pr.description,
      details: pr.details,
      sizing: pr.sizing,
      _status: "published",
      meta: {
        title: pr.name,
        description: `${pr.subtitle}. ${pr.description}`.slice(0, 160),
      },
    },
  });
  productIds[pr.slug] = doc.id as number;
  const en = productsEn[pr.slug];
  if (en) {
    await payload.update({
      collection: "products",
      id: doc.id,
      ...EN,
      data: {
        name: pr.name,
        subtitle: en.subtitle,
        description: en.description,
        details: en.details ?? sharedEn[pr.details] ?? pr.details,
        sizing: sharedEn[pr.sizing] ?? pr.sizing,
        colors: withIds(doc.colors, (c) => ({ label: colorEn[c.name] ?? c.name })),
        _status: "published",
        meta: { title: pr.name, description: `${en.subtitle}. ${en.description}`.slice(0, 160) },
      },
    });
  }
}

// ——— Bộ sưu tập ———
const lookbookIds: Record<string, number> = {};
for (const c of collections) {
  const doc = await payload.create({
    collection: "lookbooks",
    context: ctx,
    data: {
      title: c.title,
      slug: c.slug,
      line: lineIds[c.line],
      desc: c.desc,
      image: ext(c.image),
      products: c.products.map((s) => productIds[s]).filter(Boolean),
      _status: "published",
      meta: {
        title: `Bộ sưu tập ${c.title}`,
        description: c.desc.slice(0, 160),
      },
    },
  });
  lookbookIds[c.slug] = doc.id as number;
  const enDesc = collectionsEn[c.slug] ?? c.desc;
  await payload.update({
    collection: "lookbooks",
    id: doc.id,
    ...EN,
    data: { title: c.title, desc: enDesc, _status: "published", meta: { title: `${c.title} collection`, description: enDesc.slice(0, 160) } },
  });
}

// ——— Tạp chí ———
const toDate = (d: string) => {
  const [dd, mm, yyyy] = d.split("/");
  return new Date(`${yyyy}-${mm}-${dd}T08:00:00+07:00`).toISOString();
};
const bodyChildren = (body: readonly BodyBlock[]) =>
  body.map((b) => {
        switch (b.type) {
          case "h2":
            return h(b.text);
          case "p":
            return p(b.text);
          case "quote":
            return block("pullQuote", { text: b.text, cite: b.cite });
          case "list":
            return list(b.items);
          case "olist":
            return list(b.items, true);
          case "table":
            return block("simpleTable", {
              headA: b.head[0],
              headB: b.head[1],
              rows: b.rows.map(([x, y]) => ({ a: x, b: y })),
            });
          case "images":
            return block("gallery", {
              images: b.srcs.map((u) => ({ image: ext(u) })),
              caption: b.caption ?? "",
            });
        }
      });
for (const a of articles) {
  const children = a.body
    ? bodyChildren(a.body as BodyBlock[])
    : [
        p(a.excerpt),
        p(
          "Nội dung chi tiết của bài viết đang được đội ngũ biên tập hoàn thiện. Trong lúc chờ, bạn có thể ghé cửa hàng gần nhất hoặc đặt lịch xưởng mở để trò chuyện trực tiếp với nghệ nhân.",
        ),
      ];
  const created = await payload.create({
    collection: "articles",
    context: ctx,
    data: {
      title: a.title,
      slug: a.slug,
      category: a.category,
      publishedAt: toDate(a.date),
      excerpt: a.excerpt,
      cover: ext(a.image),
      content: root(children) as never,
      _status: "published",
      meta: { title: `${a.title} | Tạp chí BƯỚC`, description: a.excerpt },
    },
  });
  const en = articlesEn[a.slug];
  if (en) {
    // Ảnh trong bản tiếng Anh lấy lại đúng các ảnh của bản tiếng Việt (theo thứ tự)
    const viImages = (a.body ?? []).filter((b) => b.type === "images").map((b) => (b as { srcs: string[] }).srcs);
    let imgIdx = 0;
    const enBody =
      a.slug === "de-khau-goodyear"
        ? goodyearBodyEn.map((b) => (b.type === "images" ? { ...b, srcs: viImages[imgIdx++] ?? [] } : b))
        : null;
    await payload.update({
      collection: "articles",
      id: created.id,
      ...EN,
      data: {
        title: en.title,
        excerpt: en.excerpt,
        content: root(enBody ? bodyChildren(enBody) : [p(en.excerpt), p(placeholderBodyEn)]) as never,
        _status: "published",
        meta: { title: `${en.title} | BƯỚC Journal`, description: en.excerpt },
      },
    });
  }
}

// ——— Ưu đãi ———
const promoDates: Record<string, [string, string]> = {
  "uu-dai-mua-mua": ["2026-10-01", "2026-10-31"],
  "uu-dai-thanh-vien": ["2026-09-01", "2026-11-30"],
  "doi-cu-lay-moi": ["2026-10-15", "2026-12-15"],
};
for (const pr of promotions) {
  const [s, e] = promoDates[pr.slug];
  const promo = await payload.create({
    collection: "promotions",
    context: ctx,
    data: {
      title: pr.title,
      slug: pr.slug,
      startDate: s,
      endDate: e,
      desc: pr.desc,
      image: ext(pr.image),
      href: pr.href,
      _status: "published",
    },
  });
  const en = promotionsEn[pr.slug];
  if (en) await payload.update({ collection: "promotions", id: promo.id, ...EN, data: { ...en, _status: "published" } });
}

// ——— Chính sách ———
const policyChildren = (blocks: { heading: string; paragraphs?: string[]; items?: string[] }[]) =>
  blocks.flatMap((b) => [h(b.heading, "h3"), ...(b.paragraphs ?? []).map((t) => p(t)), ...(b.items ? [list(b.items)] : [])]);
for (const [i, pol] of policies.entries()) {
  const children = policyChildren(pol.blocks);
  const doc = await payload.create({
    collection: "policies",
    context: ctx,
    data: {
      title: pol.title,
      slug: pol.id,
      order: i,
      version: pol.version,
      effectiveDate: pol.effective ? toDate(pol.effective) : undefined,
      content: root(children) as never,
      _status: "published",
    },
  });
  const en = policiesEn[pol.id];
  if (en) await payload.update({ collection: "policies", id: doc.id, ...EN, data: { title: en.title, content: root(policyChildren(en.blocks)) as never, _status: "published" } });
}

// ——— Cửa hàng ———
const footerRegion: Record<string, string> = {
  "Hồ Chí Minh": "TP. Hồ Chí Minh",
  "Hà Nội": "Hà Nội",
  "Đà Nẵng": "Miền Trung",
  "Cần Thơ": "Miền Tây",
};
for (const [i, s] of storeList.entries()) {
  const store = await payload.create({
    collection: "stores",
    context: ctx,
    data: {
      name: s.name,
      region: s.region,
      footerRegion: footerRegion[s.region] ?? s.region,
      order: i,
      address: s.address,
      phone: s.phone,
      hours: s.hours,
      image: ext(s.image),
    },
  });
  const region = footerRegion[s.region] ?? s.region;
  await payload.update({
    collection: "stores",
    id: store.id,
    ...EN,
    data: { region: storeRegionEn[s.region] ?? s.region, footerRegion: footerRegionEn[region] ?? region, hours: s.hours },
  });
}

// ——— Globals ———
const site = await payload.updateGlobal({
  slug: "site-settings",
  context: ctx,
  data: {
    brandName: brand.name,
    wordmark: brand.wordmark,
    orderPrefix: "BU",
    priceNote: "Giá đã bao gồm VAT. Miễn phí giao hàng toàn quốc.",
    productStory: {
      eyebrow: `${brand.name} Craftsmanship`,
      title: "200 mũi khâu cho một đôi giày",
      text: `Mỗi đôi giày ${brand.name} đi qua tay bốn nghệ nhân: cắt da, dựng phom, khâu đế và hoàn thiện. Không có công đoạn nào được làm vội — vì một đường khâu lệch sẽ theo đôi giày suốt mười năm.`,
      ctaLabel: `Xem thêm về ${brand.name}`,
      ctaHref: "/gioi-thieu",
    },
    // Thông tin doanh nghiệp (Pháp lý) cố ý để trống: phải nhập thông tin thật trên admin trước khi mở bán
    tagline: brand.tagline,
    hotline: brand.hotline,
    email: brand.email,
    copyright: brand.copyright,
    socials: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "YouTube", href: "https://youtube.com" },
    ],
    mainNav,
    footerInfo,
    seoTitle: `${brand.name} — Giày thủ công Việt Nam`,
    seoDescription:
      "Giày da đóng tay trên phom gỗ, đế khâu Goodyear và da thuộc thực vật. Cửa hàng tại TP. Hồ Chí Minh, Hà Nội, Đà Nẵng và Cần Thơ.",
    ogImage: ext(img.hero),
  },
});
{
  const en = siteEn(brand.name);
  await payload.updateGlobal({
    slug: "site-settings",
    ...EN,
    data: {
      brandName: brand.name,
      wordmark: brand.wordmark,
      tagline: en.tagline,
      copyright: en.copyright,
      priceNote: en.priceNote,
      productStory: { ...en.productStory, ctaHref: "/gioi-thieu" },
      mainNav: withIds(site.mainNav, (n) => ({ label: navEn[n.label] ?? n.label })),
      footerInfo: withIds(site.footerInfo, (n) => ({ label: navEn[n.label] ?? n.label })),
      seoTitle: en.seoTitle,
      seoDescription: en.seoDescription,
    },
  });
}

await payload.updateGlobal({
  slug: "home",
  context: ctx,
  data: {
    hero: {
      overline: "Giày da thủ công · Xuân Hè 2026",
      title: "Sen Hạ ’26",
      ctaLabel: "Khám phá bộ sưu tập",
      ctaHref: "/bo-suu-tap/sen-ha-26",
      image: ext(img.hero),
    },
    lineSections: [
      {
        line: lineIds.atelier,
        lookbooks: [
          lookbookIds["sen-ha-26"],
          lookbookIds["gio-chuong"],
          lookbookIds["mono-last"],
        ],
      },
      {
        line: lineIds.welt,
        lookbooks: [
          lookbookIds["the-loafer-edit"],
          lookbookIds["gio-chuong"],
          lookbookIds["boot-do-thi"],
        ],
      },
      {
        line: lineIds.lab,
        lookbooks: [
          lookbookIds["dem-sai-gon"],
          lookbookIds["boot-do-thi"],
          lookbookIds["mono-last"],
          lookbookIds["sen-ha-26"],
          lookbookIds["the-loafer-edit"],
        ],
      },
    ],
    storeBanner: {
      eyebrow: "Cửa hàng",
      text: "Ghé xưởng mở ở Đồng Khởi — đo chân, chọn da, xem nghệ nhân làm việc.",
      ctaLabel: "Đặt lịch ghé xưởng",
      ctaHref: "/xuong-mo#dat-lich",
      image: ext(img.storeAtmosphere),
    },
    quote: {
      eyebrow: "Từ xưởng BƯỚC",
      text: "Một đôi giày tốt không đưa bạn đi nhanh hơn — nó đưa bạn đi xa hơn.",
      cite: "Thợ cả, xưởng Đồng Khởi",
      image: ext(img.craftQuote),
    },
    closing: {
      line: lineIds.cham,
      title: "Đi chậm lại một chút.",
      ctaLabel: "Xem dòng Chậm",
      image: ext(img.cham),
    },
    journal: {
      title: "Tạp chí",
      desc: "Chuyện nghề đóng giày, cách chăm sóc đồ da và những bước chân đáng nhớ từ cộng đồng BƯỚC.",
    },
  },
});
await payload.updateGlobal({
  slug: "home",
  ...EN,
  data: {
    hero: { ...homeEn.hero, ctaHref: "/bo-suu-tap/sen-ha-26", image: ext(img.hero) },
    storeBanner: { ...homeEn.storeBanner, ctaHref: "/xuong-mo#dat-lich", image: ext(img.storeAtmosphere) },
    quote: { ...homeEn.quote, image: ext(img.craftQuote) },
    closing: { ...homeEn.closing, line: lineIds.cham, image: ext(img.cham) },
    journal: homeEn.journal,
  },
});

const about = await payload.updateGlobal({
  slug: "about",
  context: ctx,
  data: {
    title: "Câu chuyện BƯỚC",
    subtitle: "Hành trình của một xưởng giày thủ công Việt Nam",
    heroImage: ext(img.storeCollection),
    quote:
      "BƯỚC ra đời từ niềm tin rằng một đôi giày tốt không cần ồn ào — nó chỉ cần đi cùng bạn thật lâu.",
    originTitle: "Nguồn gốc",
    originText:
      "Năm 2014, hai người thợ mở một xưởng nhỏ trên căn gác ở Chợ Lớn với bộ phom gỗ mua lại từ một tiệm giày đã đóng cửa. Họ nhận đóng giày theo đơn cho bạn bè, rồi cho bạn của bạn bè. Mười năm sau, BƯỚC có năm cửa hàng, nhưng mỗi đôi giày vẫn được làm theo cách cũ: trên phom gỗ, bằng tay, trong 21 ngày.",
    wideImage: ext(img.storeWall),
    wideCaption:
      "Mỗi cửa hàng BƯỚC được thiết kế như một phòng thợ: khách thử giày ở phía trước, nghệ nhân làm việc ngay phía sau lớp kính.",
    milestonesTitle: "Những cột mốc định hình BƯỚC",
    milestones: milestones.map((m) => ({
      year: m.year,
      title: m.title,
      text: m.text,
      image: ext(m.image),
    })),
    heritageEyebrow: "Di sản sống",
    heritageTitle: "Không gian trưng bày & xưởng sản xuất",
    heritageImage: ext(img.craftToolsB),
    heritageText:
      "Từ quầy thử giày đến bàn khâu đế phía sau, mọi chi tiết đều mở cho khách nhìn thấy. Chúng tôi muốn bạn biết đôi giày của mình được làm ra như thế nào, bởi ai.",
    facts: [
      { label: "Chất liệu", value: "Da thuộc thực vật" },
      { label: "Chế tác", value: "Đóng tay trên phom gỗ" },
      { label: "Hoàn thiện", value: "21 ngày mỗi đôi" },
    ],
  },
});
await payload.updateGlobal({
  slug: "about",
  ...EN,
  data: {
    ...aboutEn,
    milestones: withIds(about.milestones, (m) => milestonesEn[m.year] ?? { title: m.title, text: m.text ?? "" }),
    facts: withIds(about.facts, (_, i) => aboutEn.facts[i] ?? {}),
  },
});

const workshop = await payload.updateGlobal({
  slug: "workshop",
  context: ctx,
  data: {
    heroTitle: "Nơi đôi giày được làm ra, ngay trước mắt bạn.",
    heroImage: ext(img.craftQuote),
    intro:
      "Tại xưởng BƯỚC, chúng tôi tin rằng sự sang trọng nằm ở thời gian: thời gian để da nghỉ trên phom, để chỉ sáp ngấm vào từng lỗ kim, để người thợ kiểm tra lại một chi tiết lần thứ ba. Xưởng mở là cách chúng tôi mời bạn ngồi xuống cạnh bàn thợ và xem quá trình đó.",
    quoteA:
      "Một đường khâu lệch sẽ theo đôi giày suốt mười năm, nên chúng tôi không vội.",
    quoteB:
      "Mỗi đôi giày đi qua tay bốn người: cắt da, dựng phom, khâu đế và hoàn thiện. Bạn có thể gặp cả bốn người vào sáng thứ Bảy.",
    gallery: [
      { image: ext(img.craftTable), alt: "Bàn thợ với phom gỗ và dụng cụ" },
      { image: ext(img.craftTools), alt: "Dụng cụ đóng giày" },
      { image: ext(img.craftThread), alt: "Chỉ lanh và kéo cắt da" },
      { image: ext(img.p.oxfordD), alt: "Đôi Oxford đang hoàn thiện" },
      { image: ext(img.storeWall), alt: "Không gian xưởng mở tại Đồng Khởi" },
      { image: ext(img.craftToolsB), alt: "Bàn thợ sau một ngày làm việc" },
    ],
    benchTitle: "Bàn thợ",
    benchText:
      "Khi thiết kế một đôi giày, chúng tôi tính bằng milimét và kiểm tra bằng tay. Chiếc bàn thợ ở Đồng Khởi đã qua hơn bốn nghìn đôi giày, và vẫn là nơi mọi mẫu mới bắt đầu.",
    bookingTitle: "Đặt lịch xưởng mở",
    bookingDesc:
      "Mỗi buổi tối đa 8 người, có nghệ nhân hướng dẫn. Bạn mang về thành phẩm của mình.",
    bookingNote:
      "Miễn phí cho thành viên · 350.000 ₫ cho khách vãng lai, đã gồm vật liệu.",
    sessions: [
      {
        title: "Khâu tay một đôi dép da",
        day: "Thứ Bảy",
        time: "9:00 — 12:00",
        seats: 4,
      },
      {
        title: "Đánh xi và chăm sóc giày",
        day: "Thứ Bảy",
        time: "14:00 — 17:00",
        seats: 6,
      },
      {
        title: "Đo chân & chọn phom",
        day: "Chủ Nhật",
        time: "9:30 — 12:30",
        seats: 3,
      },
    ],
  },
});
{
  const { galleryAlt, sessions, ...rest } = workshopEn;
  await payload.updateGlobal({
    slug: "workshop",
    ...EN,
    data: {
      ...rest,
      gallery: withIds(workshop.gallery, (_, i) => ({ alt: galleryAlt[i] ?? "" })),
      sessions: withIds(workshop.sessions, (_, i) => sessions[i] ?? {}),
    },
  });
}

if (!isProd) {
  // ——— Khách hàng mẫu + đơn hàng ———
  const demoPassword = process.env.SEED_DEMO_PASSWORD || "Buoc@2026demo";
  const demo = await payload.create({
    collection: "customers",
    overrideAccess: true,
    context: ctx,
    data: {
      email: "minhanh@example.com",
      password: demoPassword,
      name: "Trần Minh Anh",
      phone: "0912345678",
      gender: "Nữ",
      shoeSize: "38",
      emailVerified: true,
      points: 1240,
      addresses: [
        {
          label: "Nhà riêng",
          isDefault: true,
          name: "Trần Minh Anh",
          phone: "0912345678",
          line: "48 Phạm Ngọc Thạch",
          ward: "Phường Xuân Hòa",
          province: "TP. Hồ Chí Minh",
        },
        {
          label: "Văn phòng",
          isDefault: false,
          name: "Trần Minh Anh",
          phone: "0987654321",
          line: "12 Tôn Đức Thắng",
          ward: "Phường Sài Gòn",
          province: "TP. Hồ Chí Minh",
        },
      ],
    },
  });
  payload.logger.info(`Khách hàng mẫu: minhanh@example.com / ${demoPassword}`);

  const item = (slug: string, color: string, size: string) => {
    const pr = productData.find((x) => x.slug === slug)!;
    return {
      product: productIds[slug],
      name: pr.name,
      slug,
      image: pr.images[0],
      color,
      size,
      price: pr.price,
      qty: 1,
    };
  };
  const addr = {
    name: "Trần Minh Anh",
    phone: "0912345678",
    line: "48 Phạm Ngọc Thạch",
    ward: "Phường Xuân Hòa",
    province: "TP. Hồ Chí Minh",
  };
  const demoOrders = [
    {
      code: "BU26100412",
      status: "shipping",
      paymentMethod: "vnpay",
      paymentStatus: "paid",
      items: [
        item("oxford-hang-ngang", "Nâu cognac", "41"),
        item("sandal-quai-cheo", "Đen", "41"),
      ],
      createdAt: "2026-10-04T09:12:00+07:00",
    },
    {
      code: "BU26091877",
      status: "delivered",
      paymentMethod: "cod",
      paymentStatus: "paid",
      items: [item("pump-sen-ha", "Hoa sen", "37")],
      createdAt: "2026-09-18T15:40:00+07:00",
    },
    {
      code: "BU26080320",
      status: "cancelled",
      paymentMethod: "momo",
      paymentStatus: "failed",
      items: [item("chelsea-mua-ngau", "Đen", "42")],
      createdAt: "2026-08-03T11:05:00+07:00",
    },
  ] as const;
  for (const o of demoOrders) {
    const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0);
    await payload.create({
      collection: "orders",
      overrideAccess: true,
      context: { ...ctx, skipStatusHook: true },
      data: {
        code: o.code,
        customer: demo.id,
        email: demo.email,
        status: o.status,
        shipping: addr,
        items: o.items.map((i) => ({ ...i })),
        subtotal,
        shippingFee: 0,
        total: subtotal,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        restocked: o.status === "cancelled",
        pointsAwarded: o.status === "delivered",
        createdAt: o.createdAt,
      },
    });
  }
  for (const t of [
    { label: "Đơn hàng #BU26091877", points: 560 },
    { label: "Quà chào mừng thành viên", points: 930 },
    { label: "Đổi phiếu quà tặng", points: -250 },
  ]) {
    await payload.create({
      collection: "loyalty-transactions",
      overrideAccess: true,
      context: ctx,
      data: { customer: demo.id, ...t },
    });
  }
  for (const n of [
    {
      title: "Chào mừng bạn đến với BƯỚC",
      body: "Bạn đã trở thành thành viên. Tham khảo quyền lợi và cách tích điểm.",
      ctaLabel: "Xem quyền lợi",
      ctaHref: "/tai-khoan/tich-diem",
      readAt: new Date().toISOString(),
    },
    {
      title: "Bộ sưu tập mới — Sen Hạ ’26",
      body: "Mười hai thiết kế nhuộm tay bằng màu thực vật đã có mặt.",
      ctaLabel: "Xem bộ sưu tập",
      ctaHref: "/bo-suu-tap/sen-ha-26",
      readAt: new Date().toISOString(),
    },
    {
      title: "Đơn hàng #BU26100412 đang được giao",
      body: "Đơn hàng đã rời kho và đang trên đường đến bạn. Dự kiến giao trong 1–2 ngày.",
      ctaLabel: "Xem đơn hàng",
      ctaHref: "/tai-khoan/lich-su-don-hang",
    },
  ]) {
    await payload.create({
      collection: "notifications",
      overrideAccess: true,
      context: ctx,
      data: { customer: demo.id, ...n },
    });
  }
}

// Ghi đồng bộ để dòng này chắc chắn ra stdout trước khi thoát (scripts/payload-cli.mjs dựa vào nó)
const { totalDocs: productCount } = await payload.count({ collection: "products", overrideAccess: true });
if (!productCount) throw new Error("Seed chạy xong nhưng không có sản phẩm nào trong DB");
fs.writeSync(1, `Seed xong ✓ (${productCount} sản phẩm)\n`);
process.exit(0);
