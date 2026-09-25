import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "./env.ts";
// Mirrors src/mocks/universite.ts's `rolesInstitutionnels` ids on the frontend.
export const ROLES = [
  "ministere",
  "direction",
  "universite",
  "faculte",
  "scolarite",
  "enseignant",
  "bourse",
  "recruteur",
  "parent",
  "admin",
] as const;
export type Role = (typeof ROLES)[number];
// Every role whose frontend modules can read or write the institutional
// resources (audit log, documents, candidatures, publications, notes) —
// mirrors which rolesInstitutionnels[].modules ever include one of
// "candidatures" | "publications" | "notes" | "documents" | "audit" on the
// frontend (src/mocks/universite.ts). Kept as one shared set, like the
// frontend's own role list, rather than a bespoke matrix per resource.
export const INSTITUTIONAL_ROLES = [
  "ministere",
  "direction",
  "universite",
  "faculte",
  "scolarite",
  "enseignant",
  "admin",
] as const;
export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}
interface SessionClaims {
  role: Role;
}
export function signSession(role: Role): string {
  return jwt.sign({ role } satisfies SessionClaims, env.jwtSecret, { expiresIn: "2h" });
}
export interface AuthedRequest extends Request {
  role?: Role;
}
function readBearerToken(req: Request): string | null {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}
// Verifies the JWT signature server-side before ever looking at `role`. This
// is the actual fix for the prototype's known gap: today the frontend's
// RoleSwitcher is a plain useState, so any client can claim any role by
// editing local UI state. Once wired up, the frontend still only *offers*
// role switching, but every protected read/write now checks a signed token
// the server minted — a tampered client can no longer grant itself access.
export function requireRole(...allowed: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const token = readBearerToken(req);
    if (!token) {
      res.status(401).json({ error: "Authentification requise." });
      return;
    }
    try {
      const claims = jwt.verify(token, env.jwtSecret) as SessionClaims;
      if (!isRole(claims.role) || (allowed.length > 0 && !allowed.includes(claims.role))) {
        res.status(403).json({ error: "Rôle non autorisé pour cette ressource." });
        return;
      }
      req.role = claims.role;
      next();
    } catch {
      res.status(401).json({ error: "Session invalide ou expirée." });
    }
  };
}
