# Flipkart Genie

An AI-powered shopping assistant designed to completely redefine how users shop for general products and groceries. Built with **Next.js 15**, **Tailwind CSS**, **LangChain**, and powered by the **OpenRouter API**.

## Features
- **Flipkart Genie**: A conversational AI shopping assistant that can answer queries, understand complex requests, and recommend the best products for your needs.
- **Grocery Genie**: A specialized agent that can extract ingredients from recipes, estimate quantities, suggest substitutions, and build your entire grocery cart in seconds.
- **Vector Search Engine**: Powered by an in-memory SQLite database and cosine similarity to match user intents perfectly with products.
- **Dynamic Shopping Cart**: Manage standard items and grocery items concurrently with a beautiful, fast checkout UI.
- **Client-side LLM Key Management**: No need to mess with `.env` files if you don't want to!

## Getting Started

### 1. Installation
Clone the repository and install dependencies using your preferred package manager:
```bash
git clone https://github.com/Kishore-iitr/Flipkart-Genie.git
cd Flipkart-Genie
npm install
```

### 2. Configure the LLM
Flipkart Genie relies on LLMs to power its intelligence via OpenRouter. You have two options to provide your API key:

**Option A: Via the User Interface (Recommended for quick testing)**
1. Start the app.
2. Click the **Settings (Gear) icon** in the top-right navigation bar.
3. Paste your OpenRouter API key. It will be securely stored in your browser cookies and only sent directly to the local server.

**Option B: Environment Variables (Recommended for deployment)**
1. Create a `.env.local` file in the root directory.
2. Add your OpenRouter API key:
```env
OPENROUTER_API_KEY=sk-or-v1-...
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Styling**: Tailwind CSS, Framer Motion for animations
- **State Management**: Zustand
- **AI / LLM Orchestration**: LangChain, LangGraph
- **Database (Mock)**: SQLite in-memory for vector searches

## Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Kishore-iitr/Flipkart-Genie/issues).

## License
This project is open-source and available under the [MIT License](LICENSE).
