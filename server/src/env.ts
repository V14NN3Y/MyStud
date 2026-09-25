import { randomBytes } from "node:crypto";
const isProduction = process.env.NODE_ENV === "production";
// Dev/demo only: a stable-but-clearly-fake secret so the server is usable out
// of the box without a .env file. In production these MUST come from real
// secrets (see server/README.md) — the server refuses to start otherwise.
const DEV_FALLBACK_JWT_SECRET = "dev-only-insecure-jwt-secret-do-not-use-in-production";
const DEV_FALLBACK_NPI_SECRET = "dev-only-insecure-npi-secret-do-not-use-in-production";
function required(name: string, devFallback: string): string {
  const value = process.env[name];
  if (value) return value;
  if (isProduction) {
    throw new Error(`Missing required environment variable ${name} in production.`);
  }
  return devFallback;
}
export const env = {
  isProduction,
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: required("JWT_SECRET", DEV_FALLBACK_JWT_SECRET),
  npiHmacSecret: required("NPI_HMAC_SECRET", DEV_FALLBACK_NPI_SECRET),
  // In dev, a fresh random secret per boot is fine — links just need to stay
  // valid for the life of one running process. In production this must be
  // fixed: a restart or a second instance with a different secret would
  // invalidate/reject links other instances issued.
  downloadLinkSecret: isProduction
    ? required("DOWNLOAD_LINK_SECRET", "")
    // `||`, not `??`: a present-but-blank DOWNLOAD_LINK_SECRET= line in .env
    // (e.g. copied from .env.example and left unfilled) is an empty string,
    // not undefined, so `??` would use it as-is and jwt.sign() would reject
    // it with "secretOrPrivateKey must have a value".
    : (process.env.DOWNLOAD_LINK_SECRET || randomBytes(32).toString("hex")),
  dataDir: process.env.DATA_DIR ?? new URL("../data", import.meta.url).pathname,
  // Optional on purpose: without it, the email channel falls back to logging
  // instead of sending (see src/notifications/channel.ts). Any Resend
  // account's key works — it isn't scoped to a specific project, just to
  // whichever sender domain is verified on that account.
  resendApiKey: process.env.RESEND_API_KEY,
  // Resend's shared sandbox sender — works with no domain verification, but
  // Resend restricts who it can actually deliver to until a real domain is
  // verified. Override once mystud.bj (or similar) is verified.
  resendFromEmail: process.env.RESEND_FROM_EMAIL ?? "MyStud <onboarding@resend.dev>",
  // The Vite dev server's origin (see vite.config.ts's `server.port`).
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
};
