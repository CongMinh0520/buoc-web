import Link from "@/components/ui/LocaleLink";
import { getT } from "@/i18n/server";
import type { Product, SiteSettings } from "@/lib/types";
import { Img } from "@/components/ui/Img";
import { ProductCard } from "@/components/ui/ProductCard";
import { BuyBox } from "./BuyBox";

export async function ProductPageView({
  product,
  related,
  priceNote,
  story,
}: {
  product: Product;
  related: Product[];
  priceNote?: string;
  story?: SiteSettings["productStory"];
}) {
  const t = await getT();

  return (
    <>
      <section className="grid lg:grid-cols-[64%_36%]">
        {/* Ảnh: lưới 2x2 */}
        <div className="grid grid-cols-2 bg-stone">
          {product.images.slice(0, 4).map((src, i) => (
            <div key={i} className="relative aspect-[409/520] border-r border-b border-white">
              <Img src={src} alt={t.product.image(product.name, i + 1)} sizes="(min-width:1024px) 32vw, 50vw" priority={i < 2} />
            </div>
          ))}
        </div>

        {/* Thông tin & mua hàng */}
        <div className="bg-white">
          <div className="px-5 pt-8 pb-10 sm:px-[38px] lg:sticky lg:top-14">
            <nav aria-label={t.common.breadcrumb} className="text-[9px] tracking-[0.1em] text-[#6d6d6b] uppercase">
              <Link href="/" className="hover:text-black">
                {t.common.home}
              </Link>{" "}
              /{" "}
              <Link href={product.gender === "nu" ? "/danh-muc/nu" : "/danh-muc/nam"} className="hover:text-black">
                {product.gender === "nu" ? t.common.genders.nu : t.common.genders.nam}
              </Link>{" "}
              / {product.name}
            </nav>
            <h1 className="mt-7 font-display text-[34px] leading-[1.05] font-medium tracking-[0.03em] text-[#101010] uppercase">
              {product.name}
            </h1>
            <BuyBox product={product} priceNote={priceNote} />
          </div>
        </div>
      </section>

      {/* Khối giới thiệu thương hiệu — nội dung ở admin: Cài đặt chung → Thương hiệu */}
      {story?.title && (
        <section className="bg-sand px-6 py-16 text-center lg:py-[72px]">
          {story.eyebrow && <p className="text-[9px] tracking-[0.16em] text-[#777] uppercase">{story.eyebrow}</p>}
          <h2 className="mx-auto mt-5 max-w-[460px] font-display text-[36px] leading-[1.1] font-medium tracking-[0.025em] text-[#101010] uppercase">{story.title}</h2>
          {story.text && <p className="mx-auto mt-6 max-w-[460px] text-[13px] leading-[23px] whitespace-pre-line text-[#595955]">{story.text}</p>}
          {story.ctaLabel && story.ctaHref && (
            <Link href={story.ctaHref} className="mt-7 inline-block text-[10px] tracking-[0.13em] text-[#111] uppercase underline underline-offset-4">
              {story.ctaLabel}
            </Link>
          )}
        </section>
      )}

      {/* Có thể bạn cũng thích */}
      <section className="bg-white px-4 pt-16 pb-20 sm:px-6">
        <h2 className="text-center font-display text-[24px] font-medium tracking-[0.08em] sm:text-[30px] text-[#101010]">{t.product.related}</h2>
        <ul className="mx-auto mt-10 grid max-w-site grid-cols-2 gap-x-2.5 gap-y-8 lg:grid-cols-4">
          {related.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} variant="related" newLabel={t.common.newBadge} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
