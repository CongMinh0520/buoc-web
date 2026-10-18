import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";
import { revalidateTag } from "next/cache";

/**
 * Jamstack: trang được prerender tĩnh và gắn cache tag.
 * Khi biên tập viên lưu nội dung trong admin, hook này đánh dấu tag đó hết hạn
 * để Next.js tạo lại đúng những trang liên quan (on-demand ISR).
 */
function safeRevalidate(tags: string[], disable?: boolean) {
  if (disable) return;
  for (const tag of tags) {
    try {
      revalidateTag(tag, "max");
    } catch {
      // Chạy ngoài Next.js (vd: script seed) — bỏ qua
    }
  }
}

export const revalidateCollection =
  (tag: string): CollectionAfterChangeHook =>
  ({ doc, context }) => {
    safeRevalidate([tag], Boolean(context?.disableRevalidate));
    return doc;
  };

export const revalidateCollectionDelete =
  (tag: string): CollectionAfterDeleteHook =>
  ({ doc, context }) => {
    safeRevalidate([tag], Boolean(context?.disableRevalidate));
    return doc;
  };

export const revalidateGlobal =
  (tag: string): GlobalAfterChangeHook =>
  ({ doc, context }) => {
    safeRevalidate([tag], Boolean(context?.disableRevalidate));
    return doc;
  };
