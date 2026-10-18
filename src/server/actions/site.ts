"use server";

import { z } from "zod";
import { getPayloadClient } from "@/lib/cms";
import { rateLimit, TOO_MANY } from "@/server/rate-limit";
import type { ActionResult } from "./auth";

const phone = z
  .string()
  .trim()
  .regex(/^(\+?84|0)\d{9,10}$/, "Số điện thoại không hợp lệ");

/** Đăng ký buổi xưởng mở — lưu vào collection "bookings" để nhân viên gọi xác nhận */
export async function createBookingAction(input: { name: string; phone: string; session: string; store: string; website?: string }): Promise<ActionResult> {
  // Trường ẩn chống bot: người thật không điền
  if (input.website) return { ok: true };
  if (!(await rateLimit("booking", 5, 3600))) return { ok: false, error: TOO_MANY };
  const parsed = z
    .object({
      name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(100),
      phone,
      session: z.string().trim().min(1).max(120),
      store: z.string().trim().max(120),
    })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const payload = await getPayloadClient();
  // Chỉ chấp nhận buổi và cửa hàng có thật trong CMS
  const [workshop, stores] = await Promise.all([
    payload.findGlobal({ slug: "workshop", depth: 0 }),
    payload.find({ collection: "stores", limit: 100, depth: 0 }),
  ]);
  const validSession = (workshop.sessions ?? []).some((s) => `${s.title} — ${s.day} ${s.time}` === parsed.data.session);
  const validStore = stores.docs.some((s) => s.name === parsed.data.store);
  if (!validSession || !validStore) return { ok: false, error: "Buổi hoặc cửa hàng không hợp lệ." };

  await payload.create({ collection: "bookings", overrideAccess: true, data: { ...parsed.data, status: "new" } });
  return { ok: true };
}
