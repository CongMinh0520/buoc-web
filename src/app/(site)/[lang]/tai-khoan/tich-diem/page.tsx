import { Suspense } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { AccountSkeleton, LoginPrompt } from "@/components/account/LoginPrompt";
import { getCurrentCustomer } from "@/server/auth";
import { getPayloadClient } from "@/lib/cms";
import { formatDate } from "@/lib/format";
import { customerTier } from "@/lib/loyalty";
import { localizeGenerated } from "@/i18n/generated";
import { pageMeta } from "@/lib/seo";
import { getLocale, getT } from "@/i18n/server";

export async function generateMetadata() {
  const [locale, t] = await Promise.all([getLocale(), getT()]);
  return pageMeta({ locale, title: t.account.titles.points, path: "/tai-khoan/tich-diem", noindex: true });
}

const fmt = (n: number) => String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

async function Content() {
  const c = await getCurrentCustomer();
  if (!c) return <LoginPrompt />;
  const [locale, tr] = await Promise.all([getLocale(), getT()]);
  const L = tr.loyalty;
  const payload = await getPayloadClient();
  const tx = await payload.find({ collection: "loyalty-transactions", user: c, overrideAccess: false, sort: "-createdAt", limit: 50, depth: 0 });
  const points = c.points ?? 0;
  const t = customerTier(points);
  const loyalty = {
    name: c.name.toUpperCase(),
    tier: L.tiers[t.tier] ?? t.tier,
    points,
    nextTier: t.next ? (L.tiers[t.next] ?? t.next) : null,
    nextAt: t.nextAt,
    perks: L.perkList[t.tier] ?? [],
    history: tx.docs.map((h) => ({ id: h.id, label: localizeGenerated(h.label, locale), date: formatDate(h.createdAt), points: h.points })),
  };
  const pct = loyalty.nextAt ? Math.min(100, Math.round((loyalty.points / loyalty.nextAt) * 100)) : 100;
  return (
    <div className="max-w-[960px]">
      <section>
        <h2 className="font-display text-[30px] leading-none font-medium uppercase">{loyalty.name}</h2>
        <p className="mt-2 text-[12px] tracking-[0.1em] text-black/55 uppercase">{L.tier(loyalty.tier)}</p>
      </section>

      <section className="mt-10 border border-black bg-white p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2 sm:items-end">
          <div>
            <p className="eyebrow text-black/45">{L.points}</p>
            <p className="mt-2 font-display text-[64px] leading-none font-medium tabular-nums">{fmt(loyalty.points)}</p>
          </div>
          <div className="sm:text-right">
            {loyalty.nextTier && loyalty.nextAt ? (
              <>
                <p className="text-[12px] tracking-[0.1em] uppercase">{L.nextTier(loyalty.nextTier)}</p>
                <p className="mt-1 text-[12px] text-black/55">{L.toGo(fmt(loyalty.nextAt - loyalty.points))}</p>
              </>
            ) : (
              <p className="text-[12px] tracking-[0.1em] uppercase">{L.top}</p>
            )}
          </div>
        </div>
        <div className="mt-6 h-1 bg-black/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={L.progress}>
          <div className="h-full bg-black" style={{ width: `${pct}%` }} />
        </div>
      </section>

      <section className="mt-10">
        <h3 className="text-[12px] font-medium tracking-[0.12em] uppercase">{L.perks}</h3>
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
        <h3 className="text-[12px] font-medium tracking-[0.12em] uppercase">{L.history}</h3>
        {loyalty.history.length === 0 && <p className="mt-4 border border-black/15 bg-white py-12 text-center text-[13px] text-black/50">{L.noHistory}</p>}
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

export default async function PointsPage() {
  const t = await getT();
  return (
    <AccountShell title={t.account.titles.points} active="points">
      <Suspense fallback={<AccountSkeleton />}>
        <Content />
      </Suspense>
    </AccountShell>
  );
}
