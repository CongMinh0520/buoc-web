import Link from "next/link";
import type { TypedUser } from "payload";

/** Mục "Tài liệu API" ở cuối menu trái — chỉ hiện với vai trò Quản trị */
export function ApiNavLink({ user }: { user?: TypedUser | null }) {
  if ((user as { role?: string } | null | undefined)?.role !== "admin") return null;
  return (
    <div className="buoc-api-nav">
      <span className="buoc-api-nav__label">Lập trình</span>
      <Link className="nav__link buoc-api-nav__link" href="/admin/api-docs">
        <span className="nav__link-label">Tài liệu API</span>
      </Link>
    </div>
  );
}
