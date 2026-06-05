"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Bot, User, ArrowLeft, Loader2, Info, ShoppingBasket, ImagePlus, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GenieMessage, GroceryProduct } from "@/types";
import { ReasoningPanel } from "@/components/genie/ReasoningPanel";
import { GroceryBasketCard } from "@/components/genie/GroceryBasketCard";
import { GroceryCartSummary } from "@/components/genie/GroceryCartSummary";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const QUICK_PROMPTS = [
  "Ingredients for Butter Chicken",
  "Weekly groceries for a family of 4",
  "Vegetarian meal plan for 3 days",
  "Healthy snacks for kids",
];

export default function GroceryGeniePage() {
  const [messages, setMessages] = useState<GenieMessage[]>([{
    id: "1",
    role: "assistant",
    content: "👋 Hi! I'm Grocery Genie. Tell me what you'd like to cook, or ask for a meal plan, and I'll build your shopping basket instantly!",
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [groceryBasket, setGroceryBasket] = useState<GroceryProduct[]>([]);
  const [recipeName, setRecipeName] = useState<string>("");
  const [reasoning, setReasoning] = useState<string>("");
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef(`grocery_conv_${Math.random().toString(36).substring(7)}`).current;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, groceryBasket]);

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
      content: "Chat cleared! What's on the menu today?",
      timestamp: new Date()
    }]);
    setGroceryBasket([]);
    setReasoning("");
    setRecipeName("");
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
          conversationId 
        }),
      });
      
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      const botMsg: GenieMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Here are your groceries.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
      
      if (data.groceryBasket && data.groceryBasket.length > 0) {
        setGroceryBasket(data.groceryBasket);
        setRecipeName(data.recipeName || "Your Basket");
      }
      setReasoning(data.reasoning || "");
      
    } catch (error) {
      console.error(error);
      const errorMsg: GenieMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your grocery request.",
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

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Header */}
      <div className="border-b border-emerald-200 bg-white px-4 py-3 sm:px-6 shrink-0 z-10 shadow-sm">
        <div className="mx-auto flex items-center gap-4">
          <Link href="/groceries">
            <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 hover:bg-emerald-50 transition-colors">
              <ArrowLeft className="h-4 w-4 text-emerald-600" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 shadow-sm shadow-emerald-500/30">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900">Grocery Genie</h1>
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
                          ? "bg-emerald-500 shadow-sm"
                          : "bg-slate-800 shadow-sm"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4 text-white" />
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 shadow-sm">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center">
                      <div className="flex gap-1.5 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            className="h-2 w-2 rounded-full bg-emerald-400"
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
                    className="shrink-0 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-xs font-medium text-slate-600 shadow-sm hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="relative rounded-2xl shadow-lg bg-white border border-slate-200 overflow-hidden flex flex-col transition-shadow focus-within:shadow-xl focus-within:border-emerald-300">
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
                    <label className="cursor-pointer p-2 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors inline-block">
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
                    placeholder="Ask Grocery Genie for recipes, ingredients, or meal plans..."
                    className="flex-1 resize-none bg-transparent py-4 pl-2 pr-14 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none min-h-[56px] max-h-32 scrollbar-thin"
                    rows={1}
                    disabled={isTyping}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 bottom-2 h-10 w-10 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 transition-transform active:scale-95"
                  >
                    {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-1" />}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Area (Right) for Basket & Cart */}
        <div className="w-1/3 min-w-[320px] max-w-md border-l border-slate-200 bg-white shadow-xl flex flex-col z-20 hidden lg:flex">
          <div className="border-b px-4 py-3 bg-emerald-50 flex items-center gap-2">
            <Info className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-emerald-800">Genie's Grocery Basket</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {(!reasoning && groceryBasket.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3 px-6">
                <ShoppingBasket className="h-8 w-8 text-emerald-200" />
                <p className="text-sm">Ask for ingredients, and I will build a grocery basket here for you!</p>
              </div>
            ) : (
              <>
                <ReasoningPanel reasoning={reasoning} />
                
                {groceryBasket.length > 0 && (
                  <GroceryBasketCard recipeName={recipeName} basket={groceryBasket} />
                )}
              </>
            )}
          </div>
          
          <div className="p-4 border-t bg-slate-50 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] h-[40%] flex flex-col">
            <GroceryCartSummary />
          </div>
        </div>

      </div>
    </div>
  );
}
