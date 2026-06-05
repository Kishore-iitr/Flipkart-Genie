import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/ollama";
import { cookies } from "next/headers";

export async function getLLM(fallback = false) {
  const cookieStore = await cookies();
  const apiKey = cookieStore.get('OPENROUTER_API_KEY')?.value || process.env.OPENROUTER_API_KEY;
  const useOpenRouter = process.env.USE_OPENROUTER === "true" || !!apiKey;

  if (useOpenRouter && apiKey) {
    return new ChatOpenAI({
      apiKey: apiKey,
      openAIApiKey: apiKey,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
      },
      modelName: "openai/gpt-4o",
      temperature: 0,
      maxTokens: 1000,
      maxRetries: 0,
    });
  } else {
    return new ChatOllama({
      model: "mistral:latest",
      temperature: 0,
    });
  }
}

export async function getStructuredLLM(schema: any, fallback = false) {
  const cookieStore = await cookies();
  const apiKey = cookieStore.get('OPENROUTER_API_KEY')?.value || process.env.OPENROUTER_API_KEY;
  const useOpenRouter = process.env.USE_OPENROUTER === "true" || !!apiKey;

  if (useOpenRouter && apiKey) {
    const model = new ChatOpenAI({
      apiKey: apiKey,
      openAIApiKey: apiKey,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
      },
      modelName: "openai/gpt-4o",
      temperature: 0,
      maxTokens: 1000,
      maxRetries: 0,
    });
    return model.withStructuredOutput(schema);
  } else {
    const model = new ChatOllama({
      model: "mistral:latest",
      temperature: 0,
      format: "json",
    });
    return model.withStructuredOutput(schema);
  }
}
