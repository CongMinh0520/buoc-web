"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  /** Mã màu nội bộ (khớp tồn kho) */
  color: string;
  /** Tên màu hiển thị theo ngôn ngữ lúc thêm vào giỏ */
  colorLabel?: string;
  size: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  lastAdded: CartItem | null;
  dismissToast: () => void;
};

const STORAGE_KEY = "buoc-cart-v1";
export const cartKey = (i: Pick<CartItem, "slug" | "color" | "size">) => `${i.slug}|${i.color}|${i.size}`;

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  // Đọc giỏ hàng đã lưu (chỉ chạy trên trình duyệt)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ một lần từ localStorage
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* bỏ qua: chế độ ẩn danh hoặc dữ liệu hỏng */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* bỏ qua */
    }
  }, [items, ready]);

  const add = useCallback<CartContextValue["add"]>((item, qty = 1) => {
    setItems((prev) => {
      const key = cartKey(item);
      const found = prev.find((p) => cartKey(p) === key);
      if (found) return prev.map((p) => (cartKey(p) === key ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { ...item, qty }];
    });
    setLastAdded({ ...item, qty });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((p) => cartKey(p) !== key) : prev.map((p) => (cartKey(p) === key ? { ...p, qty } : p)),
    );
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((p) => cartKey(p) !== key)), []);
  const clear = useCallback(() => setItems([]), []);
  const dismissToast = useCallback(() => setLastAdded(null), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
      add,
      setQty,
      remove,
      clear,
      lastAdded,
      dismissToast,
    }),
    [items, ready, add, setQty, remove, clear, lastAdded, dismissToast],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải dùng bên trong <CartProvider>");
  return ctx;
}
