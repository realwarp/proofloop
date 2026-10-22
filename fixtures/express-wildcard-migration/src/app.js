import express from "express";

export function createApp() {
  const app = express();

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  // INTENTIONAL MIGRATION DEFECT:
  // An unnamed wildcard worked in Express 4 but is rejected by Express 5.
  // ProofLoop must migrate it while preserving root and nested paths.
  app.get("*", (_req, res) => {
    res.status(200).type("html").send("app-shell");
  });

  return app;
}
