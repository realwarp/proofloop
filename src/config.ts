import "dotenv/config";

function readPort(value: string | undefined): number {
  const port = Number(value ?? "8787");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }
  return port;
}

export const config = {
  host: process.env.HOST ?? "127.0.0.1",
  port: readPort(process.env.PORT),
  llmApiKey: process.env.LLM_API_KEY ?? "",
  llmBaseUrl: process.env.LLM_BASE_URL ?? "https://integrate.api.nvidia.com/v1",
  llmModel: process.env.LLM_MODEL ?? "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
  tavilyApiKey: process.env.TAVILY_API_KEY ?? "",
  langSmithApiKey: process.env.LANGSMITH_API_KEY ?? "",
};
