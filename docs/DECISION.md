# Track and Product Decision

**Decision date:** 22 October 2026  
**Chosen project:** ProofLoop  
**Primary track:** Coding and Agentic Engineering  
**Primary infrastructure plan:** Nebius AI Cloud Serverless AI endpoint, conditional on legitimate access and a no-cost or explicitly approved cost path.

## The short list

| Idea | Track fit | Value | Primary risk | Decision |
|---|---|---|---|---|
| ProofLoop: evidence-backed coding/migration agent | Coding and Agentic Engineering | Researches a documented change, patches a repo, runs tests, repairs within a limit, and reports evidence | Cloud access, endpoint cost, and safe code execution | **Selected** |
| Traceback: reproducible incident-to-fix investigator | Best Apps and Agents | Correlates logs and code/dependency changes into a sourced diagnosis and reproducible test | Hard to prove root cause with realistic incident data in time | Do not start separately |
| Dependency Upgrade Verifier | Coding and Agentic Engineering / Best Apps and Agents | Tests whether an upgrade breaks an app and creates a version-specific fix | Risks being a basic migration bot | Incorporated as ProofLoop's narrow migration fixture |

## Track assessment

### Coding and Agentic Engineering — chosen, with a track-fit caveat
The product is a coding agent that writes, runs, tests, and iterates on a real repository. The official track description specifically mentions Token Factory. The general project rules also allow Nebius AI Cloud, but an AI Cloud-only submission may be less directly aligned with that track wording. If Token Factory remains inaccessible, ask the organizers in the support thread whether an AI Cloud Serverless endpoint plus AI Cloud compute for the code/test workflow is acceptable for this track. Do not assume this detail is waived.

### Best Apps and Agents — not selected yet
This could be an alternative if the organizers say Coding and Agentic Engineering specifically requires Token Factory. Its own description also recommends Nemotron through Token Factory, so ask for an explicit track-fit answer rather than changing categories merely to hide the infrastructure choice.

### Personal AI — not selected
Persistent memory, reusable skills, and user-authorized actions introduce a separate product problem and extra security work.

### Physical AI — not selected
No physical-hardware project is selected or validated. It adds unnecessary delivery risk for the software-first MVP.

## Infrastructure decision and hard gates

The user has chosen to pursue Nebius AI Cloud because Token Factory onboarding is blocked. The selected route is to serve the open NVIDIA model nvidia/NVIDIA-Nemotron-Nano-9B-v2 through vLLM in a Nebius AI Cloud Serverless AI endpoint, then configure ProofLoop's existing OpenAI-compatible adapter to call that endpoint. The coding task and tests must also execute on an allowed, documented Nebius AI Cloud compute path for the demo; local runs are development evidence only.

1. Verify AI Cloud console access using legitimate account details, without changing billing information.
2. Determine whether an explicit AI Cloud credit grant or support-approved no-cost route exists.
3. Do not add a card, pay, create an endpoint, allocate a GPU, or start billable compute without the user's explicit approval of the displayed cost.
4. Once authorized, create the endpoint, confirm the served model through /v1/models, and make a real chat-completion request.
5. Reproduce the Express 5 unnamed-wildcard failure and pass the three regression tests in the approved cloud execution path.
6. Only after the infrastructure gates pass should the team invest in the agent loop and UI.

The official hackathon FAQ says the published builder-program promotional credits are Token Factory credits, not a separate AI Cloud grant, and country/billing onboarding issues can affect Token Factory / AI Cloud access. Nebius's signup guide says adding a card charges a $25 first payment. Sources:
- https://nebiusglobalaihackathon.devpost.com/details/faqs
- https://docs.nebius.com/signup-billing/sign-up
- https://docs.nebius.com/serverless/tutorials/deploy-model

No false billing details or country workarounds. If access is blocked, stay with official support. If the required infrastructure cannot be accessed within budget, the entry is not yet technically verified as compliant.

## Why Express 4 to Express 5 wildcard migration?

The official Express migration guide says wildcard routes require named wildcards in Express 5; /{*splat} matches the root URL too. The fixture retains a health route and tests /, /health, and /dashboard/settings. This creates a compact, deterministic evaluation task rather than a claim of universal code repair.

Source: https://expressjs.com/en/guide/migrating-5/

## Success evidence

- Account/resource availability and cost path documented before provisioning.
- Actual Nemotron model ID returned by the deployed vLLM endpoint.
- A successful inference request through the endpoint hosted on Nebius AI Cloud.
- Evidence that the coding task executes on an approved Nebius AI Cloud compute path.
- Reproducible baseline failure and agent-generated diff passing the same regression suite.
- An evaluation comparing single-pass patch generation with the bounded repair loop, reporting all observed results without cherry-picking.