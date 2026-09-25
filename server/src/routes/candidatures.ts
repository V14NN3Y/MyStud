import { Router } from "express";
import { db } from "../db.ts";
import { requireRole, INSTITUTIONAL_ROLES } from "../auth.ts";
export const candidaturesRouter = Router();
const DECISIONS = ["Acceptée", "Liste d'attente", "Refusée"] as const;
interface CandidatureRow {
  id: string;
  matricule: string;
  nom: string;
  formation: string;
  serie: string;
  mention: string;
  moyenne_bac: number;
  date_depot: string;
  statut: string;
  motif_refus: string | null;
  commentaire: string | null;
  updated_at: string;
}
candidaturesRouter.get("/", requireRole(...INSTITUTIONAL_ROLES), (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM candidatures ORDER BY id")
    .all() as unknown as CandidatureRow[];
  res.json(rows);
});
candidaturesRouter.patch("/:id/decision", requireRole(...INSTITUTIONAL_ROLES), (req, res) => {
  const { decision, motif, commentaire } = req.body ?? {};
  if (!(DECISIONS as readonly string[]).includes(decision)) {
    res.status(400).json({ error: "'decision' doit valoir 'Acceptée', 'Liste d'attente' ou 'Refusée'." });
    return;
  }
  if (decision === "Refusée" && (typeof motif !== "string" || !motif.trim())) {
    res.status(400).json({ error: "Un motif est requis pour refuser une candidature." });
    return;
  }
  if (commentaire !== undefined && typeof commentaire !== "string") {
    res.status(400).json({ error: "'commentaire' doit être une chaîne de caractères." });
    return;
  }
  const existing = db
    .prepare("SELECT * FROM candidatures WHERE id = ?")
    .get(req.params.id) as unknown as CandidatureRow | undefined;
  if (!existing) {
    res.status(404).json({ error: "Candidature introuvable." });
    return;
  }
  db.prepare(
    `UPDATE candidatures
     SET statut = ?, motif_refus = ?, commentaire = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     WHERE id = ?`
  ).run(
    decision,
    decision === "Refusée" ? motif.trim() : null,
    typeof commentaire === "string" ? commentaire.slice(0, 500) : null,
    req.params.id
  );
  const row = db
    .prepare("SELECT * FROM candidatures WHERE id = ?")
    .get(req.params.id) as unknown as CandidatureRow;
  res.json(row);
});
