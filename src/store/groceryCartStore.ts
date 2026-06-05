import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GroceryProduct, GroceryCartItem } from "@/types";

interface GroceryCartState {
  items: GroceryCartItem[];
  addToCart: (product: GroceryProduct, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, cartQuantity: number) => void;
  clearCart: () => void;
  setItems: (items: GroceryCartItem[]) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useGroceryCartStore = create<GroceryCartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, cartQuantity: item.cartQuantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...product, cartQuantity: quantity }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, cartQuantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, cartQuantity: Math.max(1, cartQuantity) } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      setItems: (items) => set({ items }),
      totalItems: () => get().items.reduce((sum, item) => sum + item.cartQuantity, 0),
      totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.cartQuantity, 0),
    }),
    {
      name: "flipkart-genie-grocery-cart",
    }
  )
);
