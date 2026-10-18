import { connection } from "next/server";
import { headers } from "next/headers";
import { getPayloadClient } from "@/lib/cms";
import type { Customer } from "@/payload-types";
import type { PublicCustomer } from "@/lib/types";

export type { PublicCustomer };

/** Khách hàng đang đăng nhập (đọc cookie HTTP-only) — chỉ gọi trong vùng render động / server action */
export async function getCurrentCustomer(): Promise<Customer | null> {
  // Xác thực JWT đọc đồng hồ hệ thống → luôn chạy lúc request, không chạy khi prerender / runtime-prefetch
  await connection();
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user || user.collection !== "customers") return null;
  return user as unknown as Customer;
}

export const toPublicCustomer = (c: Customer): PublicCustomer => ({ id: c.id, name: c.name, email: c.email });
