"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useGroceryCartStore } from "@/store/groceryCartStore";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const { items: standardItems, totalPrice: standardTotal, clearCart: clearStandardCart } = useCartStore();
  const { items: groceryItems, totalPrice: groceryTotal, clearCart: clearGroceryCart } = useGroceryCartStore();
  
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalAmount = standardTotal() + groceryTotal();
  const tax = totalAmount * 0.08; // 8% tax example
  const shipping = totalAmount > 1000 ? 0 : 50;
  const grandTotal = totalAmount + tax + shipping;

  const hasItems = standardItems.length > 0 || groceryItems.length > 0;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Simulate network delay for payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearStandardCart();
      clearGroceryCart();
    }, 2500);
  };

  if (!mounted) return null;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Placed!</h1>
          <p className="text-slate-500 mb-8">
            Your payment was successful and your order is being processed. 
            You will receive a confirmation email shortly.
          </p>
          <Button onClick={() => router.push('/')} className="w-full bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-medium">
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <Link href="/cart" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
        </Link>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Secure Checkout</h1>

        {!hasItems ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-200">
            <p className="text-slate-500 mb-4">Your cart is empty.</p>
            <Button onClick={() => router.push('/')}>Go Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Order Summary Items */}
            <div className="md:col-span-2 space-y-6">
              {standardItems.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between border-b pb-4">
                    <span>Standard Items</span>
                    <span className="text-sm font-medium text-slate-500">{standardItems.length} items</span>
                  </h2>
                  <div className="space-y-4">
                    {standardItems.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg border" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 truncate">{item.title}</h3>
                          <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-semibold text-slate-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {groceryItems.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                  <h2 className="text-lg font-bold text-emerald-900 mb-4 flex items-center justify-between border-b border-emerald-100 pb-4">
                    <span>Grocery Items</span>
                    <span className="text-sm font-medium text-emerald-600">{groceryItems.length} items</span>
                  </h2>
                  <div className="space-y-4">
                    {groceryItems.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg border" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 truncate">{item.title}</h3>
                          <p className="text-sm text-slate-500">{item.brand} • {item.quantity} {item.unit} x {item.cartQuantity}</p>
                        </div>
                        <div className="font-semibold text-slate-900">
                          ₹{(item.price * item.cartQuantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bill Summary Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Bill Summary</h2>
                
                <div className="space-y-3 text-sm text-slate-600 mb-6">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-medium text-slate-900">₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-medium text-slate-900">₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-slate-900">{shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg text-slate-900">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 text-lg font-medium bg-[#fb641b] hover:bg-[#fb641b]/90 text-white shadow-md relative overflow-hidden transition-all"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</span>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
