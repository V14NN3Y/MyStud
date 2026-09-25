import { Router } from "express";
import { db } from "../db.ts";
import { requireRole, INSTITUTIONAL_ROLES } from "../auth.ts";
export const publicationsRouter = Router();
interface PublicationRow {
  id: string;
  type: string;
  libelle: string;
  statut: string;
  updated_at: string;
}
publicationsRouter.get("/", requireRole(...INSTITUTIONAL_ROLES), (_req, res) => {
  const rows = db.prepare("SELECT * FROM publications ORDER BY id").all() as unknown as PublicationRow[];
  res.json(rows);
});
publicationsRouter.patch("/:id/toggle", requireRole(...INSTITUTIONAL_ROLES), (req, res) => {
  const existing = db
    .prepare("SELECT * FROM publications WHERE id = ?")
    .get(req.params.id) as unknown as PublicationRow | undefined;
  if (!existing) {
    res.status(404).json({ error: "Publication introuvable." });
    return;
  }
  const nextStatut = existing.statut === "Publié" ? "Brouillon" : "Publié";
  db.prepare(
    `UPDATE publications SET statut = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?`
  ).run(nextStatut, req.params.id);
  const row = db
    .prepare("SELECT * FROM publications WHERE id = ?")
    .get(req.params.id) as unknown as PublicationRow;
  res.json(row);
});
