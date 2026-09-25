// Offre ciblée et publication d'annonce (espace ministère).
// Le ministère cible une bourse, une aide ou une annonce par zone, par filière
// ou par établissement. Données fictives de démonstration.
export const typesOffreCiblee = [
  { id: "bourse", nom: "Bourse", icon: "ri-hand-coin-line" },
  { id: "aide", nom: "Aide", icon: "ri-wallet-3-line" },
  { id: "annonce", nom: "Annonce", icon: "ri-megaphone-line" },
];
export const modesCiblage = [
  { id: "zone", nom: "Par zone", icon: "ri-map-2-line" },
  { id: "filiere", nom: "Par filière", icon: "ri-book-2-line" },
  { id: "etablissement", nom: "Par établissement", icon: "ri-building-4-line" },
];
export const offresCiblees = [
  {
    id: "oc-01",
    type: "Bourse",
    titre: "Bourse d'excellence — filières scientifiques",
    mode: "Par filière",
    cible: "Sciences & Ingénierie",
    portee: 34500,
    statut: "Publiée",
    majLe: "21 septembre 2026",
  },
  {
    id: "oc-02",
    type: "Aide",
    titre: "Aide au transport — campus urbains",
    mode: "Par établissement",
    cible: "UAC — Université d'Abomey-Calavi",
    portee: 62000,
    statut: "Publiée",
    majLe: "18 septembre 2026",
  },
  {
    id: "oc-03",
    type: "Annonce",
    titre: "Campagne de candidatures — zone Nord",
    mode: "Par zone",
    cible: "Zone Nord",
    portee: 18500,
    statut: "Publiée",
    majLe: "15 septembre 2026",
  },
  {
    id: "oc-04",
    type: "Bourse",
    titre: "Bourse nationale du nouveau bachelier — zone Centre",
    mode: "Par zone",
    cible: "Zone Centre",
    portee: 20650,
    statut: "En préparation",
    majLe: "12 septembre 2026",
  },
];
