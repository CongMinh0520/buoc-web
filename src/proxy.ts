import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * Chặn các endpoint xác thực REST mặc định của Payload cho khách hàng.
 * Website dùng server action riêng (có giới hạn tần suất, OTP, thông báo lỗi trung tính),
 * nên mở thêm đường REST song song chỉ làm tăng bề mặt tấn công.
 */
const BLOCKED_CUSTOMER_API = /^\/api\/customers\/(login|forgot-password|reset-password|verify(\/.*)?|unlock|first-register|init|refresh-token)$/;

/** Đường dẫn không thuộc website đa ngôn ngữ: admin, API, file tĩnh, robots/sitemap */
const NOT_LOCALIZED = /^\/(admin|api|_next|_vercel)(\/|$)|^\/(robots\.txt|sitemap\.xml|favicon\.(svg|ico))$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (BLOCKED_CUSTOMER_API.test(pathname)) return new NextResponse(null, { status: 404 });
  if (NOT_LOCALIZED.test(pathname)) return NextResponse.next();
  // File tĩnh trong /public (có phần mở rộng), trừ chỉ mục tìm kiếm vốn là một route theo ngôn ngữ
  if (/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith("/search-index.json")) return NextResponse.next();

  // /vi/… là URL trùng lặp của bản tiếng Việt → chuyển hẳn về URL không tiền tố
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  // Ngôn ngữ khác đã có tiền tố (/en/…) → đi thẳng vào app/(site)/[lang]
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return NextResponse.next();

  // Còn lại là bản tiếng Việt: viết lại nội bộ thành /vi/… (URL trên trình duyệt giữ nguyên)
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
