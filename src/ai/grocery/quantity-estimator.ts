import { z } from "zod";
import { getStructuredLLM } from "../providers/openrouter";

const schema = z.object({
  estimatedIngredients: z.array(z.object({
    ingredient: z.string(),
    estimatedQuantity: z.number().describe("The estimated quantity needed"),
    unit: z.string().describe("The standard unit (g, kg, ml, L, piece, pack)")
  }))
});

export async function estimateQuantities(ingredients: string[], servings: number, apiKey?: string) {
  if (ingredients.length === 0) return [];

  const llm = await getStructuredLLM(schema, apiKey);
  
  const systemMessage = `You are an expert culinary AI. 
Estimate the required quantities for the following ingredients for ${servings} servings.
Return logical standard grocery units (g, kg, ml, L, piece, pack).`;

  try {
    const response = await llm.invoke([
      { role: "system", content: systemMessage },
      { role: "user", content: JSON.stringify(ingredients) }
    ]);
    return response.estimatedIngredients;
  } catch (error) {
    console.error("Quantity estimation failed:", error);
    // Fallback: 1 piece/pack for everything
    return ingredients.map(ing => ({ ingredient: ing, estimatedQuantity: 1, unit: "pack" }));
  }
}
