import { describe, expect, it } from "vitest";
import { creerProfilDemo, reclasser, type BacInfo, type CandidatureDemo } from "./useDemoSession";
const bac: BacInfo = {
  serie: "D",
  annee: "2026",
  numeroTable: "AB123456",
  mention: "",
  statut: "Vérifié",
  priseEnCharge: "",
};
const email = "candidat@example.com";
const npiToken = "fake-token-from-the-server";
describe("creerProfilDemo", () => {
  it("is deterministic for the same NPI, phone and bac", () => {
    const first = creerProfilDemo("1234567890", "0190000000", bac, email, npiToken);
    const second = creerProfilDemo("1234567890", "0190000000", bac, email, npiToken);
    expect(second).toEqual(first);
  });
  it("trims the NPI and phone but keeps them intact", () => {
    const profil = creerProfilDemo("  1234567890  ", "  0190000000  ", bac, email, npiToken);
    expect(profil.npi).toBe("1234567890");
    expect(profil.telephone).toBe("0190000000");
  });
  it("produces a MyStud matricule and carries the npiToken through untouched", () => {
    const profil = creerProfilDemo("1234567890", "0190000000", bac, email, npiToken);
    expect(profil.matricule).toMatch(/^MS-\d{4}-\d{6}$/);
    expect(profil.npiToken).toBe(npiToken);
  });
  it("keeps the e-mail address the candidate actually typed, not a generated one", () => {
    const profil = creerProfilDemo("1234567890", "0190000000", bac, email, npiToken);
    expect(profil.email).toBe(email);
  });
  it("formats the birth date as DD/MM/YYYY", () => {
    const profil = creerProfilDemo("1234567890", "0190000000", bac, email, npiToken);
    expect(profil.dateNaissance).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
  it("carries the supplied bac fields through, enriched with a mention and a prise en charge", () => {
    const profil = creerProfilDemo("1234567890", "0190000000", bac, email, npiToken);
    expect(profil.bac.serie).toBe("D");
    expect(profil.bac.numeroTable).toBe("AB123456");
    expect(profil.bac.mention).not.toBe("");
    expect(profil.bac.priseEnCharge).not.toBe("");
  });
  it("produces a different identity for a different NPI", () => {
    const a = creerProfilDemo("1111111111", "0190000000", bac, email, npiToken);
    const b = creerProfilDemo("9988776655", "0190000000", bac, email, npiToken);
    expect(a).not.toEqual(b);
  });
});
describe("reclasser", () => {
  it("renumbers rang sequentially starting at 1", () => {
    const items: CandidatureDemo[] = [
      { id: "a", formationId: "f1", rang: 5, statutIndex: 0, decision: "en_cours", majLe: "" },
      { id: "b", formationId: "f2", rang: 9, statutIndex: 0, decision: "en_cours", majLe: "" },
    ];
    expect(reclasser(items).map((item) => item.rang)).toEqual([1, 2]);
  });
  it("preserves order and does not mutate the input array", () => {
    const items: CandidatureDemo[] = [
      { id: "a", formationId: "f1", rang: 1, statutIndex: 0, decision: "en_cours", majLe: "" },
    ];
    const result = reclasser(items);
    expect(result).not.toBe(items);
    expect(result[0].id).toBe("a");
  });
});
