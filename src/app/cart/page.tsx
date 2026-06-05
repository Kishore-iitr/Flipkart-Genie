"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Trash2, Sparkles } from "lucide-react";
import { Button } from "../../components/ui/button";
import CartItem from "../../components/CartItem";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, clearCart, totalItems, totalPrice } = useCartStore();
  const count = totalItems();
  const total = totalPrice();
  const shipping = total > 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const orderTotal = total + shipping + tax;

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Shopping Cart
            </h1>
            <p className="text-slate-500">
              {count} item{count !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {count === 0 ? (
          // Empty cart
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-24 text-center"
          >
            <ShoppingBag className="mb-4 h-12 w-12 text-slate-300" />
            <h2 className="text-xl font-semibold text-slate-700">
              Your cart is empty
            </h2>
            <p className="mt-2 text-slate-500">
              Add some products and come back here
            </p>
            <Link href="/" className="mt-6">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Browse Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500">
                  {count} item{count !== 1 ? "s" : ""} in your cart
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear all
                </Button>
              </div>

              <AnimatePresence>
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-bold text-slate-900 mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({count} items)</span>
                    <span>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-600 font-medium">FREE</span>
                      ) : (
                        `₹${shipping.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax (8%)</span>
                    <span>₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                      Add ₹{(100 * 83 - total).toLocaleString("en-IN", { minimumFractionDigits: 2 })} more for free shipping!
                    </p>
                  )}

                  <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between font-bold text-base text-slate-900">
                    <span>Total</span>
                    <span>₹{orderTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block w-full mt-6">
                  <Button className="w-full bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-medium py-6 rounded-xl shadow-sm transition-all active:scale-[0.98]">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/genie" className="block mt-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full text-sm gap-2 border-blue-200 text-[#2874f0] hover:bg-blue-50"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Ask Genie for help
                  </Button>
                </Link>

                <p className="mt-4 text-center text-xs text-slate-400">
                  Secure checkout · 30-day returns
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
