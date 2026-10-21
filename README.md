# ProofLoop

> A research-grounded AI coding agent that edits code, runs tests, and reports evidence of whether a task succeeded.

ProofLoop is being built for the Nebius x NVIDIA Global AI Hackathon. Its goal is not just to generate a code patch, but to execute a bounded engineering workflow and report verifiable outcomes.

## Project status

**Early scaffold — not production-ready.** This repository currently establishes the architecture and first milestone. Provider credentials and sandbox execution must be configured locally.

## MVP

1. Accept a coding task and a small, trusted local sample repository.
2. Inspect the repository and ask an LLM to propose a structured plan/patch.
3. Apply changes only inside a temporary working copy.
4. Run configured tests/build commands under resource and time limits.
5. Feed failures back into the model for a bounded repair attempt.
6. Produce a report containing the diff, executed commands, output, source references, and an honest pass/fail/unverified verdict.
7. Record runs so a single-pass baseline can be compared with the iterative workflow.

## Intended stack

- TypeScript + Node.js
- OpenAI-compatible inference adapter (NVIDIA API Catalog during development; Nebius Token Factory when access is available)
- Tavily for targeted documentation research
- LangSmith for tracing/evaluation when configured
- Isolated code execution; never run untrusted repository scripts directly on the host

## Requirements

- Node.js 20 or newer
- npm
- An inference API key for live model calls (optional for local scaffolding/tests)

## Quick start

```bash
npm install
cp .env.example .env
# Edit .env and add your development inference API key.
npm run dev
```

The initial scaffold starts a small local API and exposes a health endpoint. The model-inference smoke test can be run with:

```bash
npm run test:model
```

Do not commit `.env`, API keys, tokens, private source code, or secrets.

## Environment variables

See [`.env.example`](.env.example). The model adapter is provider-configurable:

- `LLM_API_KEY`
- `LLM_BASE_URL`
- `LLM_MODEL`

For development, an OpenAI-compatible NVIDIA endpoint may be used if the chosen model is available to your account. The hackathon submission must still use Nebius Token Factory or Nebius AI Cloud and an NVIDIA open-source model in accordance with the official rules. Using an alternate provider alone does not satisfy that requirement.

## Safety design

- Execute tasks only in an isolated workspace.
- Use an allowlist of test/build commands.
- Enforce timeouts and output limits.
- Do not pass environment secrets into task execution.
- Require explicit user approval before exporting/applying a patch.
- Treat repository files, test output, and retrieved web pages as untrusted input.
- Never claim a task passed unless the required commands actually passed.

## Roadmap

- [x] Initial project direction and scaffold
- [ ] Model-provider adapter and health check
- [ ] Safe sample-workspace inspection
- [ ] Structured planning and patch proposals
- [ ] Isolated test execution with bounded timeout
- [ ] Bounded repair loop
- [ ] Evidence report and run history
- [ ] Tavily research integration
- [ ] LangSmith tracing and evaluation suite
- [ ] Nebius integration and required execution path
- [ ] Public demo deployment and video

## License

MIT. See [LICENSE](LICENSE).
