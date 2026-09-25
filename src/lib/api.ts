export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(body.error ?? res.statusText, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
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
