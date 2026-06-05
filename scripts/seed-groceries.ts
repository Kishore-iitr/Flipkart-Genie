import db from '../src/lib/db';
import { OllamaEmbeddings } from "@langchain/ollama";

const categories = [
  "Vegetables", "Fruits", "Dairy", "Bakery", "Rice", "Flour", 
  "Spices", "Oil", "Beverages", "Frozen Foods", "Snacks"
];

const brands = ["Amul", "Milky Mist", "Aashirvaad", "India Gate", "Kohinoor", "Everest", "MDH", "Fortune", "Saffola", "Britannia", "Parle", "Haldiram's", "Lays", "Kurkure", "Coca-Cola", "Pepsi", "Mother Dairy", "Nestle", "Kissan", "Knorr", "Maggi", "Tata", "Nature Fresh", "Pillsbury", "Harvest Gold", "Modern", "Safal", "McCain", "Yummiez", "Real", "Tropicana", "Paper Boat", "B Natural", "Organic Tattva", "24 Mantra", "Daawat", "Catch", "MTR"];

const baseProducts: Record<string, string[]> = {
  "Vegetables": ["Onion", "Tomato", "Potato", "Garlic", "Ginger", "Green Chili", "Coriander", "Mint", "Spinach", "Cabbage", "Cauliflower", "Carrot", "Capsicum", "Brinjal", "Lady Finger", "Bottle Gourd", "Bitter Gourd", "Mushroom", "Broccoli", "Zucchini"],
  "Fruits": ["Apple", "Banana", "Orange", "Mango", "Grapes", "Watermelon", "Papaya", "Pomegranate", "Guava", "Pineapple", "Kiwi", "Strawberry", "Sweet Lime", "Pear", "Plum", "Peach"],
  "Dairy": ["Milk", "Curd", "Paneer", "Butter", "Cheese", "Ghee", "Fresh Cream", "Buttermilk", "Lassi", "Yogurt", "Flavored Milk", "Khoya"],
  "Bakery": ["White Bread", "Brown Bread", "Multigrain Bread", "Burger Buns", "Pizza Base", "Pav", "Croissant", "Muffin", "Cake", "Cookies", "Rusk", "Khari"],
  "Rice": ["Basmati Rice", "Sona Masoori Rice", "Brown Rice", "Jasmine Rice", "Idli Rice", "Poha", "Murmura", "Boiled Rice"],
  "Flour": ["Whole Wheat Atta", "Maida", "Besan", "Rice Flour", "Ragi Flour", "Jowar Flour", "Bajra Flour", "Corn Flour", "Soya Flour", "Multigrain Atta"],
  "Spices": ["Turmeric Powder", "Coriander Powder", "Cumin Seeds", "Red Chili Powder", "Garam Masala", "Black Pepper", "Mustard Seeds", "Cardamom", "Cloves", "Cinnamon", "Bay Leaf", "Asafoetida", "Fenugreek", "Fennel Seeds", "Kasuri Methi"],
  "Oil": ["Sunflower Oil", "Mustard Oil", "Groundnut Oil", "Olive Oil", "Rice Bran Oil", "Sesame Oil", "Coconut Oil", "Canola Oil", "Blended Oil"],
  "Beverages": ["Tea", "Coffee", "Green Tea", "Cold Drink", "Fruit Juice", "Energy Drink", "Mineral Water", "Soda", "Tonic Water", "Chocolate Drink", "Coconut Water"],
  "Frozen Foods": ["Frozen Peas", "Frozen Sweet Corn", "French Fries", "Potato Smiles", "Chicken Nuggets", "Veg Patties", "Frozen Paratha", "Ice Cream", "Frozen Mixed Veg", "Momos"],
  "Snacks": ["Potato Chips", "Namkeen", "Bhujia", "Nachos", "Biscuits", "Cookies", "Popcorn", "Roasted Peanuts", "Chocolates", "Makhana", "Puff Snacks"]
};

const units = ["kg", "g", "L", "ml", "pack", "piece", "bunch"];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const products: any[] = [];
let idCounter = 1;

