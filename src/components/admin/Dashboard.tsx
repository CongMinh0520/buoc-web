import Link from "next/link";
import { connection } from "next/server";
import type { Payload, TypedUser } from "payload";
import { ORDER_STATUS } from "@/payload/collections/Orders";
import { formatDate, formatNumber, formatVnd } from "@/lib/format";

const DAY = 24 * 3600 * 1000;
const LOW_STOCK = 2;
const OPEN_STATUSES = ["pending", "confirmed", "processing", "shipping"];

const badgeTone: Record<string, string> = {
  pending: "pending",
  confirmed: "active",
  processing: "active",
  shipping: "active",
  delivered: "done",
  cancelled: "cancelled",
};

/** Lời chào theo giờ Việt Nam */
const greeting = (now: Date) => {
  const h = (now.getUTCHours() + 7) % 24;
  return h < 11 ? "Chào buổi sáng" : h < 14 ? "Chào buổi trưa" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối";
};

/** Tổng quan bán hàng ở đầu trang Dashboard của admin (đọc theo quyền của nhân viên đang đăng nhập) */
export async function Dashboard({ payload, user }: { payload: Payload; user?: TypedUser | null }) {
  await connection(); // số liệu theo thời điểm xem → luôn render lúc có request
  const now = new Date();
  const since = new Date(now.getTime() - 30 * DAY).toISOString();
  const opts = { user, overrideAccess: false } as const;

  const [recent, monthOrders, openOrders, products, lowStock, customers] = await Promise.all([
    payload.find({ collection: "orders", sort: "-createdAt", limit: 6, depth: 0, ...opts }),
    payload.find({
      collection: "orders",
      where: { and: [{ createdAt: { greater_than_equal: since } }, { status: { not_equals: "cancelled" } }] },
      select: { total: true },
      limit: 0,
      pagination: false,
      depth: 0,
      ...opts,
    }),
    payload.count({ collection: "orders", where: { status: { in: OPEN_STATUSES } }, ...opts }),
    payload.count({ collection: "products", ...opts }),
    payload.count({ collection: "products", where: { "variants.stock": { less_than_equal: LOW_STOCK } }, ...opts }),
    payload.count({ collection: "customers", ...opts }),
  ]);

  const revenue = monthOrders.docs.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const name = (user as { name?: string } | null | undefined)?.name;
  const statusLabel = (v: string) => ORDER_STATUS.find((s) => s.value === v)?.label ?? v;

  return (
    <section className="buoc-dash">
      <div className="buoc-dash__hero">
        <div>
          <p className="buoc-dash__eyebrow">Tổng quan</p>
          <h1 className="buoc-dash__title">
            {greeting(now)}
            {name ? `, ${name}` : ""}
          </h1>
          <p className="buoc-dash__date">Hôm nay {formatDate(now.toISOString())}</p>
        </div>
        <div className="buoc-dash__actions">
          <Link className="buoc-dash__action buoc-dash__action--primary" href="/admin/collections/products/create">
            + Thêm sản phẩm
          </Link>
          <Link className="buoc-dash__action" href="/admin/collections/orders?where[status][in][0]=pending">
            Đơn chờ xử lý
          </Link>
          <a className="buoc-dash__action" href="/" target="_blank" rel="noreferrer">
            Xem website ↗
          </a>
        </div>
      </div>

      <div className="buoc-dash__stats">
        <div className="buoc-dash__stat">
          <div className="buoc-dash__stat-label">Giá trị đơn · 30 ngày</div>
          <div className="buoc-dash__stat-value">{formatVnd(revenue)}</div>
          <div className="buoc-dash__stat-note">{formatNumber(monthOrders.docs.length)} đơn, không tính đơn hủy</div>
        </div>
        <Link className="buoc-dash__stat" href="/admin/collections/orders">
          <div className="buoc-dash__stat-label">Đơn đang mở</div>
          <div className="buoc-dash__stat-value">{formatNumber(openOrders.totalDocs)}</div>
          <div className="buoc-dash__stat-note">Chờ thanh toán → đang giao</div>
        </Link>
        <Link className="buoc-dash__stat" href="/admin/collections/products">
          <div className="buoc-dash__stat-label">Sản phẩm</div>
          <div className="buoc-dash__stat-value">{formatNumber(products.totalDocs)}</div>
          <div className={`buoc-dash__stat-note${lowStock.totalDocs ? " buoc-dash__stat-note--warn" : ""}`}>
            {lowStock.totalDocs ? `${lowStock.totalDocs} mẫu có size còn ≤ ${LOW_STOCK} đôi` : "Tồn kho ổn định"}
          </div>
        </Link>
        <Link className="buoc-dash__stat" href="/admin/collections/customers">
          <div className="buoc-dash__stat-label">Khách hàng</div>
          <div className="buoc-dash__stat-value">{formatNumber(customers.totalDocs)}</div>
          <div className="buoc-dash__stat-note">Tài khoản đã đăng ký</div>
        </Link>
      </div>

      <div className="buoc-dash__panel">
        <div className="buoc-dash__panel-head">
          <h2 className="buoc-dash__panel-title">Đơn hàng mới nhất</h2>
          <Link className="buoc-dash__panel-link" href="/admin/collections/orders">
            Xem tất cả →
          </Link>
        </div>
        {recent.docs.length ? (
          <table className="buoc-dash__orders">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th className="buoc-dash__hide-sm">Người nhận</th>
                <th className="buoc-dash__hide-sm">Ngày</th>
                <th>Trạng thái</th>
                <th className="buoc-dash__num">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {recent.docs.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/collections/orders/${o.id}`}>#{o.code}</Link>
                  </td>
                  <td className="buoc-dash__hide-sm">{o.shipping?.name ?? o.email}</td>
                  <td className="buoc-dash__hide-sm">{formatDate(o.createdAt)}</td>
                  <td>
                    <span className={`buoc-dash__badge buoc-dash__badge--${badgeTone[o.status] ?? "active"}`}>
                      {statusLabel(o.status)}
                    </span>
                  </td>
                  <td className="buoc-dash__num">{formatVnd(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="buoc-dash__empty">Chưa có đơn hàng nào.</p>
        )}
      </div>
    </section>
  );
}
