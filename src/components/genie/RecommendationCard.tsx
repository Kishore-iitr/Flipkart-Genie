import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart, RefreshCw, Info } from "lucide-react";
import Image from "next/image";

interface RecommendationCardProps {
  product: Product;
  onAddToCart?: (p: Product) => void;
  onReplace?: (p: Product) => void;
}

export function RecommendationCard({ product, onAddToCart, onReplace }: RecommendationCardProps) {
  return (
    <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="relative h-48 w-full bg-muted">
        {/* We use standard img for simplicity here if domains aren't configured in next.config.js */}
        <img
          src={product.image}
          alt={product.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            let fallback = 'gaming.png';
            if (product.category === 'Drone Components') fallback = 'drone_components.png';
            else if (product.category === 'AI & Robotics') fallback = 'ai_robotics.png';
            else if (product.category === 'Photography') fallback = 'photography.png';
            else if (product.category === 'Gaming') fallback = 'gaming.png';
            else if (product.category === 'Fitness') fallback = 'fitness.png';
            else if (product.category === 'Books') fallback = 'books.png';
            else if (product.category === 'Home Office') fallback = 'home_office.png';
            target.src = `/images/category/${fallback}`;
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow gap-2">
        <h3 className="font-semibold text-sm line-clamp-2">{product.title}</h3>
        <p className="text-xl font-bold">₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1">⭐ {product.rating}</span>
          <span>•</span>
          <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </span>
        </div>
        <div className="mt-auto pt-4 flex gap-2">
          <Button size="sm" className="flex-1 text-xs" onClick={() => onAddToCart?.(product)}>
            <ShoppingCart className="w-3 h-3 mr-1" /> Add
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => onReplace?.(product)}>
            <RefreshCw className="w-3 h-3 mr-1" /> Replace
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
