"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const q = quality ?? 75;
    return `${src}?auto=format&fit=crop&w=${width}&q=${q}`;
  }
  // Ảnh từ Media (Payload) hoặc /public: đã có sẵn các cỡ tối ưu, trả nguyên đường dẫn
  // (thêm ?w= chỉ để Next.js biết loader có dùng width; server bỏ qua tham số này)
  return src.includes("?") ? src : `${src}?w=${width}`;
}