for (const category of categories) {
  const items = baseProducts[category] || [];
  for (const item of items) {
    // Generate 2-4 variants per item
    const numVariants = getRandomInt(2, 4);
    for (let i = 0; i < numVariants; i++) {
      const brand = (category === "Vegetables" || category === "Fruits") && Math.random() > 0.3 
        ? "Fresh Farms" 
        : getRandomItem(brands);
      
      const title = `${brand} ${item}`;
      let quantity = [100, 200, 250, 500, 1, 2, 5][getRandomInt(0, 6)];
      let unit = category === "Beverages" || category === "Oil" 
        ? (quantity >= 100 ? "ml" : "L") 
        : (quantity >= 100 ? "g" : "kg");
        
      if (category === "Spices") {
        quantity = [50, 100, 200, 250][getRandomInt(0, 3)];
        unit = "g";
      }
      
      // Some natural adjustments
      const finalUnit = category === "Bakery" ? "pack" : unit;
      
      const price = category === "Spices" ? getRandomInt(20, 100) : getRandomInt(20, 500);
      const stock = getRandomInt(0, 100);
      const tags = JSON.stringify([category.toLowerCase(), item.toLowerCase(), brand.toLowerCase()]);
      
      // Substitutes logic
      const substitutes = JSON.stringify([
        item,
        `${getRandomItem(brands)} ${item}`
      ]);

      products.push({
        id: `groc-${idCounter++}`,
        title,
        brand,
        category,
        quantity,
        unit: finalUnit,
        price,
        stock,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80", // generic grocery image
        tags,
        substitutes
      });
    }
  }
}

// Add specifically requested recipe items to ensure Butter Chicken works perfectly
const specificItems = [
  { title: "Fresh Chicken Breast", brand: "Licious", category: "Meat", quantity: 1, unit: "kg", price: 250 },
  { title: "Amul Butter", brand: "Amul", category: "Dairy", quantity: 200, unit: "g", price: 60 },
  { title: "Amul Fresh Cream", brand: "Amul", category: "Dairy", quantity: 200, unit: "ml", price: 75 },
  { title: "Milky Mist Fresh Cream", brand: "Milky Mist", category: "Dairy", quantity: 200, unit: "ml", price: 70 },
  { title: "Fresh Onion", brand: "Fresh Farms", category: "Vegetables", quantity: 500, unit: "g", price: 35 },
  { title: "Fresh Tomato", brand: "Fresh Farms", category: "Vegetables", quantity: 500, unit: "g", price: 40 },
  { title: "Fresh Garlic", brand: "Fresh Farms", category: "Vegetables", quantity: 100, unit: "g", price: 20 },
  { title: "Fresh Ginger", brand: "Fresh Farms", category: "Vegetables", quantity: 100, unit: "g", price: 15 },
  { title: "Everest Garam Masala", brand: "Everest", category: "Spices", quantity: 100, unit: "g", price: 65 },
  { title: "Everest Turmeric Powder", brand: "Everest", category: "Spices", quantity: 200, unit: "g", price: 50 },
  { title: "Everest Red Chili Powder", brand: "Everest", category: "Spices", quantity: 200, unit: "g", price: 60 },
  { title: "Milky Mist Paneer", brand: "Milky Mist", category: "Dairy", quantity: 500, unit: "g", price: 180 },
  { title: "Amul Malai Paneer", brand: "Amul", category: "Dairy", quantity: 500, unit: "g", price: 190 },
];

for (const item of specificItems) {
  products.push({
    id: `groc-${idCounter++}`,
    ...item,
    stock: 50,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
    tags: JSON.stringify([item.category.toLowerCase(), item.title.toLowerCase(), item.brand.toLowerCase()]),
    substitutes: JSON.stringify([item.title])
  });
}

console.log(`Generated ${products.length} grocery products. Connecting to SQLite...`);

async function seed() {
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
  });

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO grocery_products (id, title, brand, category, quantity, unit, price, stock, image, tags, substitutes, embedding)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Process in batches
  console.log("Generating embeddings and inserting into DB...");
  const batchSize = 10;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    
    // Generate embeddings for the batch
    const textsToEmbed = batch.map(p => `${p.title} ${p.category} ${p.brand} ${JSON.parse(p.tags).join(" ")}`);
    const vectors = await embeddings.embedDocuments(textsToEmbed);

    const transaction = db.transaction((items, vecs) => {
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        insertStmt.run(
          item.id, item.title, item.brand, item.category, 
          item.quantity, item.unit, item.price, item.stock, 
          item.image, item.tags, item.substitutes, 
          JSON.stringify(vecs[j])
        );
      }
    });

    transaction(batch, vectors);
    process.stdout.write(`\rProcessed ${Math.min(i + batchSize, products.length)} / ${products.length}`);
  }
  console.log("\nGrocery Seed completed successfully!");
}

seed().catch(console.error);
