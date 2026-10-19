import Link from "./LocaleLink";

export function Logo({
  className = "",
  size = "md",
  wordmark,
  name,
  homeLabel,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Lấy từ Cài đặt chung trên admin */
  wordmark: string;
  name: string;
  /** Nhãn cho trình đọc màn hình, vd "BƯỚC — Trang chủ" */
  homeLabel?: string;
}) {
  const sizes = { sm: "text-[24px]", md: "text-[34px]", lg: "text-[44px]" };
  return (
    <Link
      href="/"
      aria-label={homeLabel ?? name}
      className={`font-display font-medium italic leading-none tracking-[-0.01em] ${sizes[size]} ${className}`}
    >
      {wordmark}
    </Link>
  );
}
