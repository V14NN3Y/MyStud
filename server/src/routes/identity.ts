import { Router } from "express";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../env.ts";
import { emailChannel } from "../notifications/channel.ts";
export const identityRouter = Router();
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
// Deterministic pseudonymization: the same NPI always maps to the same
// token (needed to recognize a returning visitor), but the token can't be
// reversed back to the NPI without this server-side secret. The raw NPI is
// never written to the database — only the token is.
export function tokenizeNpi(npi: string): string {
  return createHmac("sha256", env.npiHmacSecret).update(npi.trim()).digest("hex");
}
export function npiMatchesToken(npi: string, token: string): boolean {
  const expected = Buffer.from(tokenizeNpi(npi), "hex");
  const actual = Buffer.from(token, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
// Deliberately not behind requireRole: a candidate identifying themselves in
// /acces has no institutional role to present. Scope is kept narrow instead
// — this can only ever send the one fixed confirmation message, to the
// address given in the very same request, as a side effect of tokenizing
// that request's own NPI. A production version would still want rate
// limiting here to stop it being used as a plain mail-blaster.
identityRouter.post("/tokenize", (req, res) => {
  const npi = req.body?.npi;
  const email = req.body?.email;
  if (typeof npi !== "string" || !/^\d{10}$/.test(npi.trim())) {
    res.status(400).json({ error: "Le NPI doit comporter 10 chiffres." });
    return;
  }
  const npiToken = tokenizeNpi(npi);
  if (typeof email === "string" && EMAIL_PATTERN.test(email.trim())) {
    // Best-effort: a bounced/failed confirmation e-mail must not fail the
    // identification itself, which is why this isn't awaited before res.json.
    emailChannel
      .send(
        email.trim(),
        "Votre identité a été vérifiée sur MyStud. Vous pouvez poursuivre votre candidature.",
        "Identité vérifiée — MyStud"
      )
      .catch((error: Error) => {
        console.error("Échec de l'envoi de l'e-mail de confirmation d'identité :", error.message);
      });
  }
  res.json({ npiToken });
});
