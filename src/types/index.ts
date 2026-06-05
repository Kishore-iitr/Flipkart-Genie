export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface GroceryProduct {
  id: string;
  title: string;
  brand: string;
  category: string;
  quantity: number; // e.g. 500 for 500g
  unit: string; // e.g. 'g', 'kg', 'ml', 'L', 'pack'
  price: number;
  stock: number;
  image: string;
  tags: string;
  substitutes: string;
}

export interface GroceryCartItem extends GroceryProduct {
  cartQuantity: number;
}

export interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export interface GenieMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: Date;
}

export type Category =
  | "Drone"
  | "Electronics"
  | "Photography"
  | "Gaming"
  | "Fitness"
  | "Books"
  | "Home Office";
