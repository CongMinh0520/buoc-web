import Link from "next/link";

export function Logo({
  className = "",
  size = "md",
  wordmark,
  name,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Lấy từ Cài đặt chung trên admin */
  wordmark: string;
  name: string;
}) {
  const sizes = { sm: "text-[24px]", md: "text-[34px]", lg: "text-[44px]" };
  return (
    <Link
      href="/"
      aria-label={`${name} — Trang chủ`}
      className={`font-display font-medium italic leading-none tracking-[-0.01em] ${sizes[size]} ${className}`}
    >
      {wordmark}
    </Link>
  );
}
