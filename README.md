# ProofLoop

> A research-grounded coding agent that edits code, runs tests, and reports evidence of whether a task succeeded.

ProofLoop is the project for the Nebius x NVIDIA Global AI Hackathon. Our core thesis: a coding agent should be judged by executable evidence, not its claim that a patch is correct.

## Current status

**Early scaffold — not yet a working autonomous coding agent.** The repository currently includes provider-configurable inference, a planning API, runtime validation, a live-inference preflight, a Token Factory Sandboxes smoke test, and a deterministic Express migration fixture. The complete patch-and-repair workflow is not implemented yet.

## Narrow MVP

ProofLoop's first supported task is an Express 4 → Express 5 SPA wildcard-route migration. The agent must preserve a health endpoint and ensure root and nested client routes return the app shell. The fixture intentionally starts with an invalid Express 5 wildcard and includes three HTTP regression tests.

See:
- [Infrastructure gate](docs/INFRASTRUCTURE_GATE.md)
- [Migration scenario and acceptance criteria](docs/MIGRATION_SCENARIO.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development notes](docs/DEVELOPMENT.md)

## Stack

- TypeScript and Node.js
- OpenAI-compatible LLM adapter, configurable with environment variables
- Nebius Token Factory for required NVIDIA model inference in the final entry
- Token Factory Sandboxes for isolated code execution, if project beta access is enabled
- Tavily for source-backed documentation research (planned)
- LangSmith for tracing/evaluation (planned)

## Requirements

- Node.js 20+
- npm
- Python 3.12 for the sandbox smoke test
- Token Factory API key and project ID for the Nebius preflight; Sandboxes access must be approved separately

## Quick start

~~~powershell
npm install
Copy-Item .env.example .env
~~~

Edit .env locally. Never commit it. For the existing temporary development smoke test, configure LLM_API_KEY, LLM_BASE_URL and LLM_MODEL, then run:

~~~powershell
npm run test:model
~~~

Start the local scaffold API:

~~~powershell
npm run dev
~~~

Health endpoint: http://127.0.0.1:8787/api/health

The current POST /api/agent/plan endpoint only generates and validates a plan. It does not inspect a repository, edit code or run tests.

## Required infrastructure preflight

Configure NEBIUS_API_KEY and NEBIUS_PROJECT_ID in .env, then run:

~~~powershell
npm run preflight:nebius
~~~

This makes a live model-catalogue request and a small real inference request, selecting a Nemotron model that the authenticated catalogue returns.

Sandboxes is a separate beta access gate. With Python 3.12 activated and requirements installed, run:

~~~powershell
python -m pip install -r requirements-sandbox.txt
npm run preflight:sandbox
~~~

Follow [docs/INFRASTRUCTURE_GATE.md](docs/INFRASTRUCTURE_GATE.md) and official [Token Factory Sandboxes setup](https://docs.tokenfactory.nebius.com/sandboxes/start/set-up-access). If access is inactive, request activation; do not substitute local execution and claim it proves the required cloud sandbox works.

## Run the migration fixture locally

~~~powershell
npm run fixture:install
npm run fixture:test
~~~

The untouched fixture is expected to fail at startup because the wildcard route is intentionally incompatible with Express 5.1.0. This is the baseline defect, not a passing result. ProofLoop still needs to apply a patch and rerun these tests in the approved remote sandbox.

## Safety principles

- Run generated code only in an isolated runner, never directly on the developer machine.
- Use allowed commands, deadlines, output limits and bounded repair attempts.
- Do not pass API keys or other secrets into the sandbox.
- Never make a passing claim without the actual process exit code and test output.
- Treat source files, tool outputs and retrieved pages as untrusted input.
- Require explicit approval before exporting a patch into the user's original checkout.

## Roadmap

- [x] Initial TypeScript API scaffold
- [x] Provider-configurable inference adapter
- [x] Runtime validation for model-generated plans
- [x] Nebius inference and sandbox preflight scripts
- [x] Express migration fixture and acceptance tests
- [ ] Validate real Token Factory model access
- [ ] Validate Token Factory Sandboxes access
- [ ] Inspect a controlled workspace
- [ ] Generate and apply structured patches in sandbox
- [ ] Execute tests and bounded repair attempts
- [ ] Evidence report and run history
- [ ] Tavily research and LangSmith evaluation
- [ ] Deploy demo, record video, and submit

## License

MIT. See [LICENSE](LICENSE).
