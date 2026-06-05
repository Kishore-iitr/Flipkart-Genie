import { z } from "zod";
import { getStructuredLLM } from "../providers/openrouter";
import { checkAvailability } from "./availability-checker";
import { GroceryProduct } from "@/types";

const schema = z.object({
  substituteQueries: z.array(z.string()).describe("List of potential substitute search queries for the missing ingredient")
});

export async function findSubstitute(
  missingIngredient: string, 
  constraints: string[] = []
): Promise<GroceryProduct | null> {
  const llm = await getStructuredLLM(schema);
  
  const systemMessage = `You are an expert culinary AI. 
The ingredient "${missingIngredient}" is unavailable or doesn't meet constraints: ${constraints.join(", ")}.
Provide 3 alternative ingredient search queries that could substitute it perfectly.`;

  try {
    const response = await llm.invoke([
      { role: "system", content: systemMessage }
    ]);
    
    for (const query of response.substituteQueries) {
      const match = await checkAvailability(query);
      // Ensure we don't just return another out-of-stock item
      if (match && match.stock > 0) {
        return match;
      }
    }
  } catch (error) {
    console.error("Substitution engine failed:", error);
  }
  return null;
}
