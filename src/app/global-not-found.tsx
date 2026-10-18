/* eslint-disable @next/next/no-html-link-for-pages -- trang nằm ngoài mọi root layout, điều hướng tải lại toàn trang là đúng */
// 404 cho mọi URL không khớp route nào (dự án có 2 root layout: site & Payload admin)
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return { title: `Không tìm thấy trang | ${s.brandName}`, description: "Đường dẫn bạn truy cập không tồn tại." };
}

export default async function GlobalNotFound() {
  const s = await getSiteSettings();
  return (
    <html lang="vi">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-24 text-center">
          <a href="/" className="font-display text-[28px] font-medium tracking-[0.04em]">
            {s.wordmark}
          </a>
          <p className="mt-10 font-display text-[120px] leading-none font-medium tracking-[0.04em] sm:text-[160px]">404</p>
          <h1 className="mt-4 label-caps font-medium">Trang này chưa có ở đây</h1>
          <p className="mt-3 max-w-[420px] text-[14px] leading-6 text-black/55">
            Có thể đường dẫn đã thay đổi, hoặc trang đang được xưởng hoàn thiện.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {/* thẻ <a> thường: trang này nằm ngoài cả hai root layout */}
            <a href="/" className="btn-dark">
              Về trang chủ
            </a>
            <a href="/danh-muc/tat-ca" className="btn-outline">
              Xem sản phẩm
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
