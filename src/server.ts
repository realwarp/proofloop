import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { config } from "./config.js";
import { chat } from "./providers/llm.js";

const MAX_BODY_BYTES = 16 * 1024;
const startedAt = Date.now();

function sendJson(
  res: ServerResponse,
  status: number,
  payload: unknown,
): void {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  res.end(JSON.stringify(payload, null, 2));
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk.toString();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      throw new Error("Request body exceeds the 16 KB limit.");
    }
  }
  try {
    return JSON.parse(raw || "{}") as unknown;
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

const server = createServer(async (req, res) => {
  const requestId = randomUUID();
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      name: "ProofLoop API",
      version: "0.1.0",
      uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
      configured: {
        inferenceKey: Boolean(config.llmApiKey),
        tavilyKey: Boolean(config.tavilyApiKey),
        langSmithKey: Boolean(config.langSmithApiKey),
      },
      note: "Scaffold only: no repository code is executed yet.",
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/agent/plan") {
    try {
      const body = await readJson(req);
      if (!body || typeof body !== "object" || !("task" in body)) {
        sendJson(res, 400, { error: "Send JSON with a task string.", requestId });
        return;
      }
      const task = (body as { task?: unknown }).task;
      if (typeof task !== "string" || task.trim().length < 8 || task.length > 4000) {
        sendJson(res, 400, {
          error: "task must be a string between 8 and 4000 characters.",
          requestId,
        });
        return;
      }
      const reply = await chat([
        {
          role: "system",
          content: [
            "You are ProofLoop's planning component.",
            "Do not claim you inspected a repository or ran commands.",
            "Produce a short, cautious plan for a coding task.",
            "Return JSON with keys: goal, steps (array of strings), checks (array of strings), risks (array of strings).",
            "Do not include executable shell commands at this stage.",
          ].join(" "),
        },
        { role: "user", content: task.trim() },
      ], { maxTokens: 700 });

      sendJson(res, 200, {
        requestId,
        status: "plan_generated",
        model: reply.model,
        planText: reply.content,
        usage: reply.usage ?? null,
        disclaimer: "Planning only. No repository was read or modified, and no tests were run.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error.";
      const status = message.includes("exceeds") ? 413 : 502;
      sendJson(res, status, { error: message, requestId });
    }
    return;
  }

  sendJson(res, 404, {
    error: "Route not found.",
    routes: ["GET /api/health", "POST /api/agent/plan"],
    requestId,
  });
});

server.listen(config.port, config.host, () => {
  console.log(`ProofLoop API listening at http://${config.host}:${config.port}`);
  console.log("Health check: GET /api/health");
});
