import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { pageMeta } from "@/lib/seo";
import { getLocale, getT } from "@/i18n/server";

// Trang kết quả tìm kiếm không cần index (tránh trùng lặp nội dung)
export async function generateMetadata() {
  const [locale, t] = await Promise.all([getLocale(), getT()]);
  return pageMeta({ locale, title: t.search.metaTitle, path: "/tim-kiem", noindex: true });
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-white" />}>
      <SearchResults />
    </Suspense>
  );
}
