// Khung chờ hiển thị ngay khi điều hướng giữa các trang động ([slug]); nội dung thật (đã cache) stream vào sau.
const Bar = ({ className = "" }: { className?: string }) => <div className={`bg-black/[0.06] ${className}`} />;

function Shell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label={label}>
      {children}
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <Shell label="Đang tải sản phẩm">
      <section className="grid lg:grid-cols-[64%_36%]">
        <div className="grid grid-cols-2 bg-stone">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[409/520] border-r border-b border-white bg-black/[0.04]" />
          ))}
        </div>
        <div className="space-y-4 bg-white px-5 pt-8 pb-10 sm:px-[38px]">
          <Bar className="h-2.5 w-40" />
          <Bar className="h-8 w-3/4" />
          <Bar className="h-3 w-1/2" />
          <Bar className="h-5 w-28" />
          <div className="flex gap-2 pt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Bar key={i} className="size-10" />
            ))}
          </div>
          <Bar className="mt-6 h-[52px] w-full" />
        </div>
      </section>
    </Shell>
  );
}

export function GridSkeleton({ label = "Đang tải" }: { label?: string }) {
  return (
    <Shell label={label}>
      <div className="mx-auto max-w-site px-4 pt-10 pb-24 sm:px-5 sm:pt-14">
        <Bar className="h-3 w-48" />
        <Bar className="mt-6 h-10 w-72 max-w-full" />
        <Bar className="mt-4 h-3 w-full max-w-[560px]" />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] bg-black/[0.05]" />
              <Bar className="mt-3 h-3 w-3/4" />
              <Bar className="mt-2 h-3 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function ArticleSkeleton() {
  return (
    <Shell label="Đang tải bài viết">
      <section className="h-[480px] bg-ink-2/80 lg:h-[540px]" />
      <div className="mx-auto max-w-[794px] space-y-3 px-4 py-12 sm:px-10">
        {["w-full", "w-11/12", "w-full", "w-4/5", "w-full", "w-2/3"].map((w, i) => (
          <Bar key={i} className={`h-3.5 ${w}`} />
        ))}
      </div>
    </Shell>
  );
}
