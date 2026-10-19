import Link from "@/components/ui/LocaleLink";
import { Img } from "@/components/ui/Img";
import type { Line } from "@/lib/types";

/** Tiêu đề mỗi dòng sản phẩm: tên dòng + overline bên trái, đoạn giới thiệu bên phải */
export function LineIntro({ line: l }: { line: Line }) {
  return (
    <div className="mx-auto grid max-w-site gap-4 px-4 sm:px-10 lg:grid-cols-12 lg:items-center lg:gap-8">
      <div className="lg:col-span-5">
        <p className="font-display text-[44px] leading-none font-medium tracking-[0.12em] text-black uppercase">{l.label}</p>
        <p className="eyebrow mt-3 text-ink-2">{l.overline}</p>
      </div>
      <p className="max-w-[687px] text-[15px] leading-[26px] text-ink-3 lg:col-span-7">{l.intro}</p>
    </div>
  );
}

type CardProps = {
  href: string;
  image: string;
  line: string;
  title: string;
  desc: string;
  className?: string;
  sizes?: string;
};

/** Thẻ bộ sưu tập: ảnh phủ kín, gradient đáy, tên dòng + tiêu đề + mô tả */
export function CollectionCard({ href, image, line, title, desc, className = "", sizes = "50vw" }: CardProps) {
  return (
    <Link href={href} className={`group relative block overflow-hidden bg-ink ${className}`}>
      <Img src={image} alt={title} sizes={sizes} className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
      <div className="absolute inset-x-0 bottom-0 h-[400px] max-h-full bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-x-6 bottom-6">
        <p className="eyebrow text-gold">{line}</p>
        <h3 className="mt-2 font-display text-[30px] leading-[1.05] font-medium tracking-[0.06em] text-white uppercase sm:text-[38px]">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 max-w-[512px] text-[13px] leading-[21px] text-[#e0e0e0]">{desc}</p>
      </div>
    </Link>
  );
}

/** Nền gradient nhẹ theo màu của từng dòng (giống design gốc) */
export function TintedSection({ tint, children }: { tint: string; children: React.ReactNode }) {
  return (
    <section
      className="relative py-16 lg:py-24"
      style={{ backgroundImage: `linear-gradient(245deg, ${tint} 34%, rgba(255,255,255,0.2) 59%)` }}
    >
      {children}
    </section>
  );
}
