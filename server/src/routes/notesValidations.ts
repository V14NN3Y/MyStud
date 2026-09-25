import { Router } from "express";
import { db } from "../db.ts";
import { requireRole, INSTITUTIONAL_ROLES } from "../auth.ts";
export const notesValidationsRouter = Router();
interface NoteValidationRow {
  id: string;
  ue: string;
  enseignant: string;
  effectif: number;
  moyenne_classe: number;
  statut: string;
  validated_at: string | null;
}
notesValidationsRouter.get("/", requireRole(...INSTITUTIONAL_ROLES), (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM notes_validations ORDER BY id")
    .all() as unknown as NoteValidationRow[];
  res.json(rows);
});
// One-directional, like the frontend: a validated UE has no "un-validate"
// action, matching the "chaque validation est horodatée" copy on the page.
notesValidationsRouter.patch("/:id/valider", requireRole(...INSTITUTIONAL_ROLES), (req, res) => {
  const existing = db
    .prepare("SELECT * FROM notes_validations WHERE id = ?")
    .get(req.params.id) as unknown as NoteValidationRow | undefined;
  if (!existing) {
    res.status(404).json({ error: "Unité d'enseignement introuvable." });
    return;
  }
  if (existing.statut === "Validée") {
    res.status(409).json({ error: "Ces notes sont déjà validées." });
    return;
  }
  db.prepare(
    `UPDATE notes_validations
     SET statut = 'Validée', validated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     WHERE id = ?`
  ).run(req.params.id);
  const row = db
    .prepare("SELECT * FROM notes_validations WHERE id = ?")
    .get(req.params.id) as unknown as NoteValidationRow;
  res.json(row);
});
