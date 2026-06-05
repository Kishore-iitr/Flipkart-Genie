"use client";

import { useState, useRef, useEffect } from "react";
import { GenieMessage, Product, CartItem, GroceryProduct } from "@/types";
import { ChatMessage } from "./ChatMessage";
import { RecommendationCard } from "./RecommendationCard";
import { CartSummary } from "./CartSummary";
import { GroceryBasketCard } from "./GroceryBasketCard";
import { GroceryCartSummary } from "./GroceryCartSummary";
import { ReasoningPanel } from "./ReasoningPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";

interface GenieChatProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  placeholder?: string;
  welcomeMessage?: string;
}

export default function GenieChat({ 
  open = true, 
  onClose,
  title = "Flipkart Genie",
  placeholder = "Ask Genie to build or recommend something...",
  welcomeMessage = "Your AI-powered shopping copilot. Try asking:"
}: GenieChatProps) {
  const [messages, setMessages] = useState<GenieMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // State populated from API
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [groceryBasket, setGroceryBasket] = useState<GroceryProduct[]>([]);
  const [recipeName, setRecipeName] = useState<string>("");
  const [reasoning, setReasoning] = useState<string>("");
  
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Random session ID for state memory on backend (simplified)
  const conversationId = useRef(`conv_${Math.random().toString(36).substring(7)}`).current;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, products, cart]);

  const { openrouterApiKey } = useSettingsStore();

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: GenieMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/genie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg.content, 
          messages: [...messages, userMsg],
          cart,
          conversationId,
          apiKey: openrouterApiKey 
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
      setCart(data.cart || []);
      setGroceryBasket(data.groceryBasket || []);
      setRecipeName(data.recipeName || "");
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
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[80vh] w-full max-w-7xl mx-auto rounded-xl border bg-background overflow-hidden shadow-2xl">
      {/* Chat Area */}
      <div className="flex flex-col w-2/3 border-r bg-muted/20">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <span className="text-3xl">🧞</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
              <p>{welcomeMessage}</p>
              <div className="flex gap-2 flex-wrap justify-center mt-4">
                <Button variant="outline" size="sm" onClick={() => setInput("Build an autonomous drone under ₹50000")}>
                  "Build an autonomous drone under ₹50000"
                </Button>
                <Button variant="outline" size="sm" onClick={() => setInput("Create a podcasting setup")}>
                  "Create a podcasting setup"
                </Button>
              </div>
            </div>
          ) : (
            messages.map(msg => <ChatMessage key={msg.id} message={msg} />)
          )}
          
          {isLoading && (
            <div className="flex items-center gap-2 p-4 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Genie is thinking...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        
        <div className="p-4 bg-background border-t">
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2 relative"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="flex-1 pr-12 rounded-full bg-muted/50 border-primary/20 focus-visible:ring-primary/50"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isLoading}
              className="absolute right-1 top-1 bottom-1 h-8 w-8 rounded-full"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Recommendations & Cart Area */}
      <div className="flex flex-col w-1/3 bg-background">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <ReasoningPanel reasoning={reasoning} />
          
          {products.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-4">Recommended Products</h2>
              <div className="grid grid-cols-1 gap-4">
                {products.map(p => (
                  <RecommendationCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {groceryBasket.length > 0 && (
          <div className="mt-4">
            <GroceryBasketCard recipeName={recipeName} basket={groceryBasket} />
          </div>
        )}
        
        {cart.length > 0 && (
          <div className="p-4 border-t bg-muted/30">
            <CartSummary cart={cart} />
          </div>
        )}

        <div className="p-4 border-t bg-muted/30">
          <GroceryCartSummary />
        </div>
      </div>
    </div>
  );
}
