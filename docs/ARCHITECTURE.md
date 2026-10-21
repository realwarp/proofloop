# ProofLoop Architecture

## Current scaffold

```text
Client / curl
    |
    v
Node.js HTTP API
    |-- GET /api/health
    |-- POST /api/agent/plan
    |
    v
Provider-neutral model adapter
    |
    v
Configured OpenAI-compatible inference API
```

## Target workflow

1. Receive a task and an explicitly selected repository path.
2. Validate path and repository size; make an isolated temporary working copy.
3. Inspect files and tests without executing repository code.
4. Ask the configured model for a structured plan and proposed changes.
5. Validate every requested file path and patch format.
6. Apply patch only inside the temporary working copy.
7. Execute a strict allowlist of test/build commands using a container or similarly isolated runner with no secrets and restricted networking.
8. Capture stdout/stderr, exit code, duration, and timeout status.
9. On failure, provide limited test output to the model and allow a bounded repair attempt.
10. Produce evidence-backed verdict: passed, failed, or unverified.
11. Keep a run record and compare iterative execution against a single-pass baseline.

## Safety boundaries

- Do not run arbitrary model-generated shell commands.
- Never mount the host home directory or Docker socket into task containers.
- Never pass provider credentials to the tested code.
- Enforce time, memory, output-size, and retry limits.
- Require user consent before exporting or applying patches outside the isolated workspace.
- Treat source files, test output, and web search results as untrusted input.
- A model's self-report must never determine test status; use process exit codes and captured outputs.

## Provider strategy

Inference provider and execution environment are separate interfaces. NVIDIA API Catalog is a temporary development provider. The hackathon submission must use Nebius Token Factory or Nebius AI Cloud as stated in official rules. Validate the currently required Token Factory sandbox workflow early; local execution is for development only.
