import { Router } from "express";
import { db } from "../db.ts";
import { requireRole, type AuthedRequest } from "../auth.ts";
export const auditRouter = Router();
const INSTITUTIONAL_ROLES = ["ministere", "direction", "universite", "faculte", "admin"] as const;
interface AuditEventRow {
  id: number;
  action: string;
  cible: string;
  auteur_role: string;
  created_at: string;
}
auditRouter.get("/", requireRole(...INSTITUTIONAL_ROLES), (_req, res) => {
  const rows = db.prepare("SELECT * FROM audit_events ORDER BY id DESC").all() as unknown as AuditEventRow[];
  res.json(rows);
});
auditRouter.post("/", requireRole(...INSTITUTIONAL_ROLES), (req: AuthedRequest, res) => {
  const { action, cible } = req.body ?? {};
  if (typeof action !== "string" || !action.trim() || typeof cible !== "string" || !cible.trim()) {
    res.status(400).json({ error: "'action' et 'cible' sont requis." });
    return;
  }
  const result = db
    .prepare("INSERT INTO audit_events (action, cible, auteur_role) VALUES (?, ?, ?)")
    .run(action.trim(), cible.trim(), req.role!);
  const row = db
    .prepare("SELECT * FROM audit_events WHERE id = ?")
    .get(result.lastInsertRowid) as unknown as AuditEventRow;
  res.status(201).json(row);
});
