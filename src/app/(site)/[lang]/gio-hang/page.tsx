import { CartView } from "@/components/cart/CartView";

export const metadata = { title: "Giỏ hàng" };

export default function CartPage() {
  return (
    <div className="bg-paper pb-24">
      <CartView />
    </div>
  );
}
