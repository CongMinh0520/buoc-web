/** Tiêu đề trang dạng căn giữa (Ưu đãi, Tạp chí, Giới thiệu…) */
export function PageIntro({ title, desc, eyebrow }: { title: string; desc?: string; eyebrow?: string }) {
  return (
    <header className="mx-auto max-w-[720px] px-4 pt-14 pb-10 text-center lg:pt-16">
      {eyebrow && <p className="eyebrow text-black/50">{eyebrow}</p>}
      <h1 className="mt-2 font-display text-[44px] leading-[1.05] font-medium text-ink-2 sm:text-[56px]">{title}</h1>
      {desc && <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-6 text-black/55">{desc}</p>}
    </header>
  );
}
