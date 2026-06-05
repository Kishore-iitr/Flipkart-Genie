import { GenieState } from "../../state/genie-state";
import { searchProducts } from "../../retrieval/vector-search";

export async function retrievalNode(state: GenieState): Promise<Partial<GenieState>> {
  const searchQuery = state.userQuery;

  const products = await searchProducts(searchQuery, 20);

  // Filter based on explicit budget if available (soft filter, exact budget check happens in cart builder, but we can pre-filter)
  let filtered = products;
  if (state.budget) {
    // Keep products that are less than or equal to the total budget. 
    // Wait, individual products shouldn't cost more than the total budget.
    filtered = products.filter(p => p.price <= state.budget!);
  }

  return {
    retrievedProducts: products,
    filteredProducts: filtered,
  };
}
