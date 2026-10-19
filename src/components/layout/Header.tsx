"use client";

import Link from "next/link";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { useBarePathname, useLocale, useT } from "@/components/providers/LocaleProvider";
import { localePath, locales } from "@/i18n/config";
import { useEffect, useRef, useState } from "react";
import { Bell, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import type { NavLink } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import { useAuthModal } from "@/components/providers/AuthProvider";
import { SearchOverlay } from "./SearchOverlay";
import { CartToast } from "./CartToast";

export function Header({ nav, wordmark, brandName }: { nav: NavLink[]; wordmark: string; brandName: string }) {
  const pathname = useBarePathname();
  const locale = useLocale();
  const t = useT();
  // Các trang có ảnh hero toàn chiều rộng: header trong suốt nằm đè lên ảnh
  const overlay =
    pathname === "/" ||
    pathname === "/xuong-mo" ||
    /^\/(bo-suu-tap|dong|tap-chi)\/[^/]+$/.test(pathname);
  const isAccount = pathname.startsWith("/tai-khoan");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { count, ready } = useCart();
  const { open: openAuth, customer, logout } = useAuthModal();
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đóng menu khi chuyển trang
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setAccountOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!accountOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [accountOpen]);

  const transparent = overlay && !scrolled && !mobileOpen;
  const tone = transparent ? "text-white" : "text-ink";

  return (
    <>
      <header
        className={`${overlay ? "fixed" : "sticky"} inset-x-0 top-0 z-50 transition-colors duration-300 ${
          transparent ? "bg-transparent" : "border-b border-black/10 bg-white/95 backdrop-blur-md"
        }`}
      >
        <div className={`mx-auto flex h-14 max-w-site items-center justify-between px-4 sm:px-10 ${tone}`}>
          <div className="flex items-center gap-3">
            {!isAccount && (
              <button
                className="-ml-1.5 p-1.5 lg:hidden"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? t.header.closeMenu : t.header.openMenu}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} strokeWidth={1.4} /> : <Menu size={20} strokeWidth={1.4} />}
              </button>
            )}
            <Logo wordmark={wordmark} name={brandName} homeLabel={t.header.homeOf(brandName)} />
          </div>

          {!isAccount && (
            <nav aria-label={t.header.mainNav} className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
              <ul className="flex items-center gap-7">
                {nav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <LocaleLink
                        href={item.href}
                        className={`text-[12px] tracking-[0.06em] uppercase underline-offset-[6px] transition-opacity hover:opacity-70 ${
                          active ? "underline decoration-1" : "underline decoration-current/40 decoration-1"
                        }`}
                      >
                        {item.label}
                      </LocaleLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          <div className="flex items-center gap-1 sm:gap-3">
            <button className="p-1.5" aria-label={t.header.search} onClick={() => setSearchOpen(true)}>
              <Search size={20} strokeWidth={1.4} />
            </button>

            <div className="relative" ref={accountRef}>
              <button
                className="p-1.5"
                aria-label={t.header.account}
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((v) => !v)}
              >
                <User size={20} strokeWidth={1.4} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 border border-black/10 bg-white py-2 text-ink shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)]">
                  {customer ? (
                    <>
                      <p className="px-4 pt-1 pb-2 text-[12px] text-black/55">{t.header.hello(customer.name)}</p>
                      <LocaleLink href="/tai-khoan" className="label-caps block px-4 py-2.5 hover:bg-paper">
                        {t.header.myAccount}
                      </LocaleLink>
                      <LocaleLink href="/tai-khoan/lich-su-don-hang" className="label-caps block px-4 py-2.5 hover:bg-paper">
                        {t.header.orders}
                      </LocaleLink>
                      <div className="my-1 h-px bg-black/10" />
                      <button
                        onClick={async () => {
                          setAccountOpen(false);
                          await logout();
                        }}
                        className="label-caps block w-full px-4 py-2.5 text-left hover:bg-paper"
                      >
                        {t.header.logout}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          openAuth("login");
                        }}
                        className="label-caps block w-full px-4 py-2.5 text-left hover:bg-paper"
                      >
                        {t.header.login}
                      </button>
                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          openAuth("register");
                        }}
                        className="label-caps block w-full px-4 py-2.5 text-left hover:bg-paper"
                      >
                        {t.header.register}
                      </button>
                      <div className="my-1 h-px bg-black/10" />
                      <LocaleLink href="/tra-cuu-don-hang" className="label-caps block px-4 py-2.5 hover:bg-paper">
                        {t.header.trackOrder}
                      </LocaleLink>
                    </>
                  )}
                </div>
              )}
            </div>

            {isAccount && (
              <LocaleLink href="/tai-khoan/thong-bao" className="relative p-1.5" aria-label={customer?.unread ? t.header.notificationsUnread(customer.unread) : t.header.notifications}>
                <Bell size={20} strokeWidth={1.4} />
                {!!customer?.unread && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-danger" />}
              </LocaleLink>
            )}

            <LocaleLink href="/gio-hang" className="relative p-1.5" aria-label={t.header.cart(count)}>
              <ShoppingBag size={20} strokeWidth={1.4} />
              {ready && count > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] leading-none font-medium ${
                    transparent ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  {count}
                </span>
              )}
            </LocaleLink>

            <nav aria-label={t.lang.switchTo} className="ml-1 hidden items-center gap-1.5 text-[12px] tracking-[0.03em] sm:flex">
              {locales.map((l, i) => (
                <span key={l} className="contents">
                  {i > 0 && <span className="opacity-40">/</span>}
                  <Link
                    href={localePath(l, pathname)}
                    hrefLang={l}
                    lang={l}
                    aria-current={l === locale ? "true" : undefined}
                    className={l === locale ? "" : "opacity-50 hover:opacity-80"}
                  >
                    {l.toUpperCase()}
                  </Link>
                </span>
              ))}
            </nav>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <nav aria-label={t.header.mobileNav} className="border-t border-black/10 bg-white px-4 pt-2 pb-6 lg:hidden">
            <ul>
              {nav.map((item) => (
                <li key={item.href} className="border-b border-black/5">
                  <LocaleLink href={item.href} className="block py-4 font-display text-[26px] font-medium uppercase">
                    {item.label}
                  </LocaleLink>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-4 text-[12px]">
              {locales.map((l) => (
                <Link key={l} href={localePath(l, pathname)} hrefLang={l} lang={l} className={l === locale ? "underline" : "opacity-50"}>
                  {t.lang[l]}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartToast />
    </>
  );
}
