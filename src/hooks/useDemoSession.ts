import { createContext, useContext } from "react";
import {
  mentionsDemo,
  nomsDemo,
  prenomsDemo,
  statutsPriseEnChargeDemo,
  villesNaissanceDemo,
} from "@/mocks/identite";
export const MAX_CANDIDATURES = 3;
export const STATUTS_PROGRESSION = [
  "Soumise",
  "Transmise à l'établissement",
  "En vérification des pièces",
  "En traitement par la commission",
  "Décision publiée",
];
export type DecisionKey =
  | "en_cours"
  | "acceptee"
  | "liste_attente"
  | "pieces_demandees"
  | "refusee";
export const DECISIONS: {
  key: DecisionKey;
  labelKey: string;
  icon: string;
  badge: string;
}[] = [
  {
    key: "en_cours",
    labelKey: "espace.decision.en_cours",
    icon: "ri-loader-4-line",
    badge: "border-background-300 bg-background-200 text-foreground-700",
  },
  {
    key: "acceptee",
    labelKey: "espace.decision.acceptee",
    icon: "ri-checkbox-circle-line",
    badge: "border-primary-200 bg-primary-100 text-primary-800",
  },
  {
    key: "liste_attente",
    labelKey: "espace.decision.liste_attente",
    icon: "ri-time-line",
    badge: "border-accent-300 bg-accent-100 text-accent-900",
  },
  {
    key: "pieces_demandees",
    labelKey: "espace.decision.pieces_demandees",
    icon: "ri-file-warning-line",
    badge: "border-secondary-200 bg-secondary-100 text-secondary-900",
  },
  {
    key: "refusee",
    labelKey: "espace.decision.refusee",
    icon: "ri-close-circle-line",
    badge: "border-foreground-300 bg-foreground-200 text-foreground-600",
  },
];
export interface BacInfo {
  serie: string;
  annee: string;
  numeroTable: string;
  mention: string;
  statut: string;
  priseEnCharge: string;
}
export interface ProfilDemo {
  npi: string;
  // HMAC-SHA256 of the NPI, computed server-side (POST /api/identity/tokenize)
  // — see server/src/routes/identity.ts. Only this token, never the raw NPI,
  // is meant to be sent to any endpoint that persists candidate data.
  npiToken: string;
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  telephone: string;
  email: string;
  bac: BacInfo;
}
export interface CandidatureDemo {
  id: string;
  formationId: string;
  rang: number;
  statutIndex: number;
  decision: DecisionKey;
  majLe: string;
}
export interface DemoSessionValue {
  profil: ProfilDemo | null;
  identifie: boolean;
  candidatures: CandidatureDemo[];
  comparaison: string[];
  identifier: (profil: ProfilDemo) => void;
  deconnecter: () => void;
  ajouterCandidature: (formationId: string) => boolean;
  retirerCandidature: (candidatureId: string) => void;
  deplacerCandidature: (candidatureId: string, direction: "up" | "down") => void;
  avancerCandidature: (candidatureId: string) => void;
  setDecision: (candidatureId: string, decision: DecisionKey) => void;
  estCandidate: (formationId: string) => boolean;
  toggleComparaison: (formationId: string) => boolean;
  retirerComparaison: (formationId: string) => void;
  viderComparaison: () => void;
}
export const DemoSessionContext = createContext<DemoSessionValue | null>(null);
export const dateAujourdhui = () =>
  new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
export const reclasser = (items: CandidatureDemo[]) =>
  items.map((item, index) => ({ ...item, rang: index + 1 }));
/** Builds a deterministic fictional identity from the entered NPI, so the demo feels real. */
export function creerProfilDemo(
  npi: string,
  telephone: string,
  bac: BacInfo,
  email: string,
  npiToken: string
): ProfilDemo {
  const digits = npi.replace(/\D/g, "").padEnd(10, "7");
  const seed = (offset: number) => Number(digits.slice(offset, offset + 2).replace(/^0+/, "") || "1");
  const nom = nomsDemo[seed(0) % nomsDemo.length];
  const prenom = prenomsDemo[seed(2) % prenomsDemo.length];
  const lieuNaissance = villesNaissanceDemo[seed(4) % villesNaissanceDemo.length];
  const anneeNaissance = 2003 + (seed(6) % 5);
  const moisNaissance = String(1 + (seed(8) % 12)).padStart(2, "0");
  const jourNaissance = String(1 + (seed(1) % 27)).padStart(2, "0");
  const mention = mentionsDemo[seed(3) % mentionsDemo.length];
  const priseEnCharge = statutsPriseEnChargeDemo[seed(5) % statutsPriseEnChargeDemo.length];
  return {
    npi: npi.trim(),
    npiToken,
    matricule: `MS-${anneeNaissance}-${digits.slice(0, 6).padStart(6, "4")}`,
    nom,
    prenom,
    dateNaissance: `${jourNaissance}/${moisNaissance}/${anneeNaissance}`,
    lieuNaissance,
    telephone: telephone.trim(),
    email: email.trim(),
    bac: { ...bac, mention, priseEnCharge },
  };
}
export default function useDemoSession() {
  const context = useContext(DemoSessionContext);
  if (!context) {
    throw new Error("useDemoSession doit être utilisé à l'intérieur de DemoSessionProvider");
  }
  return context;
}
