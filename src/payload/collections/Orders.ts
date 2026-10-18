import type { CollectionAfterChangeHook, CollectionConfig } from "payload";
import { ownCustomerOrStaff, staffOnly } from "../access";

export const ORDER_STATUS = [
  { label: "Chờ thanh toán", value: "pending" },
  { label: "Đã xác nhận", value: "confirmed" },
  { label: "Đang xử lý", value: "processing" },
  { label: "Đang giao hàng", value: "shipping" },
  { label: "Đã giao hàng", value: "delivered" },
  { label: "Đã hủy", value: "cancelled" },
] as const;

const statusLabel = (v: string) => ORDER_STATUS.find((s) => s.value === v)?.label ?? v;

/** Hoàn kho khi hủy, cộng điểm khi giao xong, tạo thông báo cho khách khi đổi trạng thái */
const afterStatusChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req, operation }) => {
  if (operation !== "update" || doc.status === previousDoc?.status) return doc;
  const { payload } = req;

  if (doc.status === "cancelled" && !doc.restocked) {
    for (const item of doc.items ?? []) {
      const productId = typeof item.product === "object" ? item.product?.id : item.product;
      if (!productId) continue;
      const product = await payload.findByID({ collection: "products", id: productId, depth: 0, draft: true, req });
      const variants = (product.variants ?? []).map((v) =>
        v.color === item.color && v.size === item.size ? { ...v, stock: (v.stock ?? 0) + item.qty } : v,
      );
      await payload.update({ collection: "products", id: productId, data: { variants }, req, context: { disableRevalidate: false } });
    }
    await payload.update({ collection: "orders", id: doc.id, data: { restocked: true }, req, context: { skipStatusHook: true } });
  }

  const customerId = typeof doc.customer === "object" ? doc.customer?.id : doc.customer;
  if (customerId) {
    if (doc.status === "delivered" && !doc.pointsAwarded) {
      const points = Math.floor(doc.total / 10000);
      const customer = await payload.findByID({ collection: "customers", id: customerId, depth: 0, req });
      await payload.update({ collection: "customers", id: customerId, data: { points: (customer.points ?? 0) + points }, req });
      await payload.create({
        collection: "loyalty-transactions",
        data: { customer: customerId, points, label: `Đơn hàng #${doc.code}`, order: doc.id },
        req,
      });
      await payload.update({ collection: "orders", id: doc.id, data: { pointsAwarded: true }, req, context: { skipStatusHook: true } });
    }
    await payload.create({
      collection: "notifications",
      data: {
        customer: customerId,
        title: `Đơn hàng #${doc.code}: ${statusLabel(doc.status)}`,
        body: "Trạng thái đơn hàng của bạn vừa được cập nhật.",
        ctaLabel: "Xem đơn hàng",
        ctaHref: "/tai-khoan/lich-su-don-hang",
      },
      req,
    });
  }
  return doc;
};

