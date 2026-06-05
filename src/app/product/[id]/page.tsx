"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  CheckCircle,
  ArrowLeft,
  Package,
  Shield,
  Truck,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import ProductCard from "../../../components/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { getProductById, getRelatedProducts } from "../../../lib/sampleProducts";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const { id } = use(params);
  const product = getProductById(id);

  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const addToCart = useCartStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);
  const [qty] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stockColor =
    product.stock === 0
      ? "text-red-500"
      : product.stock < 10
      ? "text-orange-500"
      : "text-emerald-600";

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-400">{product.category}</span>
          <span>/</span>
          <span className="text-slate-700 font-medium line-clamp-1 max-w-[200px]">
            {product.title}
          </span>
        </nav>

        {/* Main product section */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:p-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50"
            >
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 shadow-sm backdrop-blur-sm">
                  {product.category}
                </Badge>
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col"
            >
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : i < product.rating
                          ? "fill-amber-200 text-amber-300"
                          : "fill-slate-100 text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-sm text-slate-400">
                  ({Math.floor(product.rating * 230)} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-end gap-3">
                <span className="text-4xl font-extrabold text-slate-900">
                  ₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Stock */}
              <p className={`mt-2 text-sm font-medium ${stockColor}`}>
                {product.stock === 0
                  ? "Out of Stock"
                  : product.stock < 10
                  ? `Only ${product.stock} left in stock`
                  : "In Stock"}
              </p>

              {/* Description */}
              <p className="mt-5 text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Perks */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: "Free Shipping", sub: "On orders ₹8300+" },
                  { icon: Shield, label: "Warranty", sub: "1 year included" },
                  { icon: Package, label: "Easy Returns", sub: "30-day policy" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center rounded-xl bg-slate-50 p-3 text-center">
                    <Icon className="h-5 w-5 text-[#ffe500] mb-1" />
                    <span className="text-xs font-semibold text-slate-700">{label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{sub}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 flex gap-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 gap-2 font-semibold transition-all duration-300 ${
                    added ? "bg-emerald-500 hover:bg-emerald-500" : ""
                  }`}
                >
                  {added ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Link href="/cart">
                  <Button size="lg" variant="outline" className="font-semibold px-6">
                    View Cart
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
