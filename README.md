# ProofLoop

> A research-grounded coding agent that edits code, runs tests, and reports evidence of whether a task succeeded.

ProofLoop is the project for the Nebius x NVIDIA Global AI Hackathon. Its core thesis: a coding agent should be judged by executable evidence, not its claim that a patch is correct.

## Current status

**Early scaffold — not yet a working autonomous coding agent.** The repository includes provider-configurable inference, a planning API, runtime validation, a live Token Factory preflight, a Token Factory Sandboxes smoke test, and a deterministic Express migration fixture. The complete patch-and-repair workflow is not implemented yet. Nebius account access and any live endpoint have not been verified.

## Narrow MVP

ProofLoop's first supported task is an Express 4 → Express 5 SPA wildcard-route migration. The agent must preserve a health endpoint and ensure root and nested client routes return the app shell. The fixture intentionally starts with an invalid Express 5 wildcard and includes three HTTP regression tests.

## Infrastructure plan

**Primary plan: Nebius AI Cloud Serverless AI endpoint serving an NVIDIA open Nemotron model**, subject to account access and an approved no-cost path or explicit user approval of the displayed cost.

Read [Nebius AI Cloud path and stop-before-spend gate](docs/AI_CLOUD_PATH.md) before creating any cloud resource. Nebius's official hackathon FAQ says the documented builder credits are Token Factory credits and there is no separate published AI Cloud credit grant. Nebius's current AI Cloud signup flow describes a $25 first payment when a card is added, and model endpoints are chargeable. We will not add a card or create a GPU endpoint without explicit approval.

See also:
- [Infrastructure gate](docs/INFRASTRUCTURE_GATE.md)
- [Track/product decision](docs/DECISION.md)
- [Migration scenario and acceptance criteria](docs/MIGRATION_SCENARIO.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development notes](docs/DEVELOPMENT.md)

## Stack

- TypeScript and Node.js
- Provider-neutral OpenAI-compatible LLM adapter
- Planned production inference: NVIDIA Nemotron Nano 9B v2 hosted in a Nebius AI Cloud Serverless AI endpoint via vLLM
- Isolated, bounded code execution on an approved Nebius compute path; local fixture runs are development-only
- Tavily for source-backed documentation research (planned)
- LangSmith for tracing/evaluation (planned)

## Requirements

- Node.js 20+
- npm
- Nebius AI Cloud account/project with required resource access and quota, if approved for use
- An explicit, reviewed no-cost credit path or user approval of the console's displayed cost before creating a chargeable resource

## Local quick start

~~~powershell
npm install
Copy-Item .env.example .env
~~~

Never commit `.env`. For temporary development inference, configure `LLM_API_KEY`, `LLM_BASE_URL`, and `LLM_MODEL` for a provider you can access, then run:

~~~powershell
npm run test:model
~~~

Once an approved Nebius AI Cloud endpoint exists, these same environment variables can point the adapter to its public HTTPS endpoint plus `/v1`, the endpoint's generated bearer token, and the exact Nemotron model ID served by vLLM. Follow [docs/AI_CLOUD_PATH.md](docs/AI_CLOUD_PATH.md). Do not create the endpoint merely to test this scaffold without first checking cost and getting approval.

Start the local API scaffold:

~~~powershell
npm run dev
~~~

Health endpoint: http://127.0.0.1:8787/api/health

The current `POST /api/agent/plan` endpoint only generates and validates a plan. It does not inspect a repository, edit code, or run tests.

## Optional Token Factory checks

The repository retains Token Factory preflight scripts as a fallback path, but these are not proof that AI Cloud is available. For Token Factory, configure `NEBIUS_API_KEY` and `NEBIUS_PROJECT_ID` and follow [docs/INFRASTRUCTURE_GATE.md](docs/INFRASTRUCTURE_GATE.md). Do not substitute Token Factory credits for AI Cloud credits or confuse the Token Factory API key with a cloud endpoint's generated bearer token.

## Run the migration fixture locally

~~~powershell
npm run verify:fixture
~~~

This reproduces the intentional Express 5 wildcard-route failure, applies the known minimal migration, runs the three tests, then restores the broken baseline. CI has verified this harness. It validates the fixture only, not the AI agent or a remote Nebius execution path.

## Safety principles

- Run generated code only in an isolated runner, never directly on the developer machine.
- Use allowed commands, deadlines, output limits and bounded repair attempts.
- Do not pass API keys or other secrets into a task runner.
- Never make a passing claim without the actual process exit code and test output.
- Treat source files, tool outputs and retrieved pages as untrusted input.
- Require explicit approval before exporting a patch into the user's original checkout.
- Never provision chargeable cloud resources without explicit approval.

## Roadmap

- [x] Initial TypeScript API scaffold
- [x] Provider-configurable inference adapter
- [x] Runtime validation for model-generated plans
- [x] Optional Token Factory inference and sandbox preflight scripts
- [x] Express migration fixture and acceptance tests
- [x] Document AI Cloud deployment path and no-spend gate
- [ ] Confirm AI Cloud account/resource access without making a payment
- [ ] Confirm approved credit path or receive explicit cost approval
- [ ] Deploy Nemotron to AI Cloud and pass live inference test
- [ ] Inspect a controlled workspace
- [ ] Generate and apply structured patches in approved cloud compute
- [ ] Execute tests and bounded repair attempts
- [ ] Evidence report and run history
- [ ] Tavily research and LangSmith evaluation
- [ ] Deploy demo, record video, and submit

## License

MIT. See [LICENSE](LICENSE).
