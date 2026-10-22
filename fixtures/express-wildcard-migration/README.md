# Express wildcard migration fixture

This fixture intentionally uses an Express 4-era unnamed wildcard with Express 5.1.0. It is meant to fail at route setup so ProofLoop has a deterministic migration task.

## Reproduce baseline

~~~powershell
npm install
npm test
~~~

A route parser error at app construction is the expected baseline failure.

## Task

Update only the fallback route to Express 5 syntax. Use /{*splat} because both the root URL and nested client-side routes must match. Do not weaken or remove the tests. Then rerun npm test; all three tests must pass.

The final benchmark must run this fixture in Token Factory Sandboxes once access is available. Local reproduction is development-only.
