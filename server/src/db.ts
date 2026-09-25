import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { env } from "./env.ts";
mkdirSync(env.dataDir, { recursive: true });
mkdirSync(join(env.dataDir, "documents"), { recursive: true });
export const db = new DatabaseSync(join(env.dataDir, "mystud.sqlite"));
db.exec(`
  CREATE TABLE IF NOT EXISTS audit_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    cible TEXT NOT NULL,
    auteur_role TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  -- Append-only, enforced at the database level: even a compromised admin
  -- credential using this same connection can't rewrite or erase history
  -- through ordinary SQL, only by dropping the trigger itself.
  CREATE TRIGGER IF NOT EXISTS audit_events_no_update
  BEFORE UPDATE ON audit_events
  BEGIN
    SELECT RAISE(ABORT, 'audit_events is append-only: updates are not allowed');
  END;

  CREATE TRIGGER IF NOT EXISTS audit_events_no_delete
  BEFORE DELETE ON audit_events
  BEGIN
    SELECT RAISE(ABORT, 'audit_events is append-only: deletes are not allowed');
  END;

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    owner_matricule TEXT NOT NULL,
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  -- Shared demo notification feed: there is no real per-student account
  -- system yet (see server/README.md), so this is one global list, exactly
  -- like audit_events. Replaces the historiqueNotifications mock that used
  -- to live only in React state — that state reset to the same fixed unread
  -- count on every reload and never agreed between browser tabs.
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    message TEXT NOT NULL,
    categorie TEXT NOT NULL,
    canal TEXT NOT NULL,
    priorite TEXT NOT NULL,
    etat_envoi TEXT NOT NULL DEFAULT 'Envoyé',
    lu INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  -- Which channel each notification category is delivered on. verrouille
  -- rows (identité, sécurité) can't be turned off, mirroring the guard the
  -- frontend already applies in PreferencesMatrix.
  CREATE TABLE IF NOT EXISTS notification_preferences (
    categorie TEXT PRIMARY KEY,
    portail INTEGER NOT NULL DEFAULT 1,
    sms INTEGER NOT NULL DEFAULT 0,
    email INTEGER NOT NULL DEFAULT 0,
    verrouille INTEGER NOT NULL DEFAULT 0
  );

`);
// Seed once: a fresh database (dev's first run, or a test's throwaway
// DATA_DIR) starts with the same demo content the old mock shipped, but from
// here on every read/write goes through this table instead of a static file.
if ((db.prepare("SELECT COUNT(*) AS n FROM notifications").get() as { n: number }).n === 0) {
  const insertNotification = db.prepare(
    `INSERT INTO notifications (titre, message, categorie, canal, priorite, etat_envoi, lu, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const seedNotifications: [string, string, string, string, string, string, number, string][] = [
    [
      "Examen déplacé : Réseaux et systèmes",
      "L'examen du 26 novembre passe de l'Amphi 210 à l'Amphi 205. Présentez-vous 15 minutes avant le début.",
      "notes", "Portail", "haute", "Envoyé", 0, "2026-09-26T09:12:00.000Z",
    ],
    [
      "Candidature transmise à l'EPAC",
      "Votre candidature en Génie Informatique a été transmise à l'établissement pour instruction.",
      "candidatures", "Portail", "normale", "Envoyé", 1, "2026-09-25T16:40:00.000Z",
    ],
    [
      "Nouvelle bourse publiée",
      "La bourse d'excellence académique est ouverte aux candidatures jusqu'au 30 septembre.",
      "bourses", "E-mail", "normale", "Envoyé", 1, "2026-09-12T09:00:00.000Z",
    ],
    [
      "Relevé de notes disponible",
      "Votre relevé de notes du semestre 4 est prêt à être téléchargé depuis vos documents.",
      "documents", "E-mail", "normale", "Envoyé", 0, "2026-09-10T09:00:00.000Z",
    ],
    [
      "Rappel : deuxième tranche des frais",
      "La deuxième tranche des frais de scolarité est due avant le 30 novembre 2026.",
      "documents", "SMS", "normale", "Échec", 0, "2026-09-08T09:00:00.000Z",
    ],
    [
      "Code de vérification envoyé",
      "Un code à usage unique a été envoyé au numéro associé à votre NPI. Il expire dans 5 minutes.",
      "identite", "SMS", "haute", "Envoyé", 1, "2026-09-02T09:00:00.000Z",
    ],
  ];
  for (const row of seedNotifications) insertNotification.run(...row);
  const insertPreference = db.prepare(
    `INSERT INTO notification_preferences (categorie, portail, sms, email, verrouille) VALUES (?, ?, ?, ?, ?)`
  );
  const seedPreferences: [string, number, number, number, number][] = [
    ["identite", 1, 1, 1, 1],
    ["candidatures", 1, 1, 0, 0],
    ["notes", 1, 0, 1, 0],
    ["bourses", 1, 1, 1, 0],
    ["documents", 1, 0, 1, 0],
    ["securite", 1, 1, 1, 1],
  ];
  for (const row of seedPreferences) insertPreference.run(...row);
}
