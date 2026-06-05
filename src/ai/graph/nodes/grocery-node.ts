import { GenieState } from "../../state/genie-state";
import { extractIngredients } from "../../grocery/ingredient-extractor";
import { estimateQuantities } from "../../grocery/quantity-estimator";
import { checkAvailability } from "../../grocery/availability-checker";
import { findSubstitute } from "../../grocery/substitution-engine";
import { GroceryProduct } from "@/types";

export async function groceryNode(state: GenieState): Promise<Partial<GenieState>> {
  let reasoning = "Analyzing your culinary request... ";
  const query = state.userQuery;
  const constraints = state.constraints || [];

  // 1. Extract ingredients
  const extracted = await extractIngredients(query, constraints);
  reasoning += `Extracted ${extracted.ingredients.length} core ingredients for ${extracted.recipeName}. `;

  // 2. Estimate quantities
  const estimations = await estimateQuantities(extracted.ingredients, extracted.servings);
  reasoning += "Estimated quantities based on servings. ";

  // 3. Check availability & 4. Substitutions
  const basket: GroceryProduct[] = [];
  
  for (const est of estimations) {
    let match = await checkAvailability(est.ingredient);
    
    if (!match || match.stock === 0) {
      reasoning += `${est.ingredient} is unavailable, looking for a substitute... `;
      match = await findSubstitute(est.ingredient, constraints);
    }

    if (match) {
      basket.push(match);
    } else {
      reasoning += `Could not find a substitute for ${est.ingredient}. `;
    }
  }

  const totalCost = basket.reduce((sum, item) => sum + item.price, 0);
  
  const finalResponse = `I've assembled the ingredients for **${extracted.recipeName}** (${extracted.servings} servings).\n\nTotal Estimated Cost: ₹${totalCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}\n\nI've added the grocery basket to your view.`;

  return {
    recipeName: extracted.recipeName,
    groceryBasket: basket,
    reasoning,
    finalResponse
  };
}
