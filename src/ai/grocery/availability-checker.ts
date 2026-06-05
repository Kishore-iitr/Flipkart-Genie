import db from "@/lib/db";
import { GroceryProduct } from "@/types";
import { OllamaEmbeddings } from "@langchain/ollama";

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function checkAvailability(ingredientQuery: string): Promise<GroceryProduct | null> {
  try {
    const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" });
    const queryVector = await embeddings.embedQuery(ingredientQuery);

    const stmt = db.prepare("SELECT * FROM grocery_products");
    const allProducts = stmt.all() as any[];

    let bestMatch: GroceryProduct | null = null;
    let highestScore = -1;

    for (const p of allProducts) {
      if (p.embedding) {
        try {
          const productVector = JSON.parse(p.embedding);
          const score = cosineSimilarity(queryVector, productVector);
          
          if (score > highestScore) {
            highestScore = score;
            bestMatch = {
              id: p.id,
              title: p.title,
              brand: p.brand,
              category: p.category,
              quantity: p.quantity,
              unit: p.unit,
              price: p.price,
              stock: p.stock,
              image: p.image,
              tags: p.tags,
              substitutes: p.substitutes
            };
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    }

    // Only return if it's a reasonably good match
    return highestScore > 0.7 ? bestMatch : null;
  } catch (error) {
    console.error("Availability check failed:", error);
    return null;
  }
}
