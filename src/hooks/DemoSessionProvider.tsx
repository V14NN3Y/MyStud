import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  DemoSessionContext,
  MAX_CANDIDATURES,
  STATUTS_PROGRESSION,
  dateAujourdhui,
  reclasser,
  type CandidatureDemo,
  type DecisionKey,
  type DemoSessionValue,
  type ProfilDemo,
} from "@/hooks/useDemoSession";
export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [profil, setProfil] = useState<ProfilDemo | null>(null);
  const [candidatures, setCandidatures] = useState<CandidatureDemo[]>([]);
  const [comparaison, setComparaison] = useState<string[]>([]);
  const identifier = useCallback((next: ProfilDemo) => {
    setProfil(next);
    setCandidatures([]);
  }, []);
  const deconnecter = useCallback(() => {
    setProfil(null);
    setCandidatures([]);
  }, []);
  const ajouterCandidature = useCallback((formationId: string) => {
    let ajoute = false;
    setCandidatures((prev) => {
      if (prev.length >= MAX_CANDIDATURES) return prev;
      if (prev.some((item) => item.formationId === formationId)) return prev;
      ajoute = true;
      return reclasser([
        ...prev,
        {
          id: `${formationId}-${Date.now()}`,
          formationId,
          rang: prev.length + 1,
          statutIndex: 0,
          decision: "en_cours",
          majLe: dateAujourdhui(),
        },
      ]);
    });
    return ajoute;
  }, []);
  const retirerCandidature = useCallback((candidatureId: string) => {
    setCandidatures((prev) => reclasser(prev.filter((item) => item.id !== candidatureId)));
  }, []);
  const deplacerCandidature = useCallback((candidatureId: string, direction: "up" | "down") => {
    setCandidatures((prev) => {
      const index = prev.findIndex((item) => item.id === candidatureId);
      const target = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return reclasser(next);
    });
  }, []);
  const avancerCandidature = useCallback((candidatureId: string) => {
    setCandidatures((prev) =>
      prev.map((item) =>
        item.id === candidatureId
          ? {
              ...item,
              statutIndex: Math.min(item.statutIndex + 1, STATUTS_PROGRESSION.length - 1),
              majLe: dateAujourdhui(),
            }
          : item
      )
    );
  }, []);
  const setDecision = useCallback((candidatureId: string, decision: DecisionKey) => {
    setCandidatures((prev) =>
      prev.map((item) =>
        item.id === candidatureId
          ? { ...item, decision, statutIndex: STATUTS_PROGRESSION.length - 1, majLe: dateAujourdhui() }
          : item
      )
    );
  }, []);
  const estCandidate = useCallback(
    (formationId: string) => candidatures.some((item) => item.formationId === formationId),
    [candidatures]
  );
  const toggleComparaison = useCallback((formationId: string) => {
    let ajoute = false;
    setComparaison((prev) => {
      if (prev.includes(formationId)) return prev.filter((id) => id !== formationId);
      if (prev.length >= MAX_CANDIDATURES) return prev;
      ajoute = true;
      return [...prev, formationId];
    });
    return ajoute;
  }, []);
  const retirerComparaison = useCallback((formationId: string) => {
    setComparaison((prev) => prev.filter((id) => id !== formationId));
  }, []);
  const viderComparaison = useCallback(() => setComparaison([]), []);
  const value = useMemo<DemoSessionValue>(
    () => ({
      profil,
      identifie: Boolean(profil),
      candidatures,
      comparaison,
      identifier,
      deconnecter,
      ajouterCandidature,
      retirerCandidature,
      deplacerCandidature,
      avancerCandidature,
      setDecision,
      estCandidate,
      toggleComparaison,
      retirerComparaison,
      viderComparaison,
    }),
    [
      profil,
      candidatures,
      comparaison,
      identifier,
      deconnecter,
      ajouterCandidature,
      retirerCandidature,
      deplacerCandidature,
      avancerCandidature,
      setDecision,
      estCandidate,
      toggleComparaison,
      retirerComparaison,
      viderComparaison,
    ]
  );
  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>;
}
