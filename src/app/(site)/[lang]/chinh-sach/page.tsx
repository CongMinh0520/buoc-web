import { PolicyAccordion } from "@/components/policy/PolicyAccordion";
import { RichContent } from "@/components/rich/RichContent";
import { getPolicies, getSiteSettings } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata() {
  const s = await getSiteSettings();
  return pageMeta({
    title: "Chính sách",
    description: `Điều kiện giao dịch chung, giao hàng, đổi trả, thanh toán và bảo vệ thông tin cá nhân của ${s.brandName}.`,
    path: "/chinh-sach",
  });
}

export default async function PolicyPage() {
  const [policies, s] = await Promise.all([getPolicies(), getSiteSettings()]);
  return (
    <div className="bg-white pb-24">
      <div className="mx-auto max-w-[790px] px-4 pt-14 sm:px-0">
        <h1 className="text-center font-display text-[56px] leading-none font-medium sm:text-[72px]">Chính sách</h1>
        <p className="mx-auto mt-4 mb-12 max-w-[520px] text-center text-[14px] leading-6 text-black/55">
          Các điều khoản về hỗ trợ, giao hàng, đổi trả, thanh toán và bảo mật khi mua sắm tại {s.brandName}.
        </p>
        <PolicyAccordion
          items={policies.map((p) => ({
            slug: p.slug,
            title: p.title,
            meta: [p.version && `Phiên bản: ${p.version}`, p.effective && `Ngày hiệu lực: ${p.effective}`].filter(Boolean).join(" · "),
            body: <RichContent data={p.content} className="text-[14px] leading-[24px] [&_h3:first-child]:pt-2" />,
          }))}
        />
      </div>
    </div>
  );
}
