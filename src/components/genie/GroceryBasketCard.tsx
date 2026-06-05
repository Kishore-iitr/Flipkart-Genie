import { GroceryProduct } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import { useGroceryCartStore } from "@/store/groceryCartStore";
import { useState } from "react";

export function GroceryBasketCard({ 
  recipeName, 
  basket 
}: { 
  recipeName: string;
  basket: GroceryProduct[] 
}) {
  const { addToCart } = useGroceryCartStore();
  const [addedAll, setAddedAll] = useState(false);

  const addAllToBasket = () => {
    basket.forEach(item => addToCart(item, 1));
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  const totalCost = basket.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-card text-card-foreground border rounded-xl p-4 shadow-sm space-y-4 w-full">
      <div className="flex justify-between items-center pb-2 border-b">
        <div className="flex items-center gap-2">
          <ShoppingBasket className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">{recipeName || "Your Grocery Basket"}</h3>
        </div>
        <div className="font-bold text-lg text-primary">
          ₹{totalCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {basket.map((item) => (
          <div key={item.id} className="flex gap-3 items-center text-sm border-b pb-2 last:border-0 last:pb-0">
            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-muted">
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
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.brand} • {item.quantity}{item.unit}
              </p>
            </div>
            <div className="font-semibold text-right">
              <div className="text-primary">₹{item.price.toLocaleString("en-IN")}</div>
              {item.stock < 10 && <div className="text-[10px] text-destructive">Only {item.stock} left</div>}
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full flex-shrink-0 bg-primary/10 hover:bg-primary/20 text-primary"
              onClick={() => addToCart(item, 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button 
        className="w-full" 
        onClick={addAllToBasket}
        disabled={addedAll}
      >
        {addedAll ? "Added to Cart ✓" : "Add All To Basket"}
      </Button>
    </div>
  );
}
