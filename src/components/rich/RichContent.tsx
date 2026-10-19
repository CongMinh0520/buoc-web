import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { Img } from "@/components/ui/Img";
import { imageUrl } from "@/lib/cms";

type ImageGroup = Parameters<typeof imageUrl>[0];
type GalleryFields = { images?: { image: ImageGroup }[]; caption?: string };
type TableFields = { headA: string; headB: string; rows?: { a: string; b: string }[] };
type QuoteFields = { text: string; cite?: string };

/** Hiển thị nội dung rich text từ Payload, kèm các khối tùy biến (ảnh, bảng, trích dẫn) */
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    gallery: ({ node }: { node: SerializedBlockNode }) => {
      const f = node.fields as unknown as GalleryFields;
      const srcs = (f.images ?? []).map((i) => imageUrl(i.image, "hero"));
      return (
        <figure className="not-prose pt-8">
          <div className={`grid gap-3 ${srcs.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {srcs.map((s, i) => (
              <div key={i} className={`relative bg-stone ${srcs.length > 1 ? "aspect-[3/4]" : "aspect-[16/9]"}`}>
                <Img src={s} alt={f.caption || ""} sizes="(min-width:1024px) 900px, 100vw" />
              </div>
            ))}
          </div>
          {f.caption && <figcaption className="mt-3 text-[12px] text-black/50">{f.caption}</figcaption>}
        </figure>
      );
    },
    simpleTable: ({ node }: { node: SerializedBlockNode }) => {
      const f = node.fields as unknown as TableFields;
      return (
        <div className="overflow-x-auto pt-6">
          <table className="min-w-[280px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-black">
                {[f.headA, f.headB].map((h) => (
                  <th key={h} className="py-2 pr-10 text-left text-[11px] font-medium tracking-[0.1em] uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(f.rows ?? []).map((r, i) => (
                <tr key={i} className="border-b border-black/10">
                  <td className="py-2.5 pr-10">{r.a}</td>
                  <td className="py-2.5 pr-10 tabular-nums text-black/70">{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    pullQuote: ({ node }: { node: SerializedBlockNode }) => {
      const f = node.fields as unknown as QuoteFields;
      return (
        <blockquote className="my-6 border-l border-black pl-5">
          <p className="font-display text-[24px] leading-snug italic">“{f.text}”</p>
          {f.cite && <cite className="eyebrow mt-2 block text-black/50 not-italic">— {f.cite}</cite>}
        </blockquote>
      );
    },
  },
});

const styles =
  "text-[15px] leading-[27px] text-black/75 " +
  "[&_h2]:pt-10 [&_h2]:font-display [&_h2]:text-[28px] [&_h2]:leading-tight [&_h2]:font-medium [&_h2]:text-black " +
  "[&_h3]:pt-6 [&_h3]:text-[12px] [&_h3]:font-medium [&_h3]:tracking-[0.1em] [&_h3]:text-black [&_h3]:uppercase " +
  "[&_p]:pt-4 [&_ul]:list-disc [&_ul]:pt-3 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pt-3 [&_ol]:pl-5 [&_li]:mt-1 [&_li]:marker:text-black/40 " +
  "[&_a]:text-black [&_a]:underline [&_a]:underline-offset-2 [&_blockquote>p]:pt-0";

export function RichContent({ data, className = "" }: { data: SerializedEditorState | null | undefined; className?: string }) {
  if (!data) return null;
  return <RichText data={data} converters={converters} className={`${styles} ${className}`} disableContainer={false} />;
}
