"use client";

import Link from "next/link";
import { motion, easeOut, type Variants } from "framer-motion";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { Button } from "./ui/button";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2874f0] via-blue-600 to-[#2874f0] py-20 md:py-28">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#ffe500]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#ffe500]/10 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        {/* Grid pattern */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          {/* Pill badge */}
          <motion.div variants={item}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffe500]/30 bg-[#ffe500]/10 px-4 py-1.5 text-sm text-[#ffe500]">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Shopping Assistant
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Shop Smarter with{" "}
            <span className="bg-gradient-to-r from-[#ffe500] to-[#ff9f00] bg-clip-text text-transparent">
              Flipkart Genie
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl"
          >
            Your AI-powered shopping assistant that understands what you want,
            compares options intelligently, and finds the perfect product every time.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="#products">
              <Button size="lg" className="gap-2 px-8 text-base font-semibold shadow-lg shadow-[#ff9f00]/25 bg-[#ff9f00] text-white hover:bg-[#fb641b]">
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/genie">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-8 text-base font-semibold border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <Zap className="h-4 w-4 text-[#ffe500]" />
                Ask Genie
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-10"
          >
            {[
              { value: "300+", label: "Premium Products" },
              { value: "7", label: "Categories" },
              { value: "4.7★", label: "Avg Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[#ffe500] sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
