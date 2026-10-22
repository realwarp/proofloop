# Track and Product Decision

**Decision date:** 22 October 2026  
**Chosen project:** ProofLoop  
**Primary track:** Coding and Agentic Engineering  
**Status:** Conditional on verifying Token Factory inference and Sandboxes access.

## The short list

| Idea | Track fit | Value | Primary risk | Decision |
|---|---|---|---|---|
| ProofLoop: evidence-backed coding/migration agent | Coding and Agentic Engineering | Inspects a repo, researches a documented change, patches it, runs tests, repairs within a limit, and reports evidence | Sandboxes beta access and reliable patch execution | **Selected** |
| Traceback: reproducible incident-to-fix investigator | Best Apps and Agents | Correlates logs and recent code/dependency changes into a sourced diagnosis and reproducible test | Hard to prove root cause with realistic incident data in time | Do not start separately |
| Dependency Upgrade Verifier | Coding and Agentic Engineering / Best Apps and Agents | Tests whether an upgrade breaks a real app and creates a version-specific fix | Risks being a basic migration bot unless execution/evaluation is unusually strong | Incorporate its narrow migration fixture into ProofLoop |

## Assessment of the four tracks

### Coding and Agentic Engineering — chosen
Best match to the project already started and the official track framing: an agent writes, runs, tests and iterates on code in Token Factory Sandboxes. The measurable claim is narrow: convert one deliberate Express migration failure into a passing patch and record actual run evidence.

### Best Apps and Agents — contingency
Could fit if Sandboxes access remains blocked but Token Factory inference becomes available. The product would need to change honestly into a research-grounded migration assistant that returns a reviewed patch/recommendation rather than claiming to execute code. This is a fallback only, not the current plan.

### Personal AI — not selected
Persistent memory, reusable skills and user-authorised actions introduce a separate product problem and extra integration/security paths. Little of that helps prove the chosen migration workflow before the deadline.

### Physical AI — not selected
No physical-hardware project has been selected or validated. The hardware and video requirements introduce unnecessary delivery risk for this software-first MVP.

## Hard gates

1. Validate the live Token Factory model catalogue and a real Nemotron inference call.
2. Validate Sandboxes permission using the official save-image/readback workflow.
3. Reproduce the Express 5 unnamed-wildcard failure and pass the three HTTP regression tests with the correct patch.
4. Only then invest in agent-loop UI or other polish.

If Token Factory access is blocked, continue through the official support thread. Consider Nebius AI Cloud only if the account already has no-cost credits or access, or the user explicitly approves a paid run: the hackathon FAQ says there is no separate published AI Cloud credit grant. Do not provision billable GPU resources merely to test a fallback, and do not falsify region or billing details. If the required Nebius platform/model cannot be used at all, a compliant submission is not currently technically verified.

## Why Express 4 → Express 5 wildcard migration?

The official Express migration guide says wildcard routes require named wildcards in Express 5, and /{*splat} is the documented form when the root URL must match too. The fixture retains a health route and tests /, /health, and /dashboard/settings. This creates a compact, deterministic and reviewable evaluation task rather than a claim of universal code repair.

Source: https://expressjs.com/en/guide/migrating-5/

## Success evidence

- Actual model ID from the authenticated Token Factory catalogue.
- A successful completion request through Token Factory.
- Sandbox operation IDs, image UUIDs, exit status and output from the persistence smoke test.
- A reproducible baseline failure.
- An agent-proposed diff that passes the same regression suite.
- An evaluation comparing single-pass patch generation with the bounded repair loop, reporting observed results without cherry-picking.
