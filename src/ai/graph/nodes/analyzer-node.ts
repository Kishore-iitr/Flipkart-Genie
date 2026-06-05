import { z } from "zod";
import { GenieState } from "../../state/genie-state";
import { getStructuredLLM } from "../../providers/openrouter";

const analyzerSchema = z.object({
  intent: z.enum(["product_search", "general_chat", "comparison", "cart_management", "recipe_request", "meal_plan_request", "grocery_request", "diet_request"]),
  constraints: z.array(z.string()).describe("Specific product features or specs mentioned by the user"),
  budget: z.number().nullable().describe("Max budget in dollars, if mentioned"),
  searchQuery: z.string().describe("A clean search query optimized for vector search"),
  needsClarification: z.boolean().describe("True ONLY if the user's request is completely impossible to search without more info. If you can make a guess, set to false."),
  clarificationQuestion: z.string().describe("If needsClarification is true, the exact question to ask the user. Provide an empty string if false."),
});

export async function analyzerNode(state: GenieState): Promise<Partial<GenieState>> {
  const structuredLlm = await getStructuredLLM(analyzerSchema, state.apiKey);

  const systemMessage = `You are an expert shopping assistant analyzer. 
Extract the user's intent, specific product constraints, and budget from their query.
Generate a highly descriptive 'searchQuery' that captures the essence of what they want, so we can search the database.
DO NOT ask for clarification unless absolutely necessary. Be decisive.`;

  try {
    const response = await structuredLlm.invoke([
      { role: "system", content: systemMessage },
      ...state.messages.slice(-6) // Last 6 messages for context
    ]);

    return {
      intent: response.intent,
      constraints: response.constraints,
      budget: response.budget || undefined,
      userQuery: response.searchQuery, // We will use this as the vector search query
      needsClarification: response.needsClarification,
      clarificationQuestion: response.clarificationQuestion,
    };
  } catch (error) {
    console.error("Analyzer failed:", error);
    return {
      intent: "product_search",
      constraints: [],
      userQuery: state.userQuery,
      needsClarification: false
    };
  }
}
