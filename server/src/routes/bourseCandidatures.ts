import { Router } from "express";
import { randomInt } from "node:crypto";
import { db } from "../db.ts";
export const bourseCandidaturesRouter = Router();
interface BourseCandidatureRow {
  id: string;
  programme_id: string;
  programme: string;
  organisme: string;
  montant: string;
  reference: string;
  statut: string;
  montant_accorde: string;
  date_depot: string;
  message: string;
  updated_at: string;
}
// No requireRole, deliberately: there is no real per-student login yet (see
// identity.ts and notifications.ts for the same reasoning) — a candidate has
// no institutional role or session token to present.
bourseCandidaturesRouter.get("/", (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM bourse_candidatures ORDER BY date_depot DESC, id DESC")
    .all() as unknown as BourseCandidatureRow[];
  res.json(rows);
});
bourseCandidaturesRouter.post("/", (req, res) => {
  const { programmeId, programme, organisme, montant } = req.body ?? {};
  if ([programmeId, programme, organisme, montant].some((v) => typeof v !== "string" || !v.trim())) {
    res.status(400).json({ error: "'programmeId', 'programme', 'organisme' et 'montant' sont requis." });
    return;
  }
  const id = `cb-${Date.now()}`;
  // The server mints the reference, not the client: it's meant to look like
  // an official tracking number, the same reasoning as NPI tokenization.
  const reference = `MYSTUD-BRS-2026-${String(randomInt(100000, 999999))}`;
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO bourse_candidatures
       (id, programme_id, programme, organisme, montant, reference, statut, montant_accorde, date_depot, message, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'soumise', '—', ?, ?, ?)`
  ).run(
    id,
    programmeId.trim(),
    programme.trim(),
    organisme.trim(),
    montant.trim(),
    reference,
    now,
    "Votre demande vient d'être enregistrée et sera transmise à l'organisme responsable.",
    now
  );
  const row = db.prepare("SELECT * FROM bourse_candidatures WHERE id = ?").get(id) as unknown as BourseCandidatureRow;
  res.status(201).json(row);
});
bourseCandidaturesRouter.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM bourse_candidatures WHERE id = ?").run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: "Candidature introuvable." });
    return;
  }
  res.status(204).end();
});
// Moves a candidature that was waiting on a complementary document back into
// review — the frontend button used to just flip a local checkmark without
// ever changing the tracked status.
bourseCandidaturesRouter.patch("/:id/deposer-pieces", (req, res) => {
  const existing = db
    .prepare("SELECT * FROM bourse_candidatures WHERE id = ?")
    .get(req.params.id) as unknown as BourseCandidatureRow | undefined;
  if (!existing) {
    res.status(404).json({ error: "Candidature introuvable." });
    return;
  }
  if (existing.statut !== "complement") {
    res.status(409).json({ error: "Cette candidature n'attend pas de pièce complémentaire." });
    return;
  }
  db.prepare(
    `UPDATE bourse_candidatures
     SET statut = 'etude', message = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     WHERE id = ?`
  ).run("Les pièces complémentaires ont été reçues ; votre dossier retourne en instruction.", req.params.id);
  const row = db
    .prepare("SELECT * FROM bourse_candidatures WHERE id = ?")
    .get(req.params.id) as unknown as BourseCandidatureRow;
  res.json(row);
});
