"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Bot, User, ArrowLeft, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GenieMessage, Product, CartItem } from "@/types";
import { RecommendationCard } from "@/components/genie/RecommendationCard";
import { CartSummary } from "@/components/genie/CartSummary";
import { ReasoningPanel } from "@/components/genie/ReasoningPanel";

const QUICK_PROMPTS = [
  "Build an autonomous drone under ₹50000",
  "Gaming setup recommendations",
  "Camera for travel photography",
  "Home office essentials",
];

import { useCartStore } from "@/store/cartStore";
import { ImagePlus, Trash2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function GeniePage() {
  const { items: cart, addToCart: handleAddToCart, clearCart: clearGlobalCart, setItems: setGlobalCart } = useCartStore();
  
  const [messages, setMessages] = useState<GenieMessage[]>([{
    id: "1",
    role: "assistant",
    content: "👋 Hi! I'm Flipkart Genie, your AI-powered shopping assistant. I can help you find the perfect product, compare options, and make smarter purchase decisions.",
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [reasoning, setReasoning] = useState<string>("");
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef(`conv_${Math.random().toString(36).substring(7)}`).current;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, products, cart]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: "assistant",
      content: "Chat cleared! How can I help you today?",
      timestamp: new Date()
    }]);
    setProducts([]);
    setReasoning("");
    setSelectedImage(null);
  };

  const sendMessage = async (text: string) => {
    if ((!text.trim() && !selectedImage) || isTyping) return;

    const userMessage: GenieMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const res = await fetch("/api/genie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage], 
          cart,
          conversationId 
        }),
      });
      
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      const botMsg: GenieMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Here is what I found for you.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
      setProducts(data.products || []);
      if (data.cart) {
        setGlobalCart(data.cart);
      }
      setReasoning(data.reasoning || "");
      
    } catch (error) {
      console.error(error);
      const errorMsg: GenieMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReplace = (product: Product) => {
    sendMessage(`Please replace ${product.title} with another similar option.`);
  };

  return (
    <div className="flex h-screen flex-col bg-[#f1f3f6]">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 shrink-0 z-10 shadow-sm">
        <div className="mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 hover:bg-slate-100 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffe500] shadow-sm shadow-[#ffe500]/30">
              <Sparkles className="h-4 w-4 text-[#2874f0]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900">Flipkart Genie</h1>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-500 font-medium">Online (AI Powered)</span>
              </div>
            </div>
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="sm" onClick={clearChat} className="text-slate-500 hover:text-red-500">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Chat + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Chat Area (Left) */}
        <div className="flex flex-1 flex-col relative h-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-6 pb-40 px-4 sm:px-6">
            <div className="mx-auto max-w-4xl space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        message.role === "assistant"
                          ? "bg-[#ffe500] shadow-sm"
                          : "bg-slate-800 shadow-sm"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4 text-[#2874f0]" />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm flex flex-col gap-2 ${
                        message.role === "assistant"
                          ? "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"
                          : "bg-slate-800 text-white rounded-tr-sm"
                      }`}
                    >
                      {message.image && (
                        <img 
                          src={message.image} 
                          alt="Uploaded" 
                          className="max-w-full h-auto rounded-lg max-h-48 object-cover mb-1 border border-slate-700"
                        />
                      )}
                      {message.content && (
                        <div className={`prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-50 ${
                          message.role === "assistant" ? "prose-slate" : "prose-invert"
                        }`}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffe500] shadow-sm">
                      <Bot className="h-4 w-4 text-[#2874f0]" />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center">
                      <div className="flex gap-1.5 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            className="h-2 w-2 rounded-full bg-[#2874f0]"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} className="h-4" />
            </div>
          </div>

          {/* Floating Input Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-10 pb-6 px-4">
            <div className="mx-auto max-w-4xl">
              
              {/* Quick Prompts */}
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none justify-center">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    disabled={isTyping}
                    className="shrink-0 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-xs font-medium text-slate-600 shadow-sm hover:border-[#2874f0] hover:bg-blue-50 hover:text-[#2874f0] transition-all active:scale-95 disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="relative rounded-2xl shadow-lg bg-white border border-slate-200 overflow-hidden flex flex-col transition-shadow focus-within:shadow-xl focus-within:border-[#2874f0]">
                {selectedImage && (
                  <div className="relative w-fit mx-4 mt-4 mb-1">
                    <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border shadow-sm" />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 shadow hover:bg-slate-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex relative items-end">
                  <div className="pl-3 pb-3 pt-3 flex items-center shrink-0">
                    <label className="cursor-pointer p-2 rounded-xl text-slate-400 hover:text-[#2874f0] hover:bg-blue-50 transition-colors inline-block">
                      <ImagePlus className="w-5 h-5" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isTyping} />
                    </label>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Ask Genie anything or upload an image..."
                    className="flex-1 resize-none bg-transparent py-4 pl-2 pr-14 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none min-h-[56px] max-h-32 scrollbar-thin"
                    rows={1}
                    disabled={isTyping}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 bottom-2 h-10 w-10 rounded-xl bg-[#2874f0] text-white hover:bg-blue-700 disabled:opacity-50 transition-transform active:scale-95"
                  >
                    {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-1" />}
                  </Button>
                </form>
              </div>
              <p className="mt-3 text-center text-[11px] text-slate-400 font-medium">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Area (Right) for Products & Cart */}
        <div className="w-1/3 min-w-[320px] max-w-md border-l border-slate-200 bg-white shadow-xl flex flex-col z-20 hidden lg:flex">
          <div className="border-b px-4 py-3 bg-slate-50 flex items-center gap-2">
            <Info className="h-4 w-4 text-[#2874f0]" />
            <h2 className="text-sm font-bold text-slate-700">Genie's Recommendations</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {(!reasoning && products.length === 0 && cart.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3 px-6">
                <Sparkles className="h-8 w-8 text-slate-200" />
                <p className="text-sm">Tell me what you are looking for, and I will find the best options and build a cart for you!</p>
              </div>
            ) : (
              <>
                <ReasoningPanel reasoning={reasoning} />
                
                {products.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-slate-800 uppercase tracking-wider">Top Picks</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {products.map(p => (
                        <RecommendationCard 
                          key={p.id} 
                          product={p} 
                          onAddToCart={handleAddToCart}
                          onReplace={handleReplace}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="p-4 border-t bg-slate-50 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)]">
              <CartSummary cart={cart} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
