import { GenieMessage } from "@/types";
import { User, Bot } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ChatMessage({ message }: { message: GenieMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4 rounded-xl",
        isUser ? "bg-muted/50 flex-row-reverse" : "bg-card"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={cn("flex flex-col gap-1 min-w-0 w-full", isUser ? "items-end" : "items-start")}>
        <span className="text-sm font-semibold">{isUser ? "You" : "Flipkart Genie"}</span>
        <div className="text-sm prose prose-sm dark:prose-invert break-words">
          {message.content}
        </div>
      </div>
    </div>
  );
}
