import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-paper px-6 py-24 text-center">
      <p className="font-display text-[120px] leading-none font-medium tracking-[0.04em] sm:text-[160px]">404</p>
      <h1 className="mt-4 label-caps font-medium">Trang này chưa có ở đây</h1>
      <p className="mt-3 max-w-[420px] text-[14px] leading-6 text-black/55">
        Có thể đường dẫn đã thay đổi, hoặc trang đang được xưởng hoàn thiện. Mời bạn quay lại trang chủ hoặc xem các
        thiết kế mới nhất.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-dark">
          Về trang chủ
        </Link>
        <Link href="/danh-muc/tat-ca" className="btn-outline">
          Xem sản phẩm
        </Link>
      </div>
    </section>
  );
}