export const Orders: CollectionConfig = {
  slug: "orders",
  labels: { singular: "Đơn hàng", plural: "Đơn hàng" },
  admin: {
    useAsTitle: "code",
    group: "Bán hàng",
    defaultColumns: ["code", "shipping.name", "total", "paymentMethod", "paymentStatus", "status", "createdAt"],
    listSearchableFields: ["code", "email", "shipping.phone"],
  },
  defaultSort: "-createdAt",
  // Đơn chỉ được tạo bởi server (tính giá phía server); khách chỉ đọc đơn của mình
  access: { read: ownCustomerOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  hooks: {
    afterChange: [
      (args) => (args.context?.skipStatusHook ? args.doc : afterStatusChange(args)),
    ],
  },
  fields: [
    { name: "code", label: "Mã đơn", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "customer", label: "Khách hàng", type: "relationship", relationTo: "customers", index: true },
    {
      type: "row",
      fields: [
        { name: "email", label: "Email", type: "email", required: true },
        {
          name: "status",
          label: "Trạng thái",
          type: "select",
          required: true,
          defaultValue: "pending",
          options: ORDER_STATUS.map((s) => ({ ...s })),
        },
      ],
    },
    {
      name: "shipping",
      label: "Giao hàng",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "name", label: "Người nhận", type: "text", required: true },
            { name: "phone", label: "Điện thoại", type: "text", required: true, index: true },
          ],
        },
        { name: "line", label: "Địa chỉ", type: "text", required: true },
        {
          type: "row",
          fields: [
            { name: "ward", label: "Phường / Xã", type: "text", required: true },
            { name: "province", label: "Tỉnh / Thành phố", type: "text", required: true },
          ],
        },
        { name: "note", label: "Ghi chú", type: "textarea" },
      ],
    },
    {
      name: "items",
      label: "Sản phẩm",
      type: "array",
      required: true,
      minRows: 1,
      admin: { readOnly: true },
      fields: [
        { name: "product", type: "relationship", relationTo: "products" },
        { name: "name", type: "text", required: true },
        { name: "slug", type: "text" },
        { name: "image", type: "text" },
        {
          type: "row",
          fields: [
            { name: "color", type: "text", required: true },
            { name: "size", type: "text", required: true },
            { name: "price", type: "number", required: true },
            { name: "qty", type: "number", required: true, min: 1 },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "subtotal", label: "Tạm tính", type: "number", required: true, admin: { readOnly: true } },
        { name: "shippingFee", label: "Phí giao hàng", type: "number", defaultValue: 0, admin: { readOnly: true } },
        { name: "total", label: "Tổng cộng", type: "number", required: true, admin: { readOnly: true } },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "paymentMethod",
          label: "Thanh toán",
          type: "select",
          required: true,
          options: [
            { label: "COD", value: "cod" },
            { label: "VNPay", value: "vnpay" },
            { label: "MoMo", value: "momo" },
          ],
        },
        {
          name: "paymentStatus",
          label: "Tình trạng thanh toán",
          type: "select",
          defaultValue: "unpaid",
          options: [
            { label: "Chưa thanh toán", value: "unpaid" },
            { label: "Đã thanh toán", value: "paid" },
            { label: "Thất bại", value: "failed" },
            { label: "Đã hoàn tiền", value: "refunded" },
          ],
        },
      ],
    },
    {
      name: "invoice",
      label: "Xuất hóa đơn công ty",
      type: "group",
      admin: { condition: (data) => Boolean(data?.invoice?.requested) },
      fields: [
        { name: "requested", label: "Khách yêu cầu hóa đơn công ty", type: "checkbox", defaultValue: false },
        { name: "companyName", label: "Tên công ty", type: "text" },
        {
          type: "row",
          fields: [
            { name: "taxCode", label: "Mã số thuế", type: "text" },
            { name: "email", label: "Email nhận hóa đơn", type: "email" },
          ],
        },
        { name: "address", label: "Địa chỉ công ty", type: "text" },
      ],
    },
    {
      name: "consent",
      label: "Đồng ý điều khoản",
      type: "group",
      admin: { readOnly: true, description: "Bằng chứng khách đã đồng ý điều kiện giao dịch chung khi đặt hàng." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "termsAcceptedAt", label: "Thời điểm đồng ý", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
            { name: "policyVersions", label: "Phiên bản chính sách lúc đó", type: "text" },
          ],
        },
      ],
    },
    {
      name: "transactions",
      label: "Nhật ký giao dịch",
      type: "array",
      admin: { readOnly: true },
      access: { read: ({ req }) => req.user?.collection === "users" },
      fields: [
        { name: "provider", type: "text" },
        { name: "ref", type: "text" },
        { name: "amount", type: "number" },
        { name: "result", type: "text" },
        { name: "at", type: "date" },
        { name: "raw", type: "json" },
      ],
    },
    { name: "restocked", type: "checkbox", defaultValue: false, admin: { hidden: true } },
    { name: "pointsAwarded", type: "checkbox", defaultValue: false, admin: { hidden: true } },
  ],
};

export const LoyaltyTransactions: CollectionConfig = {
  slug: "loyalty-transactions",
  labels: { singular: "Giao dịch điểm", plural: "Lịch sử điểm" },
  admin: { useAsTitle: "label", group: "Khách hàng", defaultColumns: ["customer", "label", "points", "createdAt"] },
  defaultSort: "-createdAt",
  access: { read: ownCustomerOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: "customer", type: "relationship", relationTo: "customers", required: true, index: true },
    { name: "label", label: "Nội dung", type: "text", required: true },
    { name: "points", label: "Điểm (+/-)", type: "number", required: true },
    { name: "order", type: "relationship", relationTo: "orders" },
  ],
};

export const Notifications: CollectionConfig = {
  slug: "notifications",
  labels: { singular: "Thông báo", plural: "Thông báo" },
  admin: { useAsTitle: "title", group: "Khách hàng", defaultColumns: ["customer", "title", "readAt", "createdAt"] },
  defaultSort: "-createdAt",
  // Đánh dấu đã đọc / xóa đi qua server action kiểm tra chủ sở hữu
  access: { read: ownCustomerOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: "customer", type: "relationship", relationTo: "customers", required: true, index: true },
    { name: "title", label: "Tiêu đề", type: "text", required: true },
    { name: "body", label: "Nội dung", type: "textarea", required: true },
    {
      type: "row",
      fields: [
        { name: "ctaLabel", label: "Nhãn liên kết", type: "text" },
        { name: "ctaHref", label: "Liên kết (đường dẫn nội bộ)", type: "text", validate: (v: unknown) => (!v || (typeof v === "string" && v.startsWith("/") && !v.startsWith("//")) ? true : "Chỉ dùng đường dẫn nội bộ, bắt đầu bằng /") },
      ],
    },
    { name: "readAt", label: "Đã đọc lúc", type: "date" },
  ],
};
