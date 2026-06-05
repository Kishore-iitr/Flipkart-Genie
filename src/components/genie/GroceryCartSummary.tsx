import { useGroceryCartStore } from "@/store/groceryCartStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, Trash2, Minus, Plus } from "lucide-react";
import Image from "next/image";

export function GroceryCartSummary() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useGroceryCartStore();

  if (items.length === 0) return null;

  return (
    <div className="bg-card text-card-foreground border rounded-xl shadow-sm overflow-hidden flex flex-col h-full max-h-[50vh]">
      <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShoppingBasket className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Grocery Cart ({totalItems()})</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground hover:text-destructive h-8 px-2">
          <Trash2 className="w-4 h-4 mr-1" /> Clear
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 text-sm items-center">
            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-muted">
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/100x100/1e293b/ffffff?text=${encodeURIComponent(item.title[0])}`
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.title}</p>
              <p className="text-primary font-semibold">₹{item.price.toLocaleString("en-IN")}</p>
            </div>
            
            <div className="flex items-center gap-2 bg-muted/50 rounded-full border px-1 py-0.5">
              <button 
                onClick={() => item.cartQuantity > 1 ? updateQuantity(item.id, item.cartQuantity - 1) : removeFromCart(item.id)}
                className="p-1 hover:bg-background rounded-full transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-4 text-center font-medium text-xs">{item.cartQuantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                className="p-1 hover:bg-background rounded-full transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-muted/50 space-y-3">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-primary">₹{totalPrice().toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        <Link href="/checkout" className="block w-full">
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all">
            Checkout Grocery Basket
          </Button>
        </Link>
      </div>
    </div>
  );
}
