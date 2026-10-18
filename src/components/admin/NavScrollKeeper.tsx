"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const KEY = "buoc-admin-nav-scroll";

const read = () => {
  try {
    return Number(sessionStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
};
const write = (top: number) => {
  try {
    sessionStorage.setItem(KEY, String(Math.round(top)));
  } catch {}
};

/** Next giữ trang trước ở dạng ẩn (cacheComponents) → trong DOM có thể có nhiều menu, chỉ lấy menu đang hiển thị */
const visibleScroller = () =>
  [...document.querySelectorAll<HTMLElement>(".nav__scroll")].find((el) => el.clientHeight > 0) ?? null;

let listening = false;

/**
 * Payload dựng lại menu trái ở mỗi trang nên menu bị cuộn về đầu sau khi bấm một mục.
 * Component này nằm trong menu: lưu vị trí cuộn của menu đang hiển thị vào sessionStorage và khôi phục sau mỗi lần chuyển trang.
 */
export function NavScrollKeeper() {
  const pathname = usePathname();

  useEffect(() => {
    if (listening) return;
    listening = true;
    // `scroll` không nổi bọt → bắt ở pha capture trên document
    const onScroll = (e: Event) => {
      const el = e.target;
      if (el instanceof HTMLElement && el.classList.contains("nav__scroll") && el.clientHeight > 0) write(el.scrollTop);
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
  }, []);

  useEffect(() => {
    const target = read();
    if (!target) return;
    // Menu mới có thể chưa hiện/chưa đủ cao ở frame đầu → thử lại vài frame
    let frames = 0;
    let raf = 0;
    const restore = () => {
      const el = visibleScroller();
      if (el && el.scrollHeight - el.clientHeight >= Math.min(target, 1)) {
        el.scrollTop = target;
        if (Math.abs(el.scrollTop - target) <= 1 || el.scrollTop >= el.scrollHeight - el.clientHeight - 1) return;
      }
      if (++frames < 30) raf = requestAnimationFrame(restore);
    };
    raf = requestAnimationFrame(restore);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
