import Link from "next/link";
import { DefaultTemplate } from "@payloadcms/next/templates";
import type { AdminViewServerProps } from "payload";
import * as accountActions from "@/server/actions/account";
import * as authActions from "@/server/actions/auth";
import * as checkoutActions from "@/server/actions/checkout";
import * as siteActions from "@/server/actions/site";

/** Route handler riêng của website (khai báo ở src/app/(site), xử lý ở src/server/api) */
const SITE_ENDPOINTS = [
  { method: "GET", path: "/search-index.json", note: "Chỉ mục tìm kiếm sản phẩm (JSON tĩnh, công khai)", file: "server/api/search-index.ts" },
  { method: "GET", path: "/api/account/export", note: "Khách đang đăng nhập tải dữ liệu cá nhân", file: "server/api/account-export.ts" },
  { method: "GET", path: "/api/payments/vnpay/ipn", note: "VNPay gọi xác nhận thanh toán (server-to-server)", file: "server/api/payments.ts" },
  { method: "GET", path: "/api/payments/vnpay/return", note: "VNPay chuyển khách về sau khi thanh toán", file: "server/api/payments.ts" },
  { method: "POST", path: "/api/payments/momo/ipn", note: "MoMo gọi xác nhận thanh toán (server-to-server)", file: "server/api/payments.ts" },
  { method: "GET", path: "/api/payments/momo/return", note: "MoMo chuyển khách về sau khi thanh toán", file: "server/api/payments.ts" },
];

const ACTION_FILES = [
  { file: "server/actions/auth.ts", mod: authActions },
  { file: "server/actions/account.ts", mod: accountActions },
  { file: "server/actions/checkout.ts", mod: checkoutActions },
  { file: "server/actions/site.ts", mod: siteActions },
];

const labelOf = (label: unknown, fallback: string) =>
  typeof label === "string" ? label : label && typeof label === "object" ? String(Object.values(label)[0] ?? fallback) : fallback;

/** Trang "Tài liệu API" cho lập trình viên — liệt kê REST API của Payload và các endpoint/action riêng của website */
export function ApiDocs({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult;
  const { payload, i18n, user } = req;
  const isAdmin = (user as { role?: string } | null)?.role === "admin";
  const apiBase = payload.config.routes.api;

  const collections = payload.config.collections.filter((c) => visibleEntities.collections.includes(c.slug));
  const globals = payload.config.globals.filter((g) => visibleEntities.globals.includes(g.slug));

  return (
    <DefaultTemplate
      i18n={i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <div className="buoc-api gutter--left gutter--right">
        <header className="buoc-api__head">
          <p className="buoc-dash__eyebrow">Dành cho lập trình viên</p>
          <h1 className="buoc-dash__title">Tài liệu API</h1>
          <p className="buoc-api__lead">
            Website đọc và ghi dữ liệu qua Local API của Payload và Server Actions (không gọi HTTP). REST API bên dưới
            dùng cho trang quản trị và để kiểm tra dữ liệu: yêu cầu cookie đăng nhập admin và tuân theo phân quyền của
            từng collection. GraphQL đã tắt.
          </p>
        </header>

        {!isAdmin ? (
          <p className="buoc-api__lead">Chỉ tài khoản có vai trò Quản trị mới xem được trang này.</p>
        ) : (
          <>
            <section className="buoc-dash__panel buoc-api__section">
              <div className="buoc-dash__panel-head">
                <h2 className="buoc-dash__panel-title">Collections · REST</h2>
                <span className="buoc-api__hint">
                  {apiBase}/&lt;slug&gt; · GET, POST · {apiBase}/&lt;slug&gt;/:id · GET, PATCH, DELETE
                </span>
              </div>
              <table className="buoc-dash__orders">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Endpoint</th>
                    <th className="buoc-dash__hide-sm">Ghi chú</th>
                    <th className="buoc-dash__num">Xem</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((c) => (
                    <tr key={c.slug}>
                      <td>{labelOf(c.labels?.plural, c.slug)}</td>
                      <td>
                        <code>
                          {apiBase}/{c.slug}
                        </code>
                      </td>
                      <td className="buoc-dash__hide-sm buoc-api__note">
                        {[c.auth ? "đăng nhập: /login, /logout, /me" : null, c.upload ? "tải tệp lên" : null, c.versions?.drafts ? "có bản nháp (?draft=true)" : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </td>
                      <td className="buoc-dash__num">
                        <a href={`${apiBase}/${c.slug}?limit=5&depth=0`} target="_blank" rel="noreferrer">
                          JSON ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="buoc-dash__panel buoc-api__section">
              <div className="buoc-dash__panel-head">
                <h2 className="buoc-dash__panel-title">Globals · REST</h2>
                <span className="buoc-api__hint">{apiBase}/globals/&lt;slug&gt; · GET, POST</span>
              </div>
              <table className="buoc-dash__orders">
                <tbody>
                  {globals.map((g) => (
                    <tr key={g.slug}>
                      <td>{labelOf(g.label, g.slug)}</td>
                      <td>
                        <code>
                          {apiBase}/globals/{g.slug}
                        </code>
                      </td>
                      <td className="buoc-dash__num">
                        <a href={`${apiBase}/globals/${g.slug}?depth=0`} target="_blank" rel="noreferrer">
                          JSON ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="buoc-dash__panel buoc-api__section">
              <div className="buoc-dash__panel-head">
                <h2 className="buoc-dash__panel-title">Endpoint riêng của website</h2>
                <span className="buoc-api__hint">src/server/api</span>
              </div>
              <table className="buoc-dash__orders">
                <tbody>
                  {SITE_ENDPOINTS.map((e) => (
                    <tr key={e.method + e.path}>
                      <td>
                        <span className={`buoc-api__method buoc-api__method--${e.method.toLowerCase()}`}>{e.method}</span>
                      </td>
                      <td>
                        <code>{e.path}</code>
                      </td>
                      <td className="buoc-dash__hide-sm buoc-api__note">{e.note}</td>
                      <td className="buoc-dash__hide-sm buoc-api__note">
                        <code>src/{e.file}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="buoc-dash__panel buoc-api__section">
              <div className="buoc-dash__panel-head">
                <h2 className="buoc-dash__panel-title">Server Actions</h2>
                <span className="buoc-api__hint">gọi từ component, không có URL công khai</span>
              </div>
              <table className="buoc-dash__orders">
                <tbody>
                  {ACTION_FILES.map(({ file, mod }) => (
                    <tr key={file}>
                      <td>
                        <code>src/{file}</code>
                      </td>
                      <td className="buoc-api__note">
                        {Object.keys(mod)
                          .filter((k) => typeof (mod as Record<string, unknown>)[k] === "function")
                          .join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <p className="buoc-api__lead">
              Thêm endpoint mới: viết xử lý trong <code>src/server/api</code>, rồi tạo file <code>route.ts</code> một dòng
              trong <code>src/app/(site)</code> trỏ tới đó, và thêm vào danh sách ở <code>src/components/admin/ApiDocs.tsx</code>.{" "}
              <Link href="/admin">← Về tổng quan</Link>
            </p>
          </>
        )}
      </div>
    </DefaultTemplate>
  );
}
