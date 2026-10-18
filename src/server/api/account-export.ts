import { getCurrentCustomer } from "@/server/auth";
import { getPayloadClient } from "@/lib/cms";

/**
 * Tải xuống dữ liệu cá nhân của chính khách hàng đang đăng nhập (Luật BVDLCN 2025 — quyền truy cập dữ liệu).
 * Mọi truy vấn chạy với quyền của khách (overrideAccess: false) nên không thể lấy dữ liệu người khác.
 */
export async function accountExport() {
  const c = await getCurrentCustomer();
  if (!c) return Response.json({ error: "Chưa đăng nhập" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  const payload = await getPayloadClient();
  const opts = { user: c, overrideAccess: false, depth: 0, limit: 1000, pagination: false } as const;
  const [orders, loyalty, notifications] = await Promise.all([
    payload.find({ collection: "orders", ...opts }),
    payload.find({ collection: "loyalty-transactions", ...opts }),
    payload.find({ collection: "notifications", ...opts }),
  ]);
  const data = {
    exportedAt: new Date().toISOString(),
    profile: {
      name: c.name,
      email: c.email,
      phone: c.phone,
      gender: c.gender,
      birthday: c.birthday,
      shoeSize: c.shoeSize,
      marketingOptIn: c.marketingOptIn,
      points: c.points,
      createdAt: c.createdAt,
      consent: c.consent,
    },
    addresses: (c.addresses ?? []).map(({ label, name, phone, line, ward, province, isDefault }) => ({ label, name, phone, line, ward, province, isDefault })),
    orders: orders.docs.map((o) => ({
      code: o.code,
      createdAt: o.createdAt,
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      total: o.total,
      shipping: o.shipping,
      items: o.items.map(({ name, color, size, price, qty }) => ({ name, color, size, price, qty })),
      invoice: o.invoice?.requested ? o.invoice : undefined,
    })),
    loyalty: loyalty.docs.map(({ label, points, createdAt }) => ({ label, points, createdAt })),
    notifications: notifications.docs.map(({ title, body, createdAt, readAt }) => ({ title, body, createdAt, readAt })),
  };
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="du-lieu-ca-nhan-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
