import { Suspense } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSkeleton, LoginPrompt } from "@/components/account/LoginPrompt";
import { getCurrentCustomer } from "@/server/auth";
import { getPayloadClient } from "@/lib/cms";
import { formatDate } from "@/lib/format";
import { customerTier, tierPerks } from "@/lib/loyalty";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Tích điểm thành viên", path: "/tai-khoan/tich-diem", noindex: true });

const fmt = (n: number) => String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

async function Content() {
  const c = await getCurrentCustomer();
  if (!c) return <LoginPrompt />;
  const payload = await getPayloadClient();
  const tx = await payload.find({ collection: "loyalty-transactions", user: c, overrideAccess: false, sort: "-createdAt", limit: 50, depth: 0 });
  const points = c.points ?? 0;
  const t = customerTier(points);
  const loyalty = {
    name: c.name.toUpperCase(),
    tier: t.tier,
    points,
    nextTier: t.next,
    nextAt: t.nextAt,
    perks: tierPerks[t.tier] ?? [],
    history: tx.docs.map((h) => ({ id: h.id, label: h.label, date: formatDate(h.createdAt), points: h.points })),
  };
  const pct = loyalty.nextAt ? Math.min(100, Math.round((loyalty.points / loyalty.nextAt) * 100)) : 100;
  return (
    <div className="max-w-[960px]">
      <section>
        <h2 className="font-display text-[30px] leading-none font-medium uppercase">{loyalty.name}</h2>
        <p className="mt-2 text-[12px] tracking-[0.1em] text-black/55 uppercase">Hạng: {loyalty.tier}</p>
      </section>

      <section className="mt-10 border border-black bg-white p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2 sm:items-end">
          <div>
            <p className="eyebrow text-black/45">Số điểm hiện tại</p>
            <p className="mt-2 font-display text-[64px] leading-none font-medium tabular-nums">{fmt(loyalty.points)}</p>
          </div>
          <div className="sm:text-right">
            {loyalty.nextTier && loyalty.nextAt ? (
              <>
                <p className="text-[12px] tracking-[0.1em] uppercase">Hạng tiếp theo: {loyalty.nextTier}</p>
                <p className="mt-1 text-[12px] text-black/55">Còn {fmt(loyalty.nextAt - loyalty.points)} điểm</p>
              </>
            ) : (
              <p className="text-[12px] tracking-[0.1em] uppercase">Bạn đang ở hạng cao nhất</p>
            )}
          </div>
        </div>
        <div className="mt-6 h-1 bg-black/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Tiến độ lên hạng">
          <div className="h-full bg-black" style={{ width: `${pct}%` }} />
        </div>
      </section>

      <section className="mt-10">
        <h3 className="text-[12px] font-medium tracking-[0.12em] uppercase">Đặc quyền hạng thành viên</h3>
        <div className="mt-4 grid border border-black bg-white sm:grid-cols-2">
          {loyalty.perks.map((p, i) => (
            <article
              key={p.title}
              className={`flex gap-5 p-6 ${i === 2 ? "border-t border-black sm:col-span-2" : ""} ${i === 1 ? "border-t border-black sm:border-t-0 sm:border-l" : ""}`}
            >
              <span className="font-display text-[26px] leading-none text-black/35 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-[13px] font-medium tracking-[0.06em] uppercase">{p.title}</p>
                <p className="mt-1.5 text-[13px] leading-5 text-black/60">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h3 className="text-[12px] font-medium tracking-[0.12em] uppercase">Lịch sử tích điểm</h3>
        {loyalty.history.length === 0 && <p className="mt-4 border border-black/15 bg-white py-12 text-center text-[13px] text-black/50">Chưa có giao dịch điểm. Mỗi 10.000 ₫ của đơn đã giao = 1 điểm.</p>}
        <ul className={`mt-4 border border-black bg-white ${loyalty.history.length === 0 ? "hidden" : ""}`}>
          {loyalty.history.map((h, i) => (
            <li key={h.id} className={`flex items-center justify-between px-6 py-5 ${i > 0 ? "border-t border-black/15" : ""}`}>
              <div>
                <p className="text-[13px] font-medium tracking-[0.04em]">{h.label}</p>
                <p className="mt-1 text-[11px] text-black/45">{h.date}</p>
              </div>
              <p className={`font-display text-[24px] font-medium tabular-nums ${h.points < 0 ? "text-black/45" : ""}`}>
                {h.points < 0 ? "− " : "+ "}
                {fmt(h.points)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function PointsPage() {
  return (
    <AccountShell title="Tích điểm thành viên" active="points">
      <Suspense fallback={<AccountSkeleton />}>
        <Content />
      </Suspense>
    </AccountShell>
  );
}
