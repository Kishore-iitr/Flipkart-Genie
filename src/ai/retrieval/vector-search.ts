import db from "@/lib/db";
import { Product } from "@/types";
import { OllamaEmbeddings } from "@langchain/ollama";

// Calculate cosine similarity between two vectors
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

export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  try {
    // Generate query embedding locally using Ollama
    const embeddings = new OllamaEmbeddings({
      model: "nomic-embed-text",
    });
    const queryVector = await embeddings.embedQuery(query);

    // Fetch all products from local SQLite
    const stmt = db.prepare("SELECT * FROM products");
    const allProducts = stmt.all() as any[];

    // Calculate similarity scores
    const scoredProducts = allProducts.map(product => {
      let score = 0;
      if (product.embedding) {
        try {
          const productVector = JSON.parse(product.embedding);
          score = cosineSimilarity(queryVector, productVector);
        } catch (e) {
          console.error("Failed to parse embedding for", product.id);
        }
      }
      return {
        product: {
          id: product.id,
          title: product.title,
          description: product.description,
          image: product.image,
          category: product.category,
          price: product.price,
          rating: product.rating,
          stock: product.stock,
        } as Product,
        score
      };
    });

    // Sort by descending score
    scoredProducts.sort((a, b) => b.score - a.score);

    // Return top N products (filter out irrelevant ones if score is too low, but for now just return top N)
    return scoredProducts.slice(0, limit).map(p => p.product);
  } catch (error) {
    console.error("Local vector search failed:", error);
    return [];
  }
}
