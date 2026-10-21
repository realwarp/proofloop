# Source Layout

- `server.ts`: local JSON API server.
- `config.ts`: environment configuration.
- `providers/llm.ts`: provider-neutral OpenAI-compatible inference adapter.
- `schemas/plan.ts`: runtime schema validation for model-proposed plans.
- `smoke-test.ts`: live inference check.

## Current API

### Health

`GET /api/health`

Returns service status and whether optional credentials are configured. It does not disclose the credentials.

### Generate a plan

`POST /api/agent/plan`

Request:

```json
{
  "task": "Fix the bug where an empty display name produces undefined in a TypeScript utility."
}
```

Returns a validated plan object. This endpoint does not inspect a repository, edit files, or run tests. Those are subsequent milestones.
