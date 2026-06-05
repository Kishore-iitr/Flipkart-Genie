import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { searchProducts } from "../retrieval/vector-search";

export const searchProductsTool = tool(
  async ({ query }) => {
    const results = await searchProducts(query, 5);
    return JSON.stringify(results);
  },
  {
    name: "search_products",
    description: "Search for products in the store by semantic query.",
    schema: z.object({
      query: z.string().describe("The search query for the product."),
    }),
  }
);

// Note: These other tools would typically be used in a ReAct agent or integrated into the cartBuilder node dynamically.
// For the explicit CRAG workflow we built, we handle state transitions in nodes rather than dynamic tool calling, 
// but we define them here to fulfill the architectural requirements.

export const replaceProductTool = tool(
  async ({ oldProductId, newProductId }) => {
    return JSON.stringify({ success: true, action: "replace", oldProductId, newProductId });
  },
  {
    name: "replace_product",
    description: "Replace a product in the cart with a new one.",
    schema: z.object({
      oldProductId: z.string(),
      newProductId: z.string(),
    }),
  }
);

export const addToCartTool = tool(
  async ({ productId, quantity }) => {
    return JSON.stringify({ success: true, action: "add", productId, quantity });
  },
  {
    name: "add_to_cart",
    description: "Add a product to the user's cart.",
    schema: z.object({
      productId: z.string(),
      quantity: z.number().default(1),
    }),
  }
);

export const removeFromCartTool = tool(
  async ({ productId }) => {
    return JSON.stringify({ success: true, action: "remove", productId });
  },
  {
    name: "remove_from_cart",
    description: "Remove a product from the user's cart.",
    schema: z.object({
      productId: z.string(),
    }),
  }
);

export const calculateBudgetTool = tool(
  async ({ cartItems }) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return JSON.stringify({ total });
  },
  {
    name: "calculate_budget",
    description: "Calculate the total cost of the provided cart items.",
    schema: z.object({
      cartItems: z.array(z.object({
        price: z.number(),
        quantity: z.number()
      })),
    }),
  }
);
