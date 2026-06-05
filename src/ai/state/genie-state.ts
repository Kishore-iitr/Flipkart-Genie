import { BaseMessage } from "@langchain/core/messages";
import { Product, CartItem, GroceryProduct } from "@/types";
import { StateGraph, StateGraphArgs } from "@langchain/langgraph";

export interface GenieState {
  messages: BaseMessage[];
  userQuery: string;
  intent: string;
  goal: string;
  budget?: number;
  category?: string;
  constraints: string[];
  missingInformation: string[];
  retrievedProducts: Product[];
  filteredProducts: Product[];
  recommendedProducts: Product[];
  groceryBasket: GroceryProduct[];
  recipeName: string;
  cart: CartItem[];
  retrievalScore: number;
  needsClarification: boolean;
  clarificationQuestion?: string;
  reasoning: string;
  finalResponse: string;
  rewriteCount: number;
  apiKey?: string;
}

export const genieStateChannels: StateGraphArgs<GenieState>["channels"] = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
  userQuery: {
    value: (x: string, y: string) => y ?? x,
    default: () => "",
  },
  intent: {
    value: (x: string, y: string) => y ?? x,
    default: () => "",
  },
  goal: {
    value: (x: string, y: string) => y ?? x,
    default: () => "",
  },
  budget: {
    value: (x: number | undefined, y: number | undefined) => y ?? x,
    default: () => undefined,
  },
  category: {
    value: (x: string | undefined, y: string | undefined) => y ?? x,
    default: () => undefined,
  },
  constraints: {
    value: (x: string[], y: string[]) => y ?? x,
    default: () => [],
  },
  missingInformation: {
    value: (x: string[], y: string[]) => y ?? x,
    default: () => [],
  },
  retrievedProducts: {
    value: (x: Product[], y: Product[]) => y ?? x,
    default: () => [],
  },
  filteredProducts: {
    value: (x: Product[], y: Product[]) => y ?? x,
    default: () => [],
  },
  recommendedProducts: {
    value: (x: Product[], y: Product[]) => y ?? x,
    default: () => [],
  },
  groceryBasket: {
    value: (x: GroceryProduct[], y: GroceryProduct[]) => y ?? x,
    default: () => [],
  },
  recipeName: {
    value: (x: string, y: string) => y ?? x,
    default: () => "",
  },
  cart: {
    value: (x: CartItem[], y: CartItem[]) => y ?? x,
    default: () => [],
  },
  retrievalScore: {
    value: (x: number, y: number) => y ?? x,
    default: () => 0,
  },
  needsClarification: {
    value: (x: boolean, y: boolean) => y ?? x,
    default: () => false,
  },
  clarificationQuestion: {
    value: (x: string | undefined, y: string | undefined) => y ?? x,
    default: () => undefined,
  },
  reasoning: {
    value: (x: string, y: string) => y ?? x,
    default: () => "",
  },
  finalResponse: {
    value: (x: string, y: string) => y ?? x,
    default: () => "",
  },
  rewriteCount: {
    value: (x: number, y: number) => y ?? x,
    default: () => 0,
  },
  apiKey: {
    value: (x: string | undefined, y: string | undefined) => y ?? x,
    default: () => undefined,
  }
};
