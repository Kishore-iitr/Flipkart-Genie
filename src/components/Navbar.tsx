"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Sparkles, Search, Menu, X, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCartStore } from "@/store/cartStore";
import { SettingsModal } from "./SettingsModal";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();
  const totalItems = useCartStore((s) => s.totalItems)();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#2874f0]/95 backdrop-blur-md shadow-lg shadow-[#2874f0]/20"
          : "bg-[#2874f0]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffe500]">
              <Sparkles className="h-4 w-4 text-[#2874f0]" />
            </div>
            <span className="hidden sm:block font-bold text-white text-lg tracking-tight">
              Flipkart<span className="text-[#ffe500]"> Genie</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium ml-4">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">Shop</Link>
            <Link href="/groceries" className="text-slate-300 hover:text-white transition-colors">Groceries</Link>
          </div>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories, brands…"
                className="pr-12 h-10 bg-white border-0 rounded-xl text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md bg-[#2874f0] hover:bg-blue-600 transition-colors"
              >
                <Search className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </form>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <Link href="/genie">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 gap-2">
                <Sparkles className="h-4 w-4 text-[#ffe500]" />
                Ask Genie
              </Button>
            </Link>
            <Link href="/grocery-genie">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-emerald-500/20 gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Grocery Genie
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} className="text-slate-300 hover:text-white hover:bg-white/10 ml-2">
              <Settings className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-white/10">
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {mounted && totalItems > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffe500] text-[#2874f0] text-[10px] font-bold"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} className="text-slate-300 hover:text-white hover:bg-white/10">
              <Settings className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-white/10">
                <ShoppingCart className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffe500] text-[#2874f0] text-[10px] font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:text-white hover:bg-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-[#2874f0] overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 space-y-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products…"
                    className="pr-12 bg-white border-0 text-slate-900"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md bg-[#2874f0]"
                  >
                    <Search className="h-3.5 w-3.5 text-white" />
                  </button>
                </div>
              </form>
              <Link href="/genie" onClick={() => setMobileOpen(false)}>
                <Button className="w-full gap-2 bg-[#ffe500] hover:bg-[#ffe500]/90 text-[#2874f0]">
                  <Sparkles className="h-4 w-4" />
                  Ask Genie
                </Button>
              </Link>
              <Link href="/grocery-genie" onClick={() => setMobileOpen(false)}>
                <Button className="w-full gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 mt-2">
                  <Sparkles className="h-4 w-4" />
                  Grocery Genie
                </Button>
              </Link>
              <div className="flex gap-2 pt-2 border-t border-white/10 mt-2">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full text-slate-900">Shop</Button>
                </Link>
                <Link href="/groceries" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full text-slate-900">Groceries</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </motion.header>
  );
}
