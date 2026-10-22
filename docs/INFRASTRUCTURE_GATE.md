# Infrastructure Gate

Do these checks before major UI work. The account must be checked by the owner in the console because this environment cannot authenticate to your account. Never paste secrets into chat or commit .env.

## Primary path: Nebius AI Cloud

Read [AI Cloud Path](AI_CLOUD_PATH.md) first.

### Gate 0 — account access and cost, without provisioning

1. Open https://console.nebius.com and sign in using legitimate account details.
2. Check whether a tenant/project appears.
3. Inspect billing and available balance/credits only. Do not add a card or click Create endpoint.
4. If no explicit AI Cloud credits or support-approved no-cost route is shown, stop. The official FAQ says Builder Program credits are specifically for Token Factory, and Nebius's signup guide states that adding a card charges $25 initially.
5. If AI Cloud onboarding is blocked because of country/card support, continue through the official support thread. Do not bypass billing-country restrictions.

Official references:
- Hackathon FAQ: https://nebiusglobalaihackathon.devpost.com/details/faqs
- Signup and billing: https://docs.nebius.com/signup-billing/sign-up
- Serverless endpoint model deployment: https://docs.nebius.com/serverless/tutorials/deploy-model
- Live pricing: https://nebius.com/prices

Current price pages list NVIDIA L40S Intel on-demand from $1.55/GPU-hour; CPU, memory, storage, applicable taxes, regional availability and service-specific billing may add cost. The endpoint guide explicitly says the endpoint and underlying compute are chargeable. Treat the console estimate as authoritative and require explicit user approval before creating anything.

### Intended AI Cloud model endpoint (only after approval)

Use the official Serverless AI endpoint and vLLM workflow to host the open NVIDIA model:

nvidia/NVIDIA-Nemotron-Nano-9B-v2

Model card: https://huggingface.co/nvidia/NVIDIA-Nemotron-Nano-9B-v2

The official Nebius tutorial demonstrates a custom endpoint using vllm/vllm-openai:v0.18.0-cu130, port 8000, GPU compute, and bearer-token authentication. The model is downloaded from Hugging Face when the endpoint starts. Follow the current tutorial and model card for exact runtime options. Do not create the resource just to see whether it works before the cost gate passes.

After the endpoint is running:
- Copy its public HTTPS URL and append /v1 for LLM_BASE_URL.
- Set LLM_API_KEY to the endpoint's generated bearer token.
- Set LLM_MODEL to the exact model ID served by vLLM.
- Run npm run test:model to test a real inference request.
- Optionally verify GET <endpoint-url>/v1/models with the endpoint bearer token.

### Coding-agent execution gate

A working model endpoint alone does not prove ProofLoop can execute and test code on Nebius. The first real agent task must run in an allowed Nebius AI Cloud compute service, with a controlled workspace and actual test output. The local Express fixture is only development evidence.

The Coding and Agentic Engineering track text specifically references Token Factory. Because this plan uses AI Cloud instead, confirm the track-fit interpretation with the official organizers before submission. The general project rules permit either Token Factory or AI Cloud, but do not silently assume track-specific wording is waived.

## Optional alternate path: Token Factory diagnostics

These scripts remain available if official support later unblocks Token Factory. Configure NEBIUS_API_KEY, NEBIUS_PROJECT_ID, NEBIUS_BASE_URL, and NEBIUS_MODEL in .env and run:

~~~powershell
npm run preflight:nebius
~~~

Token Factory Sandboxes requires separate beta access:

~~~powershell
py -3.12 -m venv .venv-sandbox
.\.venv-sandbox\Scripts\Activate.ps1
python -m pip install -r requirements-sandbox.txt
npm run preflight:sandbox
~~~

These checks are optional for the current AI Cloud plan and must not be described as AI Cloud access tests.

## Pass checklist

- [ ] Legitimate AI Cloud console access checked.
- [ ] No-cost credit path confirmed or exact cost explicitly approved by the user.
- [ ] AI Cloud endpoint served NVIDIA's open Nemotron model.
- [ ] Real chat completion returned from that endpoint.
- [ ] Actual coding task ran on an allowed Nebius AI Cloud compute path.
- [ ] Baseline failure was reproduced in that cloud environment.
- [ ] Model-generated patch passed regression tests in that cloud environment.
- [ ] Track-fit caveat resolved with the official organizers if needed.

Do not mark a gate passed from documentation alone or from a model's claim.