import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DemoSessionProvider } from "./DemoSessionProvider";
import useDemoSession, { MAX_CANDIDATURES, creerProfilDemo, type BacInfo } from "./useDemoSession";
const bac: BacInfo = {
  serie: "D",
  annee: "2026",
  numeroTable: "AB123456",
  mention: "",
  statut: "Vérifié",
  priseEnCharge: "",
};
function setup() {
  return renderHook(() => useDemoSession(), { wrapper: DemoSessionProvider });
}
describe("useDemoSession (outside a provider)", () => {
  it("throws so misuse fails loudly instead of silently returning nothing", () => {
    expect(() => renderHook(() => useDemoSession())).toThrow(
      "useDemoSession doit être utilisé à l'intérieur de DemoSessionProvider"
    );
  });
});
describe("DemoSessionProvider", () => {
  it("starts unidentified with no candidature", () => {
    const { result } = setup();
    expect(result.current.identifie).toBe(false);
    expect(result.current.candidatures).toHaveLength(0);
  });
  it("identifier() logs the visitor in with the given profile", () => {
    const { result } = setup();
    act(() => result.current.identifier(creerProfilDemo("1234567890", "0190000000", bac, "candidat@example.com", "fake-token")));
    expect(result.current.identifie).toBe(true);
    expect(result.current.profil?.npi).toBe("1234567890");
  });
  it("deconnecter() clears the profile and any candidature", () => {
    const { result } = setup();
    act(() => result.current.identifier(creerProfilDemo("1234567890", "0190000000", bac, "candidat@example.com", "fake-token")));
    act(() => result.current.ajouterCandidature("formation-1"));
    act(() => result.current.deconnecter());
    expect(result.current.identifie).toBe(false);
    expect(result.current.candidatures).toHaveLength(0);
  });
  it("caps candidatures at MAX_CANDIDATURES and reports failure past the cap", () => {
    const { result } = setup();
    let accepted = true;
    for (let i = 0; i < MAX_CANDIDATURES + 1; i += 1) {
      act(() => {
        accepted = result.current.ajouterCandidature(`formation-${i}`);
      });
    }
    expect(result.current.candidatures).toHaveLength(MAX_CANDIDATURES);
    expect(accepted).toBe(false);
  });
  it("does not add the same formation twice", () => {
    const { result } = setup();
    act(() => result.current.ajouterCandidature("formation-1"));
    act(() => result.current.ajouterCandidature("formation-1"));
    expect(result.current.candidatures).toHaveLength(1);
  });
  it("retirerCandidature() removes the entry and renumbers the remaining ranks", () => {
    const { result } = setup();
    act(() => result.current.ajouterCandidature("formation-1"));
    act(() => result.current.ajouterCandidature("formation-2"));
    const firstId = result.current.candidatures[0].id;
    act(() => result.current.retirerCandidature(firstId));
    expect(result.current.candidatures).toHaveLength(1);
    expect(result.current.candidatures[0].formationId).toBe("formation-2");
    expect(result.current.candidatures[0].rang).toBe(1);
  });
  it("deplacerCandidature() swaps two entries and keeps ranks consistent", () => {
    const { result } = setup();
    act(() => result.current.ajouterCandidature("formation-1"));
    act(() => result.current.ajouterCandidature("formation-2"));
    const secondId = result.current.candidatures[1].id;
    act(() => result.current.deplacerCandidature(secondId, "up"));
    expect(result.current.candidatures.map((c) => c.formationId)).toEqual(["formation-2", "formation-1"]);
    expect(result.current.candidatures.map((c) => c.rang)).toEqual([1, 2]);
  });
  it("toggleComparaison() adds and removes, capped at MAX_CANDIDATURES", () => {
    const { result } = setup();
    act(() => result.current.toggleComparaison("formation-1"));
    expect(result.current.comparaison).toEqual(["formation-1"]);
    act(() => result.current.toggleComparaison("formation-1"));
    expect(result.current.comparaison).toEqual([]);
  });
  it("viderComparaison() clears the whole comparison list", () => {
    const { result } = setup();
    act(() => result.current.toggleComparaison("formation-1"));
    act(() => result.current.toggleComparaison("formation-2"));
    act(() => result.current.viderComparaison());
    expect(result.current.comparaison).toEqual([]);
  });
});
