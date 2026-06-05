import { appGraph } from "./src/ai/graph";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function test() {
  try {
    console.log("Testing appGraph.invoke...");
    const result = await appGraph.invoke({
      userQuery: "Build an autonomous drone under 50000",
      messages: [new HumanMessage("Build an autonomous drone under 50000")],
      cart: [], 
      constraints: [],
      filteredProducts: [],
      missingInformation: [],
      recommendedProducts: [],
      retrievedProducts: []
    }, {
      configurable: { thread_id: "test" },
    });
    console.log("Success:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error during invocation:", err);
  }
}

test();
