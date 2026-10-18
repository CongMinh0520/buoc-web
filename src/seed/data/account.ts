import { img } from "./images";

export const user = {
  name: "Minh Anh",
  gender: "Nữ",
  email: "",
  phone: "",
  points: 1240,
  tier: "Thành viên Bạc",
};

export type OrderStatus = "processing" | "shipping" | "delivered" | "cancelled";

export const orderStatusLabel: Record<OrderStatus, string> = {
  processing: "Đang xử lý",
  shipping: "Đang giao hàng",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
};

export const orders = [
  {
    id: "#BU26100412",
    date: "04/10/2026",
    status: "shipping" as OrderStatus,
    payment: "Thẻ ATM",
    address: {
      name: "TRẦN MINH ANH — 0912 345 678",
      line: "48 Phạm Ngọc Thạch, phường Xuân Hòa, TP. Hồ Chí Minh",
    },
    items: [
      {
        name: "Oxford Hàng Ngang",
        price: 6900000,
        qty: 1,
        image: img.p.oxfordA,
        note: "Màu Nâu cognac · Size 41 · Khắc tên miễn phí trên lót giày.",
      },
      {
        name: "Sandal Quai Chéo",
        price: 2400000,
        qty: 1,
        image: img.p.crossSandalA,
        note: "Màu Đen · Size 41 · Da bò thuộc thực vật, quai đan tay.",
      },
    ],
  },
  {
    id: "#BU26091877",
    date: "18/09/2026",
    status: "delivered" as OrderStatus,
    payment: "COD",
    address: {
      name: "TRẦN MINH ANH — 0912 345 678",
      line: "48 Phạm Ngọc Thạch, phường Xuân Hòa, TP. Hồ Chí Minh",
    },
    items: [
      {
        name: "Pump Sen Hạ",
        price: 5600000,
        qty: 1,
        image: img.p.pumpSenHa,
        note: "Màu Hoa sen · Size 37 · Bộ sưu tập Sen Hạ ’26.",
      },
    ],
  },
  {
    id: "#BU26080320",
    date: "03/08/2026",
    status: "cancelled" as OrderStatus,
    payment: "Ví điện tử",
    address: {
      name: "TRẦN MINH ANH — 0912 345 678",
      line: "12 Tôn Đức Thắng, phường Sài Gòn, TP. Hồ Chí Minh",
    },
    items: [
      {
        name: "Chelsea Mưa Ngâu",
        price: 7200000,
        qty: 1,
        image: img.p.chelseaA,
        note: "Màu Đen · Size 42.",
      },
    ],
  },
];

export const addresses = [
  {
    label: "Địa chỉ mặc định",
    isDefault: true,
    name: "TRẦN MINH ANH",
    line: "48 PHẠM NGỌC THẠCH, PHƯỜNG XUÂN HÒA, TP. HỒ CHÍ MINH",
    phone: "0912 345 678",
  },
  {
    label: "Văn phòng",
    isDefault: false,
    name: "TRẦN MINH ANH",
    line: "12 TÔN ĐỨC THẮNG, PHƯỜNG SÀI GÒN, TP. HỒ CHÍ MINH",
    phone: "0987 654 321",
  },
];
