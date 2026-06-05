import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import { sampleProducts } from "../lib/sampleProducts";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search?.toLowerCase();

  let displayedProducts = sampleProducts;
  if (search) {
    displayedProducts = sampleProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
    );
  }

  return (
    <>
      {!search && <Hero />}
      <ProductGrid 
        products={displayedProducts} 
        showFilters 
        title={search ? `Search Results for "${resolvedParams.search}"` : "All Products"} 
      />
    </>
  );
}
