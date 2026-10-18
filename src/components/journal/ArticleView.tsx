import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { RichContent } from "@/components/rich/RichContent";
import type { Article } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";

export function ArticleView({ article, related }: { article: Article; related: Article[] }) {
  return (
    <>
      <section className="relative h-[480px] overflow-hidden bg-ink-2 lg:h-[540px]">
        <Img src={article.image} alt={article.title} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[794px] px-4 pb-12 text-white sm:px-10">
          <p className="eyebrow">
            <Link href="/tap-chi" className="hover:underline">
              Tạp chí
            </Link>{" "}
            · {article.category} · <time dateTime={article.dateISO}>{article.date}</time>
          </p>
          <h1 className="mt-3 font-display text-[38px] leading-[1.05] font-medium text-balance sm:text-[54px]">{article.title}</h1>
        </div>
      </section>

      <article className="mx-auto max-w-[896px] px-4 pt-8 pb-16 sm:px-10">
        <RichContent data={article.content} />
        <div className="mt-12 flex flex-wrap gap-3 border-t border-black/15 pt-8">
          <Link href="/danh-muc/tat-ca" className="btn-dark">
            Khám phá bộ sưu tập
          </Link>
          <Link href="/xuong-mo#dat-lich" className="btn-outline">
            Đặt lịch xưởng mở
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-paper py-16">
          <div className="mx-auto max-w-site px-4 sm:px-10">
            <h2 className="font-display text-[32px] font-medium">Bài viết khác</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {related.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
