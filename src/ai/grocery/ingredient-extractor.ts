import { z } from "zod";
import { getStructuredLLM } from "../providers/openrouter";

const schema = z.object({
  recipeName: z.string().describe("The name of the recipe, meal plan, or request"),
  ingredients: z.array(z.string()).describe("A raw list of essential ingredients. MUST BE ONLY THE NAME OF THE INGREDIENT. Examples: 'Basmati Rice', 'Tomato', 'Garam Masala'. DO NOT include quantities, measurements, adjectives, or instructions like '(to taste)'."),
  servings: z.number().describe("The estimated number of servings requested, default to 2 if not specified")
});

export async function extractIngredients(query: string, constraints: string[] = [], apiKey?: string) {
  const llm = await getStructuredLLM(schema, apiKey);
  
  const systemMessage = `You are an expert culinary AI. 
Given a user's food request, extract the fundamental ingredients required.
CRITICAL: The ingredients array must ONLY contain the core name of the product (e.g. 'Rice', 'Onion', 'Turmeric Powder'). 
DO NOT include quantities (like '2 cups'), instructions (like 'minced'), or notes (like 'optional').
Account for constraints like "Make it vegetarian" or "Remove onions": ${constraints.join(", ")}`;

  try {
    const response = await llm.invoke([
      { role: "system", content: systemMessage },
      { role: "user", content: query }
    ]);
    return response;
  } catch (error) {
    console.error("Ingredient extraction failed:", error);
    return {
      recipeName: query,
      ingredients: [],
      servings: 2
    };
  }
}
