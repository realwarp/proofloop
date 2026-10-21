import OpenAI from "openai";
import { config } from "../config.js";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ModelReply {
  content: string;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Provider-neutral inference adapter.
 * Configure LLM_BASE_URL, LLM_API_KEY, and LLM_MODEL in .env.
 * Never use this temporary development endpoint as a substitute for the
 * Nebius runtime requirement in the final hackathon submission.
 */
export async function chat(
  messages: ChatMessage[],
  options: { temperature?: number; maxTokens?: number } = {},
): Promise<ModelReply> {
  if (!config.llmApiKey) {
    throw new Error(
      "LLM_API_KEY is missing. Copy .env.example to .env and configure a provider API key.",
    );
  }

  const client = new OpenAI({
    apiKey: config.llmApiKey,
    baseURL: config.llmBaseUrl,
    timeout: 45_000,
    maxRetries: 1,
  });

  const response = await client.chat.completions.create({
    model: config.llmModel,
    messages,
    temperature: options.temperature ?? 0.2,
    max_tokens: options.maxTokens ?? 800,
  });

  const choice = response.choices[0];
  const content = choice?.message?.content;
  if (typeof content !== "string" || content.trim() === "") {
    throw new Error("The configured model returned no text content.");
  }

  return {
    content,
    model: response.model || config.llmModel,
    usage: response.usage
      ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        }
      : undefined,
  };
}
