export interface AgentPlan {
  goal: string;
  steps: string[];
  checks: string[];
  risks: string[];
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

/** Parse a JSON object returned by the model without trusting its shape. */
export function parseAgentPlan(raw: string): AgentPlan {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("Model plan must be valid JSON.");
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Model plan must be a JSON object.");
  }
  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.goal !== "string" ||
    candidate.goal.trim().length < 3 ||
    candidate.goal.length > 500 ||
    !isStringArray(candidate.steps) ||
    candidate.steps.length < 1 ||
    candidate.steps.length > 12 ||
    candidate.steps.some((step) => step.length > 500) ||
    !isStringArray(candidate.checks) ||
    candidate.checks.length > 12 ||
    candidate.checks.some((check) => check.length > 500) ||
    !isStringArray(candidate.risks) ||
    candidate.risks.length > 12 ||
    candidate.risks.some((risk) => risk.length > 500)
  ) {
    throw new Error("Model plan did not match the required schema or size limits.");
  }

  return {
    goal: candidate.goal.trim(),
    steps: candidate.steps.map((step) => step.trim()),
    checks: candidate.checks.map((check) => check.trim()),
    risks: candidate.risks.map((risk) => risk.trim()),
  };
}
