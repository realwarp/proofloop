# Infrastructure Gate

Do these checks before major UI work. Run them on the Windows development machine because this environment cannot authenticate to your account. Do not paste secrets into chat or commit .env.

## 1. Credentials

Add these values to the root .env file:

~~~dotenv
NEBIUS_API_KEY=your_token_factory_api_key
NEBIUS_PROJECT_ID=your_token_factory_project_id
NEBIUS_BASE_URL=https://api.tokenfactory.nebius.com/v1
NEBIUS_MODEL=nvidia/nemotron-3-super-120b-a12b
~~~

The API key and project ID are separate values. Do not use an NVIDIA API Catalog key.

## 2. Verify inference access

Run:

~~~powershell
node scripts/nebius-preflight.mjs
~~~

The script requests GET /v1/models, prints NVIDIA Nemotron IDs visible to the key, then sends a tiny real chat-completion request with an ID returned by that catalogue. Both requests must succeed to pass this gate.

If /models is unsupported or fails, verify the current API endpoint docs before assuming access works. Do not fabricate a model ID or mark this gate passed without a real inference response.

## 3. Verify Token Factory Sandboxes access

Sandboxes is a beta feature with separate project access. Official setup guide:
https://docs.tokenfactory.nebius.com/sandboxes/start/set-up-access

Use Python 3.12 for the official quickstart:

~~~powershell
py -3.12 -m venv .venv-sandbox
.\.venv-sandbox\Scripts\Activate.ps1
python -m pip install -r requirements-sandbox.txt
python scripts/sandbox-smoke.py
~~~

The smoke test follows the official SDK pattern: save a marker file in one operation, then read the marker from the returned image in a second operation. Expected output includes:

~~~text
[PASS] Sandbox execution succeeded.
[PASS] Saved filesystem state was reused in a second operation.
Proof: PROOFLOOP_SANDBOX_OK
~~~

If access is inactive or forbidden, request Sandboxes activation in the Token Factory console and contact contree@nebius.com with the project ID and profile status. Never send your API key. Local execution is useful for development but does not prove Token Factory Sandboxes access.

## 4. Gate checklist

- [ ] Model catalogue request succeeded.
- [ ] At least one NVIDIA Nemotron model was returned for this project.
- [ ] Real inference request succeeded.
- [ ] Sandboxes smoke test returned the marker from a second operation.
- [ ] Express migration fixture baseline failure is reproduced in Sandboxes.
- [ ] Agent-generated patch passes all fixture regression tests in Sandboxes.

Do not mark a gate passed unless the corresponding command's actual output has been recorded.
