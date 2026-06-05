import db from "@/lib/db";
import { GroceryProduct } from "@/types";
import GroceryProductGrid from "@/components/GroceryProductGrid";

// Revalidate every hour, or whatever caching strategy makes sense
export const revalidate = 3600;

export default async function GroceriesPage() {
  let groceries: GroceryProduct[] = [];

  try {
    const rows = db.prepare("SELECT * FROM grocery_products").all() as any[];
    groceries = rows.map((r) => ({
      ...r,
      tags: r.tags ? JSON.parse(r.tags) : [],
      substitutes: r.substitutes ? JSON.parse(r.substitutes) : [],
      // Do not pass back massive embeddings to the client
      embedding: undefined,
    }));
  } catch (error) {
    console.error("Failed to load groceries:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GroceryProductGrid products={groceries} title="Groceries Store" />
      </div>
    </div>
  );
}
