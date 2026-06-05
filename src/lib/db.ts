import Database from 'better-sqlite3';
import path from 'path';

// Connect to the local SQLite database file in the root of the project
const dbPath = path.join(process.cwd(), 'amazon-genie.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Ensure the products table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    category TEXT,
    price REAL,
    rating REAL,
    stock INTEGER,
    embedding TEXT
  );

  CREATE TABLE IF NOT EXISTS grocery_products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    brand TEXT,
    category TEXT,
    quantity REAL,
    unit TEXT,
    price REAL,
    stock INTEGER,
    image TEXT,
    tags TEXT,
    substitutes TEXT,
    embedding TEXT
  );
`);

export default db;
