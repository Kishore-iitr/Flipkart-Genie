"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const stockStatus =
    product.stock === 0
      ? "Out of Stock"
      : product.stock < 10
      ? `Only ${product.stock} left`
      : "In Stock";

  const stockColor =
    product.stock === 0
      ? "text-red-500"
      : product.stock < 10
      ? "text-orange-500"
      : "text-emerald-600";

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-slate-200/60 group-hover:border-slate-200">
          {/* Image */}
          <div className="relative overflow-hidden bg-slate-50 aspect-[4/3]">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                target.srcset = '';
              }}
            />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="text-xs bg-white/90 text-slate-700 shadow-sm backdrop-blur-sm">
                {product.category}
              </Badge>
            </div>
            {product.stock < 10 && product.stock > 0 && (
              <div className="absolute top-3 right-3">
                <Badge className="text-xs bg-orange-500 text-white">
                  Low Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-4">
            <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 leading-snug mb-1 group-hover:text-amber-600 transition-colors">
              {product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : i < product.rating
                        ? "fill-amber-200 text-amber-300"
                        : "fill-slate-100 text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">{product.rating.toFixed(1)}</span>
            </div>

            <div className="mt-auto space-y-3">
              {/* Price & stock */}
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-lg font-bold text-slate-900">
                    ₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <span className={`text-xs font-medium ${stockColor}`}>
                  {stockStatus}
                </span>
              </div>

              {/* Add to cart */}
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full gap-2 text-xs font-semibold h-9 transition-all duration-300 ${
                  added
                    ? "bg-emerald-500 hover:bg-emerald-500 text-white shadow-emerald-500/25"
                    : ""
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
