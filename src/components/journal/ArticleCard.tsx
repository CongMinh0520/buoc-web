import Link from "next/link";
import { Img } from "@/components/ui/Img";
import type { Article } from "@/lib/types";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/tap-chi/${article.slug}`} className="group flex h-full flex-col bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone">
        <Img src={article.image} alt={article.title} sizes="(min-width:1024px) 25vw, 50vw" className="transition-transform duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="eyebrow text-black/45">
          {article.category} · {article.date}
        </p>
        <h3 className="mt-2 font-display text-[22px] leading-[1.15] font-medium text-black">{article.title}</h3>
        <p className="mt-3 text-[13px] leading-[21px] text-black/60">{article.excerpt}</p>
        <span className="eyebrow mt-auto pt-5 text-black underline underline-offset-4">Đọc tiếp</span>
      </div>
    </Link>
  );
}
