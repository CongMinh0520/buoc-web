/** URL gốc của website (dùng cho canonical, sitemap, Open Graph, URL trả về của cổng thanh toán) */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const absUrl = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`);
