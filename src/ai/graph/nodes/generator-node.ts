import { z } from "zod";
import { GenieState } from "../../state/genie-state";
import { getStructuredLLM } from "../../providers/openrouter";
import { Product } from "@/types";

const generatorSchema = z.object({
  response: z.string().describe("The conversational markdown response to the user. Explain why the recommended products match their needs."),
  recommendedProducts: z.array(z.string()).describe("List of exactly matched Product IDs that you recommend."),
  cartActions: z.array(z.object({
    productId: z.string(),
    action: z.enum(["add", "remove"]),
    quantity: z.number().describe("Quantity of items to add or remove. Defaults to 1.")
  })).describe("Actions to perform on the shopping cart, if requested.")
});

export async function generatorNode(state: GenieState): Promise<Partial<GenieState>> {
  const structuredLlm = await getStructuredLLM(generatorSchema);

  const productList = state.filteredProducts.map(p => 
    `- ID: ${p.id} | ${p.title} | $${p.price} | ${p.category}\n  Desc: ${p.description.substring(0, 150)}...`
  ).join("\n");

  const cartList = state.cart && state.cart.length > 0 
    ? state.cart.map(c => `- ${c.quantity}x ${c.title} (ID: ${c.id})`).join("\n")
    : "Empty";

  const systemMessage = `You are a strict, helpful shopping assistant.
CRITICAL ANTI-HALLUCINATION RULES:
1. ONLY recommend products from the 'Available Products' list below. 
2. NEVER invent, make up, or hallucinate a product ID, title, or price.
3. If no products match the user's query, explicitly state that you don't have matching products right now.
4. If the user asks a general question, answer it concisely.

Available Products from Database:
${productList ? productList : "None found."}

Current Shopping Cart:
${cartList}`;

  try {
    // We add the system message, the conversational history, and a final instruction
    const response = await structuredLlm.invoke([
      { role: "system", content: systemMessage },
      ...state.messages.slice(-6),
      { role: "user", content: `(System Note: Process this query considering Intent=${state.intent}, Constraints=${state.constraints.join(', ')}, Budget=${state.budget || 'None'})` }
    ]);

    // Map IDs back to full products
    const recommendedFull = response.recommendedProducts
      .map((id: string) => state.filteredProducts.find(p => p.id === id))
      .filter((p: Product | undefined): p is Product => p !== undefined);

    // Process cart actions to update the cart state
    let newCart = [...(state.cart || [])];
    for (const action of response.cartActions || []) {
      if (action.action === "add") {
        const product = state.filteredProducts.find(p => p.id === action.productId);
        if (product) {
          const existing = newCart.find(c => c.id === product.id);
          if (existing) {
            existing.quantity += action.quantity || 1;
          } else {
            newCart.push({ ...product, quantity: action.quantity || 1 });
          }
        }
      } else if (action.action === "remove") {
        newCart = newCart.filter(c => c.id !== action.productId);
      }
    }

    return {
      recommendedProducts: recommendedFull,
      cart: newCart,
      finalResponse: response.response,
    };
  } catch (error) {
    console.error("Generator failed:", error);
    return {
      finalResponse: "I'm having trouble generating a response right now. Please try again.",
      recommendedProducts: [],
      cart: state.cart || []
    };
  }
}
