import { PolicyAccordion } from "@/components/policy/PolicyAccordion";
import { RichContent } from "@/components/rich/RichContent";
import { getPolicies, getSiteSettings } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import { getLocale, getT } from "@/i18n/server";

export async function generateMetadata() {
  const [s, locale, t] = await Promise.all([getSiteSettings(), getLocale(), getT()]);
  return pageMeta({
    locale,
    title: t.pages.policyTitle,
    description: t.pages.policyMetaDesc(s.brandName),
    path: "/chinh-sach",
  });
}

export default async function PolicyPage() {
  const [policies, s, t] = await Promise.all([getPolicies(), getSiteSettings(), getT()]);
  return (
    <div className="bg-white pb-24">
      <div className="mx-auto max-w-[790px] px-4 pt-14 sm:px-0">
        <h1 className="text-center font-display text-[56px] leading-none font-medium sm:text-[72px]">{t.pages.policyTitle}</h1>
        <p className="mx-auto mt-4 mb-12 max-w-[520px] text-center text-[14px] leading-6 text-black/55">
          {t.pages.policyIntro(s.brandName)}
        </p>
        <PolicyAccordion
          items={policies.map((p) => ({
            slug: p.slug,
            title: p.title,
            meta: [p.version && t.pages.policyVersion(p.version), p.effective && t.pages.policyEffective(p.effective)].filter(Boolean).join(" · "),
            body: <RichContent data={p.content} className="text-[14px] leading-[24px] [&_h3:first-child]:pt-2" />,
          }))}
        />
      </div>
    </div>
  );
}
