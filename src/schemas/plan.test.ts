import test from "node:test";
import assert from "node:assert/strict";
import { parseAgentPlan } from "./plan.js";

test("accepts a valid plan", () => {
  const plan = parseAgentPlan(JSON.stringify({
    goal: "Fix empty display name formatting",
    steps: ["Inspect relevant function", "Add focused fix"],
    checks: ["Run unit tests"],
    risks: ["Potential behavior change for null values"],
  }));
  assert.equal(plan.steps.length, 2);
  assert.equal(plan.goal, "Fix empty display name formatting");
});

test("rejects malformed JSON", () => {
  assert.throws(() => parseAgentPlan("{not json"), /valid JSON/);
});

test("rejects empty or incorrectly shaped steps", () => {
  assert.throws(() => parseAgentPlan(JSON.stringify({
    goal: "Fix a bug",
    steps: [],
    checks: [],
    risks: [],
  })), /required schema/);
});

test("rejects a non-object top level", () => {
  assert.throws(() => parseAgentPlan(JSON.stringify(["step"])), /JSON object/);
});
