import { Router } from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import { db } from "../db.ts";
import { env } from "../env.ts";
import { requireRole, ROLES, type AuthedRequest } from "../auth.ts";
export const documentsRouter = Router();
const INSTITUTIONAL_ROLES = ["ministere", "direction", "universite", "faculte", "admin"] as const;
const upload = multer({
  storage: multer.diskStorage({
    destination: join(env.dataDir, "documents"),
    filename: (_req, _file, cb) => cb(null, randomUUID()),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});
interface DocumentRow {
  id: string;
  owner_matricule: string;
  filename: string;
  content_type: string;
  storage_path: string;
  created_at: string;
}
// Never returns a public URL: documents live outside any web-served
// directory, and the only way in is a short-lived signed link (below).
documentsRouter.post("/", requireRole(...ROLES), upload.single("file"), (req: AuthedRequest, res) => {
  const ownerMatricule = req.body?.ownerMatricule;
  if (!req.file) {
    res.status(400).json({ error: "Fichier requis." });
    return;
  }
  if (typeof ownerMatricule !== "string" || !ownerMatricule.trim()) {
    res.status(400).json({ error: "ownerMatricule est requis." });
    return;
  }
  const id = req.file.filename;
  db.prepare(
    "INSERT INTO documents (id, owner_matricule, filename, content_type, storage_path) VALUES (?, ?, ?, ?, ?)"
  ).run(id, ownerMatricule.trim(), req.file.originalname, req.file.mimetype, req.file.path);
  res.status(201).json({ id });
});
function getDocument(id: string): DocumentRow | undefined {
  return db.prepare("SELECT * FROM documents WHERE id = ?").get(id) as DocumentRow | undefined;
}
// Mints a link that expires in 5 minutes — the same "liens temporaires et
// contrôle d'autorisation" pattern docs/security-and-quality.md calls for.
documentsRouter.get("/:id/link", requireRole(...ROLES), (req: AuthedRequest, res) => {
  const doc = getDocument(req.params.id);
  if (!doc) {
    res.status(404).json({ error: "Document introuvable." });
    return;
  }
  const isOwner = req.query.matricule === doc.owner_matricule;
  const isInstitutional = (INSTITUTIONAL_ROLES as readonly string[]).includes(req.role!);
  if (!isOwner && !isInstitutional) {
    res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à ce document." });
    return;
  }
  const token = jwt.sign({ documentId: doc.id }, env.downloadLinkSecret, { expiresIn: "5m" });
  res.json({ url: `/api/documents/download/${token}`, expiresInSeconds: 300 });
});
// Deliberately outside requireRole: the signed, short-lived token IS the
// authorization — that's what makes it shareable as a link at all.
documentsRouter.get("/download/:token", (req, res) => {
  let documentId: string;
  try {
    const claims = jwt.verify(req.params.token, env.downloadLinkSecret) as { documentId: string };
    documentId = claims.documentId;
  } catch {
    res.status(403).json({ error: "Lien invalide ou expiré." });
    return;
  }
  const doc = getDocument(documentId);
  if (!doc || !existsSync(doc.storage_path)) {
    res.status(404).json({ error: "Document introuvable." });
    return;
  }
  res.setHeader("Content-Type", doc.content_type);
  res.setHeader("Content-Disposition", `attachment; filename="${doc.filename}"`);
  createReadStream(doc.storage_path).pipe(res);
});
