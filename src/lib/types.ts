// Kiểu dữ liệu phía giao diện — đã được "làm phẳng" từ tài liệu Payload (xem src/lib/cms.ts)
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export type LineRef = { key: string; label: string };

export type Line = LineRef & {
  overline: string;
  intro: string;
  tagline: string;
  tint: string;
  hero: string | null;
  slides: { src: string; caption: string }[];
};

export type Gender = "nam" | "nu" | "unisex";

export type Product = {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  line: LineRef;
  gender: Gender;
  price: number;
  isNew: boolean;
  colors: { name: string; hex: string }[];
  sizes: string[];
  /** Tồn kho theo "màu|size" */
  stock: Record<string, number>;
  images: string[];
  description: string;
  details: string;
  sizing: string;
  updatedAt: string;
};

export type Lookbook = {
  slug: string;
  title: string;
  line: LineRef;
  desc: string;
  image: string | null;
  productSlugs: string[];
  updatedAt: string;
};

export type ArticleCategory = "Bộ sưu tập" | "Xưởng" | "Chăm sóc" | "Sự kiện";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  date: string; // dd/MM/yyyy
  dateISO: string;
  updatedAt: string;
  image: string | null;
  content: SerializedEditorState | null;
};

export type Promotion = { slug: string; title: string; period: string; desc: string; image: string | null; href: string };

export type Policy = { slug: string; title: string; version?: string | null; effective?: string | null; updatedAt: string; content: SerializedEditorState };

export type Store = {
  name: string;
  region: string;
  footerRegion: string;
  address: string;
  phone: string;
  hours: string;
  image: string | null;
};

export type NavLink = { label: string; href: string };

export type SiteSettings = {
  brandName: string;
  wordmark: string;
  tagline: string;
  hotline: string;
  email: string;
  copyright: string;
  socials: NavLink[];
  mainNav: NavLink[];
  footerInfo: NavLink[];
  seoTitle: string;
  seoDescription: string;
  ogImage: string | null;
  favicon: string | null;
  company: CompanyInfo;
  priceNote: string;
  orderPrefix: string;
  productStory: { eyebrow: string; title: string; text: string; ctaLabel: string; ctaHref: string };
};

/** Thông tin chủ quản website (công khai theo Nghị định 248/2026/NĐ-CP) */
export type CompanyInfo = {
  name: string;
  address: string;
  representative: string;
  taxCode: string;
  registrationNo: string;
  registrationIssued: string;
  complaintPhone: string;
  complaintEmail: string;
};

export type SearchItem = Pick<Product, "slug" | "name" | "subtitle" | "price" | "isNew"> & {
  image: string | null;
  lineLabel: string;
  colors: string[];
};

/** Thông tin khách đang đăng nhập gửi xuống trình duyệt (không chứa dữ liệu nhạy cảm) */
export type PublicCustomer = { id: number; name: string; email: string; unread?: number };
