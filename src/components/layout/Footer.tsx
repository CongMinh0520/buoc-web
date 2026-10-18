import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { getLines, getLookbooks, getPolicies, getSiteSettings, getStores } from "@/lib/cms";

export async function Footer() {
  const [s, stores, lookbooks, lines, policies] = await Promise.all([getSiteSettings(), getStores(), getLookbooks(), getLines(), getPolicies()]);
  const c = s.company;
  const registration = [c.registrationNo && `Giấy chứng nhận ĐKDN số ${c.registrationNo}`, c.registrationIssued && `cấp ${c.registrationIssued}`].filter(Boolean).join(", ");

  const regions = Array.from(new Set(stores.map((x) => x.footerRegion)));
  const groups = lines
    .map((l) => ({ line: l, items: lookbooks.filter((b) => b.line.key === l.key) }))
    .filter((g) => g.items.length > 0);

  return (
    <footer className="border-t-2 border-ink-2 bg-white pt-14">
      <div className="mx-auto max-w-site px-4 sm:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.45fr_1.8fr_1fr_1fr] lg:gap-8">
          <div>
            <Logo size="lg" wordmark={s.wordmark} name={s.brandName} />
            <p className="mt-5 max-w-[260px] text-[12px] leading-[18px] tracking-[0.05em] text-ink-2 uppercase">{s.tagline}</p>
            <div className="mt-5 text-[12px] leading-[18px] text-ink-3">
              {s.hotline && <p>Hotline: {s.hotline}</p>}
              {s.email && (
                <p className="mt-1">
                  Email:{" "}
                  <a href={`mailto:${s.email}`} className="underline">
                    {s.email}
                  </a>
                </p>
              )}
            </div>
            <div className="mt-6 flex gap-5">
              {s.socials.map((n) => (
                <a key={n.label} href={n.href} target="_blank" rel="noopener noreferrer" className="text-[11px] tracking-[0.1em] text-ink uppercase underline-offset-4 hover:underline">
                  {n.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[14px] font-medium tracking-[0.08em] text-ink uppercase">Hệ thống cửa hàng</h2>
            <div className="mt-4 space-y-5">
              {regions.map((r) => (
                <div key={r}>
                  <p className="text-[12px] font-medium text-ink">{r}</p>
                  <ul className="mt-2 list-disc space-y-2 pl-4 text-[12px] leading-[18px] text-ink-2 marker:text-ink-2">
                    {stores
                      .filter((x) => x.footerRegion === r)
                      .map((x) => (
                        <li key={x.name}>
                          {x.name} — {x.address}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[14px] font-medium tracking-[0.08em] text-ink uppercase">Bộ sưu tập</h2>
            <div className="mt-4 space-y-5">
              {groups.map((g) => (
                <div key={g.line.key}>
                  <Link href={`/dong/${g.line.key}`} className="text-[12px] font-medium tracking-[0.03em] text-ink uppercase hover:underline">
                    {g.line.label}
                  </Link>
                  <ul className="mt-2 space-y-1.5">
                    {g.items.map((i) => (
                      <li key={i.slug}>
                        <Link href={`/bo-suu-tap/${i.slug}`} className="text-[12px] text-ink-3 hover:underline">
                          {i.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[14px] font-medium tracking-[0.08em] text-ink uppercase">Thông tin</h2>
            <ul className="mt-4 space-y-2">
              {s.footerInfo.map((i) => (
                <li key={i.label}>
                  <Link href={i.href} className="text-[12px] text-ink-3 hover:underline">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {policies.length > 0 && (
          <nav aria-label="Chính sách" className="mt-14 border-t border-line pt-5">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {policies.map((p) => (
                <li key={p.slug}>
                  <Link href={`/chinh-sach#${p.slug}`} className="text-[11px] tracking-[0.04em] text-ink-3 hover:underline">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Thông tin chủ quản — bắt buộc công khai (Nghị định 248/2026/NĐ-CP). Nhập ở admin: Cài đặt chung → Pháp lý & doanh nghiệp */}
        {(c.name || c.address || c.taxCode) && (
          <address className="mt-5 space-y-1 text-[11px] leading-[17px] text-ink-3 not-italic">
            {c.name && <p className="font-medium text-ink-2">{c.name}</p>}
            {c.address && <p>Trụ sở: {c.address}</p>}
            {(registration || c.taxCode) && <p>{[registration, c.taxCode && `Mã số thuế: ${c.taxCode}`].filter(Boolean).join(" · ")}</p>}
            {c.representative && <p>Người đại diện: {c.representative}</p>}
            {(c.complaintPhone || c.complaintEmail) && (
              <p>
                Tiếp nhận phản ánh, khiếu nại: {c.complaintPhone}
                {c.complaintPhone && c.complaintEmail && " · "}
                {c.complaintEmail && (
                  <a href={`mailto:${c.complaintEmail}`} className="underline">
                    {c.complaintEmail}
                  </a>
                )}
              </p>
            )}
          </address>
        )}

        <div className="mt-5 border-t border-line py-3">
          <p className="text-[11px] tracking-[0.03em] text-muted uppercase">{s.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
