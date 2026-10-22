# MVP Scenario: Express 4 → Express 5 SPA Fallback

**Track:** Coding and Agentic Engineering  
**Scope:** One documented compatibility change, one focused patch, and three HTTP regression checks.

## Problem

An Express 4 application may define a catch-all route using an unnamed wildcard:

~~~js
app.get('*', (_req, res) => res.status(200).send('app-shell'));
~~~

Express 5 requires named wildcards. The documented path /{*splat} also matches the root URL, whereas /*splat does not. Official source:
https://expressjs.com/en/guide/migrating-5/

## Agent task

"Migrate this Express 4-style SPA fallback to Express 5-compatible route syntax without changing intended behavior. Preserve the health endpoint and ensure both the root URL and a nested client-side route return the app shell."

## Acceptance criteria

1. GET /health returns HTTP 200 with JSON {"ok":true}.
2. GET / returns HTTP 200 with body app-shell.
3. GET /dashboard/settings returns HTTP 200 with body app-shell.
4. The original route produces a reproducible failure under Express 5.
5. The patched fixture passes all three tests in a clean environment.
6. ProofLoop records the actual patch, command, exit code, bounded stdout/stderr, selected model ID, and duration.
7. The verdict is based on process exit codes and test results, never on the model's self-report.

## Non-goals

- No universal migration support across arbitrary repositories.
- No multi-language executor in the MVP.
- No production repository writes.
- No unrestricted model-generated shell commands.
- No claim that one fixture proves general coding-agent reliability.

This narrow task creates a repeatable first evaluation for inspect → plan → patch → test → repair → evidence.
