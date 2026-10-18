import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/be-vietnam-pro/300.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "../../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HideOn } from "@/components/layout/HideOn";
import { CartProvider } from "@/components/providers/CartProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { JsonLd, organizationJsonLd, alternatesFor } from "@/lib/seo";
import { getSiteSettings } from "@/lib/cms";
import { siteUrl } from "@/lib/site-url";
import { htmlLang, locales, ogLocale } from "@/i18n/config";
import { getLocale } from "@/i18n/server";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [s, locale] = await Promise.all([getSiteSettings(), getLocale()]);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: s.seoTitle, template: `%s | ${s.brandName}` },
    description: s.seoDescription,
    applicationName: s.brandName,
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      type: "website",
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      siteName: s.brandName,
      title: s.seoTitle,
      description: s.seoDescription,
      images: s.ogImage ? [{ url: s.ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
    // Favicon tải lên ở admin (Cài đặt chung → Thương hiệu); chưa có thì dùng biểu tượng trung tính
    icons: { icon: s.favicon || "/favicon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default async function SiteLayout({ children }: LayoutProps<"/[lang]">) {
  const [s, locale] = await Promise.all([getSiteSettings(), getLocale()]);
  return (
    <html lang={htmlLang[locale]} className="h-full">
      <body className="flex min-h-full flex-col">
        <JsonLd data={organizationJsonLd(s)} />
        <LocaleProvider locale={locale}>
          <SiteProvider value={{ brandName: s.brandName, wordmark: s.wordmark }}>
            <CartProvider>
              <AuthProvider>
                <HideOn>
                  <Header nav={s.mainNav} wordmark={s.wordmark} brandName={s.brandName} />
                </HideOn>
                <main className="flex-1">{children}</main>
                <HideOn>
                  <Footer />
                </HideOn>
              </AuthProvider>
            </CartProvider>
          </SiteProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
