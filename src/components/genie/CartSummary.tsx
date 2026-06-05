import { CartItem } from "@/types";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartSummary({ cart }: { cart: CartItem[] }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) return null;

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center gap-2 font-semibold mb-4 border-b pb-2">
        <ShoppingCart className="w-5 h-5" />
        <h2>Your Cart ({cart.length} items)</h2>
      </div>
      <div className="space-y-3">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="truncate pr-4 text-muted-foreground">
              {item.quantity}x {item.title}
            </span>
            <span className="font-medium whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t flex justify-between items-center font-bold">
        <span>Total:</span>
        <span className="text-lg text-primary">₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
      </div>
      <Link href="/checkout" className="block w-full mt-4">
        <Button className="w-full">Checkout</Button>
      </Link>
    </div>
  );
}
