export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
async function readJsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(body.error ?? res.statusText, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
  });
  return readJsonOrThrow<T>(res);
}
// multipart/form-data requests must NOT set their own content-type: the
// browser needs to add the multipart boundary itself.
async function apiFetchForm<T>(path: string, token: string, body: FormData): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: authHeader(token),
    body,
  });
  return readJsonOrThrow<T>(res);
}
function authHeader(token: string) {
  return { authorization: `Bearer ${token}` };
}
// --- Auth / roles -----------------------------------------------------
export function createSession(role: string) {
  return apiFetch<{ token: string; role: string }>("/api/auth/session", {
    method: "POST",
    body: JSON.stringify({ role }),
  });
}
// --- Identity (NPI tokenization) --------------------------------------
// Passing `email` also triggers a real confirmation e-mail server-side
// (see server/src/routes/identity.ts) — best-effort, it never fails this call.
export function tokenizeNpi(npi: string, email?: string) {
  return apiFetch<{ npiToken: string }>("/api/identity/tokenize", {
    method: "POST",
    body: JSON.stringify({ npi, email }),
  });
}
// --- Notifications ------------------------------------------------------
export function sendNotification(
  token: string,
  payload: { to: string; message: string; subject?: string; channel: "email" | "sms" }
) {
  return apiFetch<{ sent: boolean; channel: string }>("/api/notifications/send", {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify(payload),
  });
}
// The shared demo notification feed (no auth: see server/src/routes/notifications.ts).
export interface ServerNotification {
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
export function listNotifications() {
  return apiFetch<ServerNotification[]>("/api/notifications");
}
export function markNotificationRead(id: number) {
  return apiFetch<ServerNotification>(`/api/notifications/${id}/read`, { method: "PATCH" });
}
export function markAllNotificationsRead() {
  return apiFetch<ServerNotification[]>("/api/notifications/read-all", { method: "PATCH" });
}
export interface ServerNotificationPreference {
  categorie: string;
  portail: number;
  sms: number;
  email: number;
  verrouille: number;
}
export function listNotificationPreferences() {
  return apiFetch<ServerNotificationPreference[]>("/api/notifications/preferences");
}
export function updateNotificationPreference(
  categorie: string,
  canal: "portail" | "sms" | "email",
  value: boolean
) {
  return apiFetch<ServerNotificationPreference>(`/api/notifications/preferences/${categorie}`, {
    method: "PATCH",
    body: JSON.stringify({ canal, value }),
  });
}
// --- Audit log ------------------------------------------------------
export interface AuditEvent {
  id: number;
  action: string;
  cible: string;
  auteur_role: string;
  created_at: string;
}
export function listAuditEvents(token: string) {
  return apiFetch<AuditEvent[]>("/api/audit", { headers: authHeader(token) });
}
export function postAuditEvent(token: string, action: string, cible: string) {
  return apiFetch<AuditEvent>("/api/audit", {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({ action, cible }),
  });
}
// --- Documents ------------------------------------------------------
export function uploadDocument(token: string, file: File, ownerMatricule: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("ownerMatricule", ownerMatricule);
  return apiFetchForm<{ id: string }>("/api/documents", token, form);
}
export function getDocumentLink(token: string, documentId: string, matricule: string) {
  return apiFetch<{ url: string; expiresInSeconds: number }>(
    `/api/documents/${documentId}/link?matricule=${encodeURIComponent(matricule)}`,
    { headers: authHeader(token) }
  );
}
// --- Candidatures (espace université) ----------------------------------
export interface ServerCandidature {
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
export function listCandidatures(token: string) {
  return apiFetch<ServerCandidature[]>("/api/candidatures", { headers: authHeader(token) });
}
export function decideCandidature(
  token: string,
  id: string,
  decision: "Acceptée" | "Liste d'attente" | "Refusée",
  extra?: { motif?: string; commentaire?: string }
) {
  return apiFetch<ServerCandidature>(`/api/candidatures/${id}/decision`, {
    method: "PATCH",
    headers: authHeader(token),
    body: JSON.stringify({ decision, ...extra }),
  });
}
// --- Publications (espace université) -----------------------------------
export interface ServerPublication {
  id: string;
  type: string;
  libelle: string;
  statut: string;
  updated_at: string;
}
export function listPublications(token: string) {
  return apiFetch<ServerPublication[]>("/api/publications", { headers: authHeader(token) });
}
export function togglePublication(token: string, id: string) {
  return apiFetch<ServerPublication>(`/api/publications/${id}/toggle`, {
    method: "PATCH",
    headers: authHeader(token),
  });
}
// --- Notes validations (espace université) -------------------------------
export interface ServerNoteValidation {
  id: string;
  ue: string;
  enseignant: string;
  effectif: number;
  moyenne_classe: number;
  statut: string;
  validated_at: string | null;
}
export function listNotesValidations(token: string) {
  return apiFetch<ServerNoteValidation[]>("/api/notes-validations", { headers: authHeader(token) });
}
export function validateNotes(token: string, id: string) {
  return apiFetch<ServerNoteValidation>(`/api/notes-validations/${id}/valider`, {
    method: "PATCH",
    headers: authHeader(token),
  });
}
