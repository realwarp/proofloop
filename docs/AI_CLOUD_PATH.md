# Nebius AI Cloud Path (Primary Infrastructure Plan)

**Chosen path:** Nebius AI Cloud Serverless AI endpoint hosting an open NVIDIA Nemotron model.  
**Current status:** Design researched; account/resource access not verified. Do not mark the infrastructure gate passed until there is a real completion response.

## Critical cost and access gate

The hackathon FAQ says country-based onboarding limitations can affect access to **Token Factory / AI Cloud**, and that the published promotional credits are for Token Factory; there is no separate published AI Cloud credit grant:
https://nebiusglobalaihackathon.devpost.com/details/faqs

Nebius's current AI Cloud signup docs say that adding a card during billing setup charges a **$25 first payment** and credits that amount to the account balance:
https://docs.nebius.com/signup-billing/sign-up

The official AI Cloud model-endpoint tutorial says endpoint resources are chargeable:
https://docs.nebius.com/serverless/tutorials/deploy-model

**Do not add a card, make a payment, create an endpoint, or allocate a GPU without the user's explicit approval of the exact cost.** First test account-console access only. If billing onboarding blocks the account, ask Nebius support through the official hackathon Discord/support post whether an approved, no-cost AI Cloud route is available. Do not change country, address, or billing details to bypass eligibility.

## Proposed inference architecture

- Product: ProofLoop.
- Model: `nvidia/NVIDIA-Nemotron-Nano-9B-v2` (open NVIDIA model; NVIDIA open-model license).
- Serving: vLLM OpenAI-compatible server in a Nebius AI Cloud Serverless AI endpoint.
- Runtime: ProofLoop keeps its provider-neutral OpenAI-compatible adapter. Set its base URL to the endpoint public URL plus `/v1`, its API key to the endpoint's generated bearer token, and its model ID to the exact model ID configured in vLLM.
- Target proof: authenticated `GET /v1/models`, a real `POST /v1/chat/completions`, and a log/screenshot showing the endpoint running on Nebius AI Cloud.

Official Nebius docs demonstrate creating a custom Serverless AI endpoint using a vLLM OpenAI image, a GPU, a public endpoint, and bearer-token authentication. They show a baseline NVIDIA L40S preset (1 GPU, 8 CPUs, 32 GiB RAM); the endpoint and compute are chargeable. Use the console's current price estimate and available quota rather than assuming a price from a cached example.

Official model resources:
- Model card: https://huggingface.co/nvidia/NVIDIA-Nemotron-Nano-9B-v2
- NVIDIA Nemotron overview: https://developer.nvidia.com/topics/ai/Nemotron

The model card's listed vLLM guidance should be followed for any needed flags, including its Nemotron-H cache guidance, and the exact runtime compatibility must be tested before claiming success.

## Deployment gate — access only first

1. Open https://console.nebius.com and sign in with your legitimate account details.
2. Confirm that a tenant/project console opens. Do not click Create endpoint or allocate compute yet.
3. Inspect whether billing setup is required and whether the account shows a balance or explicit AI Cloud credits. Do not infer AI Cloud credits from the Token Factory Builder Program email.
4. If the console requests a card/first payment, stop there. The published signup flow describes a $25 first payment. Ask support whether a no-cost route is possible.
5. Only after the user explicitly approves a displayed cost or support confirms a no-cost credit path should an endpoint be created.

## When deployment is approved

Use the Nebius console UI:
1. Go to **Serverless AI → Endpoints → Create endpoint**.
2. Choose the custom vLLM OpenAI-compatible container workflow shown by the official tutorial.
3. Configure the model as `nvidia/NVIDIA-Nemotron-Nano-9B-v2` and use the supported vLLM options from its model card.
4. Enable bearer-token authentication. Store the token only in the local, git-ignored `.env`.
5. Use the console's displayed GPU/platform and current cost estimate; do not assume a preset is available in the project's region/quota.
6. Wait for status **Running**, then copy the public HTTPS endpoint and test model-listing and chat-completion calls.
7. Immediately stop/delete the endpoint after a test if it is not needed. Verify deletion in the console; merely closing a browser does not stop compute.

## ProofLoop configuration after endpoint is running

Set the existing provider-adapter variables in the local `.env` (not in GitHub):

~~~dotenv
LLM_API_KEY=the_endpoint_bearer_token
LLM_BASE_URL=https://your-endpoint-public-host/v1
LLM_MODEL=nvidia/NVIDIA-Nemotron-Nano-9B-v2
~~~

Keep the endpoint token secret. Do not send it in chat. Do not write it in source code, screenshots, logs, issue posts, or the README.

## Code execution for the coding-agent workflow

The current project has a deterministic local fixture for the Express 4-to-5 wildcard-route migration. That is only a development test. To demonstrate the intended Nebius path, we must run the actual coding task/test job using an allowed Nebius AI Cloud compute service, capture the real process exit code and output, and preserve a reviewable patch. Do not label local execution as remote Nebius execution.

## Pass criteria

- [ ] AI Cloud console access confirmed without changing billing information.
- [ ] Exact no-cost credit status/cost path confirmed.
- [ ] Any chargeable resource creation explicitly approved by the user.
- [ ] Endpoint starts and serves the NVIDIA open model.
- [ ] A real chat completion succeeds and the returned model ID is recorded.
- [ ] The chosen AI Cloud compute path is documented in the Devpost submission.
- [ ] Coding-agent task execution and regression tests have real evidence.
