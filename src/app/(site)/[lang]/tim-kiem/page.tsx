import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { pageMeta } from "@/lib/seo";

// Trang kết quả tìm kiếm không cần index (tránh trùng lặp nội dung)
export const metadata = pageMeta({ title: "Tìm kiếm", path: "/tim-kiem", noindex: true });

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-white" />}>
      <SearchResults />
    </Suspense>
  );
}
