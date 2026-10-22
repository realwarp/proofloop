import asyncio
import os
import sys

from dotenv import load_dotenv
from contree_sdk import Contree

load_dotenv()

if not os.getenv("NEBIUS_API_KEY", "").strip():
    print("[BLOCKED] Set NEBIUS_API_KEY in the local .env.")
    sys.exit(2)
if not os.getenv("NEBIUS_PROJECT_ID", "").strip():
    print("[BLOCKED] Set NEBIUS_PROJECT_ID in the local .env.")
    sys.exit(2)

async def main() -> None:
    print("ProofLoop Token Factory Sandboxes smoke test")
    print("This runs a harmless write/read test, not repository code.")
    client = Contree()
    base = await client.images.use("alpine:3.19", strict=True)

    first = await base.run(
        shell="printf 'PROOFLOOP_SANDBOX_OK\\n' > /tmp/proofloop-sandbox.txt && echo write-ok",
        disposable=False,
    )
    if first.exit_code != 0:
        raise RuntimeError(f"First operation failed (exit {first.exit_code}): {first.stderr}")
    if not first.uuid:
        raise RuntimeError("The first operation did not return a saved image UUID.")

    print(f"Saved image UUID: {first.uuid}")
    second = await first.run(
        shell="cat /tmp/proofloop-sandbox.txt",
        disposable=True,
    )
    if second.exit_code != 0:
        raise RuntimeError(f"Readback operation failed (exit {second.exit_code}): {second.stderr}")
    if "PROOFLOOP_SANDBOX_OK" not in (second.stdout or ""):
        raise RuntimeError("The second operation did not find the expected marker.")

    print("[PASS] Sandbox execution succeeded.")
    print("[PASS] Saved filesystem state was reused in a second operation.")
    print(f"Proof: {(second.stdout or '').strip()}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as exc:
        message = str(exc).lower()
        print("[BLOCKED/FAIL] Sandbox check did not complete.")
        if "inactive" in message or "forbidden" in message or "403" in message:
            print("Likely cause: Sandboxes beta access or project permissions are missing. Request activation and contact contree@nebius.com with the project ID/profile status. Never send the API key.")
        elif "401" in message or "unauthorized" in message:
            print("Likely cause: invalid credentials, wrong project, or missing authorization.")
        else:
            print("Check credentials, network, image availability, and exception details.")
        print(f"{type(exc).__name__}: {exc}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as exc:
        print(f"[FAIL] {type(exc).__name__}: {exc}")
        sys.exit(1)
