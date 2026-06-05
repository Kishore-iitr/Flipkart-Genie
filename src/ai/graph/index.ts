import { StateGraph, START, END } from "@langchain/langgraph";
import { GenieState, genieStateChannels } from "../state/genie-state";
import { analyzerNode } from "./nodes/analyzer-node";
import { retrievalNode } from "./nodes/retrieval-node";
import { generatorNode } from "./nodes/generator-node";
import { groceryNode } from "./nodes/grocery-node";

// Define the optimized graph
const workflow = new StateGraph<GenieState>({ channels: genieStateChannels })
  .addNode("analyzer_node", analyzerNode)
  .addNode("retrieval_node", retrievalNode)
  .addNode("generator_node", generatorNode)
  .addNode("grocery_node", groceryNode)
  .addNode("clarification_node", async (state: GenieState) => ({
    finalResponse: state.clarificationQuestion || "Could you provide more details?",
  }));

// Wiring
workflow.addEdge(START, "analyzer_node");

// Conditional edge after analyzer:
workflow.addConditionalEdges(
  "analyzer_node",
  (state: GenieState) => {
    if (state.needsClarification) return "clarification_node";
    const groceryIntents = ["recipe_request", "meal_plan_request", "grocery_request", "diet_request"];
    if (groceryIntents.includes(state.intent)) return "grocery_node";
    return "retrieval_node";
  }
);

workflow.addEdge("clarification_node", END);
workflow.addEdge("retrieval_node", "generator_node");
workflow.addEdge("grocery_node", END);
workflow.addEdge("generator_node", END);

export const appGraph = workflow.compile();
