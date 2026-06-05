import db from '../src/lib/db';
import { sampleProducts } from '../src/lib/sampleProducts';
import { OllamaEmbeddings } from "@langchain/ollama";

async function main() {
  console.log('Clearing existing products from SQLite...');
  db.exec('DELETE FROM products');

  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
  });

  console.log('Generating embeddings and inserting products into SQLite...');
  
  const insertStmt = db.prepare(`
    INSERT INTO products (id, title, description, image, category, price, rating, stock, embedding)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((products) => {
    for (const product of products) {
      insertStmt.run(
        product.id,
        product.title,
        product.description,
        product.image,
        product.category,
        product.price,
        product.rating,
        product.stock,
        product.embedding
      );
    }
  });

  const productsWithEmbeddings = [];

  for (const product of sampleProducts) {
    let embedding: number[] = [];
    
    const textToEmbed = `${product.title} ${product.description} ${product.category}`;
    try {
      embedding = await embeddings.embedQuery(textToEmbed);
    } catch (err) {
      console.error(`Failed to generate embedding for ${product.id}`, err);
    }

    productsWithEmbeddings.push({
      ...product,
      embedding: embedding.length > 0 ? JSON.stringify(embedding) : null
    });
    
    console.log(`Processed ${product.title}`);
  }

  insertMany(productsWithEmbeddings);
  
  console.log('Successfully seeded local SQLite database!');
}

main().catch(console.error);
