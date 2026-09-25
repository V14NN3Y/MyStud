import { Router } from "express";
import { isRole, signSession } from "../auth.ts";
export const authRouter = Router();
// Demo-only: there is no real identity provider behind this yet (see
// project_plan.md Phase 8), so any caller can request any of the fixed demo
// roles. The point isn't to gate *who* can pick a role — the UI already does
// that openly for the demo — it's that once picked, every protected endpoint
// trusts this signed token instead of trusting whatever the client claims in
// its own request. Swapping in a real login only means replacing what proves
// the role here; every downstream `requireRole` check stays the same.
authRouter.post("/session", (req, res) => {
  const role = req.body?.role;
  if (typeof role !== "string" || !isRole(role)) {
    res.status(400).json({ error: "Rôle inconnu." });
    return;
  }
  res.json({ token: signSession(role), role });
});
