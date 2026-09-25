import { Router } from "express";
import { emailChannel, smsChannel } from "../notifications/channel.ts";
import { requireRole, ROLES } from "../auth.ts";
import { db } from "../db.ts";
export const notificationsRouter = Router();
interface NotificationRow {
  id: number;
  titre: string;
  message: string;
  categorie: string;
  canal: string;
  priorite: string;
  etat_envoi: string;
  lu: number;
  created_at: string;
}
interface PreferenceRow {
  categorie: string;
  portail: number;
  sms: number;
  email: number;
  verrouille: number;
}
// No requireRole here, deliberately: this is the shared demo notification
// feed shown to every visitor (see NotificationBell on the frontend), and
// candidates/students have no institutional role or session to present —
// the same reasoning as identity.ts's tokenize endpoint.
notificationsRouter.get("/", (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM notifications ORDER BY created_at DESC")
    .all() as unknown as NotificationRow[];
  res.json(rows);
});
notificationsRouter.patch("/read-all", (_req, res) => {
  db.prepare("UPDATE notifications SET lu = 1 WHERE lu = 0").run();
  const rows = db
    .prepare("SELECT * FROM notifications ORDER BY created_at DESC")
    .all() as unknown as NotificationRow[];
  res.json(rows);
});
notificationsRouter.patch("/:id/read", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Identifiant de notification invalide." });
    return;
  }
  const result = db.prepare("UPDATE notifications SET lu = 1 WHERE id = ?").run(id);
  if (result.changes === 0) {
    res.status(404).json({ error: "Notification introuvable." });
    return;
  }
  const row = db.prepare("SELECT * FROM notifications WHERE id = ?").get(id) as unknown as NotificationRow;
  res.json(row);
});
notificationsRouter.get("/preferences", (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM notification_preferences ORDER BY categorie")
    .all() as unknown as PreferenceRow[];
  res.json(rows);
});
notificationsRouter.patch("/preferences/:categorie", (req, res) => {
  const { categorie } = req.params;
  const { canal, value } = req.body ?? {};
  if (canal !== "portail" && canal !== "sms" && canal !== "email") {
    res.status(400).json({ error: "'canal' doit valoir 'portail', 'sms' ou 'email'." });
    return;
  }
  if (typeof value !== "boolean") {
    res.status(400).json({ error: "'value' doit être un booléen." });
    return;
  }
  const row = db
    .prepare("SELECT * FROM notification_preferences WHERE categorie = ?")
    .get(categorie) as unknown as PreferenceRow | undefined;
  if (!row) {
    res.status(404).json({ error: "Catégorie de notification introuvable." });
    return;
  }
  if (row.verrouille) {
    res.status(403).json({ error: "Cette catégorie est verrouillée et ne peut pas être modifiée." });
    return;
  }
  db.prepare(`UPDATE notification_preferences SET ${canal} = ? WHERE categorie = ?`).run(
    value ? 1 : 0,
    categorie
  );
  const updated = db
    .prepare("SELECT * FROM notification_preferences WHERE categorie = ?")
    .get(categorie) as unknown as PreferenceRow;
  res.json(updated);
});
notificationsRouter.post("/send", requireRole(...ROLES), async (req, res) => {
  const { to, message, subject, channel } = req.body ?? {};
  if (typeof to !== "string" || !to.trim() || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "'to' et 'message' sont requis." });
    return;
  }
  if (channel !== "email" && channel !== "sms") {
    res.status(400).json({ error: "'channel' doit valoir 'email' ou 'sms'." });
    return;
  }
  try {
    const target = channel === "email" ? emailChannel : smsChannel;
    await target.send(to, message, typeof subject === "string" ? subject : undefined);
    res.status(202).json({ sent: true, channel });
  } catch (error) {
    res.status(502).json({ error: (error as Error).message });
  }
});
