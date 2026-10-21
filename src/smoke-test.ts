import "dotenv/config";
import { chat } from "./providers/llm.js";

const result = await chat([
  {
    role: "system",
    content: "You are ProofLoop, a careful AI coding agent. Be concise and truthful.",
  },
  {
    role: "user",
    content: "Explain how to debug a failing Node.js test in exactly three numbered steps.",
  },
], { maxTokens: 300 });

console.log("Model:", result.model);
console.log(result.content);
if (result.usage) console.log("Token usage:", result.usage);
