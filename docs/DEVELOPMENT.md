# Development Notes

## First milestone

- [ ] Create a local `.env` from `.env.example`
- [ ] Configure an available OpenAI-compatible NVIDIA model
- [ ] Run `npm install`
- [ ] Run `npm run typecheck`
- [ ] Run `npm run test:model`
- [ ] Run `npm run dev`
- [ ] Verify `GET http://127.0.0.1:8787/api/health`
- [ ] Try `POST /api/agent/plan` with a small coding task

Example:

```bash
curl -X POST http://127.0.0.1:8787/api/agent/plan ^
  -H "Content-Type: application/json" ^
  -d "{\"task\":\"Fix the function that formats an empty display name in a TypeScript utility.\"}"
```

PowerShell note: if curl behaves as a PowerShell alias, use `Invoke-RestMethod` or `curl.exe`.

## Next implementation tasks

1. Add tests for configuration and request validation.
2. Add repository manifest/inspection for a prebuilt sample project.
3. Define strict JSON schemas for model-produced plans and patches.
4. Add patch validation and path traversal protection.
5. Add an isolated test runner with command allowlisting and timeouts.
6. Add run storage and evidence model.
7. Add bounded repair loop.
8. Add Tavily research and citations.
9. Add LangSmith tracing and a deterministic evaluation suite.
10. Integrate Nebius and validate required hackathon execution services.
