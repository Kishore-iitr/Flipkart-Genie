import { NextResponse } from "next/server";
import { appGraph } from "@/ai/graph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { GenieState } from "@/ai/state/genie-state";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, cart, conversationId, apiKey } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    // Convert UI messages to LangChain messages
    const langchainMessages = messages.map((m: any) => {
      if (m.role === 'user') {
        if (m.image) {
          return new HumanMessage({
            content: [
              { type: "text", text: m.content || "Evaluate this image." },
              { type: "image_url", image_url: { url: m.image } }
            ]
          });
        }
        return new HumanMessage(m.content);
      } else {
        return new AIMessage(m.content);
      }
    });

    const latestUserQuery = messages[messages.length - 1].content;

    // Initialize state with full history
    const initialState: Partial<GenieState> = {
      userQuery: latestUserQuery,
      messages: langchainMessages,
      // Pass the current frontend cart so the AI knows what's already inside
      cart: cart || [], 
      constraints: [],
      filteredProducts: [],
      missingInformation: [],
      recommendedProducts: [],
      retrievedProducts: [],
      groceryBasket: [],
      apiKey
    };

    const finalState = await appGraph.invoke(initialState, {
      configurable: { thread_id: conversationId || "default_thread" },
    });

    return NextResponse.json({
      response: finalState.finalResponse,
      products: finalState.recommendedProducts || [],
      cart: finalState.cart || [],
      reasoning: finalState.reasoning || "",
      needsClarification: finalState.needsClarification || false,
      clarificationQuestion: finalState.clarificationQuestion || undefined,
      groceryBasket: finalState.groceryBasket || [],
      recipeName: finalState.recipeName || undefined,
    });
  } catch (error) {
    console.error("Error in Genie API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
