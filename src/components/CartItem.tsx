"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cartStore";
import { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
    >
      {/* Image */}
      <Link href={`/product/${item.id}`} className="shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-slate-50 sm:h-24 sm:w-24">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${item.id}`}
            className="line-clamp-2 text-sm font-semibold text-slate-800 hover:text-amber-600 transition-colors"
          >
            {item.title}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFromCart(item.id)}
            className="h-7 w-7 shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <span className="text-xs text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 w-fit">
          {item.category}
        </span>

        <div className="flex items-center justify-between mt-auto">
          {/* Quantity controls */}
          <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-slate-900">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <div className="text-sm font-bold text-slate-900">
              ₹{(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            {item.quantity > 1 && (
              <div className="text-xs text-slate-400">
                ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })} each
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
