import Link from "next/link";

const nav = [
  { key: "info", label: "Tài khoản", href: "/tai-khoan" },
  { key: "address", label: "Sổ địa chỉ", href: "/tai-khoan/so-dia-chi" },
  {
    key: "orders",
    label: "Lịch sử đơn hàng",
    href: "/tai-khoan/lich-su-don-hang",
  },
  { key: "points", label: "Tích điểm", href: "/tai-khoan/tich-diem" },
  { key: "notice", label: "Thông báo", href: "/tai-khoan/thong-bao" },
] as const;

export type AccountKey = (typeof nav)[number]["key"];

export function AccountShell({
  title,
  active,
  children,
}: {
  title: string;
  active: AccountKey;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-paper">
      <section className="border-y border-black bg-white py-10 lg:py-12">
        <div className="mx-auto max-w-site px-4 sm:px-5">
          <p className="text-[11px] tracking-[0.14em] text-black uppercase">
            Tài khoản
          </p>
          <h1 className="mt-2 font-display text-[38px] leading-none font-medium tracking-[0.02em] text-black uppercase">
            {title}
          </h1>
        </div>
      </section>
      <div className="mx-auto grid max-w-site px-4 sm:px-5 lg:grid-cols-[240px_1fr]">
        <aside className="border-black lg:border-r">
          <nav
            aria-label="Tài khoản"
            className="no-scrollbar flex gap-6 overflow-x-auto border-b border-black/15 py-5 lg:flex-col lg:border-b-0 lg:py-10 lg:pr-10"
          >
            {nav.map((n) => {
              const on = n.key === active;
              return (
                <Link
                  key={n.key}
                  href={n.href}
                  aria-current={on ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2.5 text-[12px] tracking-[0.12em] uppercase ${
                    on
                      ? "font-medium text-black underline underline-offset-[5px]"
                      : "text-black/45 hover:text-black"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 py-8 lg:py-10 lg:pl-10">{children}</div>
      </div>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-black pb-2 text-[12px] font-medium tracking-[0.12em] text-black uppercase">
      {children}
    </h2>
  );
}

export function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="mb-1.5 block text-[12px] tracking-[0.1em] text-subtle uppercase">
      {children}
      {required && <span className="text-danger"> *</span>}
    </span>
  );
}
