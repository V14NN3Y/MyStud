// Données d'orientation issues du Guide d'information et de sensibilisation
// des nouveaux bacheliers 2026-2027 (MESRS). Clés = identifiants des
// formations du catalogue national (src/mocks/formations.ts). Quotas de
// bourses, places à régime payant (FPP) et séries admises repris tels quels
// du guide officiel — placesBourse + placesFPP == capacite de la formation.
export const SOURCE_GUIDE = "Guide d'information et de sensibilisation des nouveaux bacheliers 2026-2027 (MESRS)";
function regimeDe(bourse: number, fpp: number): string {
  if (bourse === 0 && fpp === 0) return "Sur dossier";
  if (bourse === 0) return "Non boursière";
  if (fpp === 0) return "Boursière";
  return "Partiellement boursière";
}
const brut: Record<string, { serieCode: string; placesBourse: number; placesFPP: number; note: string }> = {
  "sante-publique-irsp": { serieCode: "C, D", placesBourse: 50, placesFPP: 7, note: "Quota boursier majoritaire pour cette filière de santé communautaire." },
  "anglais-flash-adjarra": { serieCode: "A1, A2, B, C, D, DEAT", placesBourse: 10, placesFPP: 330, note: "Filière très majoritairement à régime payant (FPP), quota boursier réduit." },
  "prepa-mpsi-pcsi-imsp": { serieCode: "C, D, E, F1, F2, F3, F4", placesBourse: 100, placesFPP: 15, note: "Classes préparatoires boursières, places FPP réservées aux candidats hors quota." },
  "anglais-fllac": { serieCode: "A1, A2, B, C, D", placesBourse: 5, placesFPP: 320, note: "Filière très majoritairement à régime payant (FPP)." },
  "arts-plastiques-inmaac": { serieCode: "A1, A2, B, C, D, DT", placesBourse: 5, placesFPP: 10, note: "Petit effectif, quotas bourse et FPP équilibrés." },
  "environnement-sante-cifred": { serieCode: "A1, A2, B, C, D, EA", placesBourse: 31, placesFPP: 5, note: "Quota boursier majoritaire pour cette filière interfacultaire." },
  "gestion-cadre-vie-igate": { serieCode: "A1, A2, B, C, D", placesBourse: 50, placesFPP: 12, note: "Quota boursier majoritaire." },
  "sciences-infirmieres-inemes": { serieCode: "C, D", placesBourse: 40, placesFPP: 0, note: "Admission sur concours, filière intégralement boursière." },
  "hydraulique-assainissement-ine": { serieCode: "C, D, EA", placesBourse: 52, placesFPP: 10, note: "Quota boursier majoritaire pour cette filière d'ingénierie de l'eau." },
  "analyse-informatique-eneam": { serieCode: "C, D, DT", placesBourse: 69, placesFPP: 5, note: "Quota boursier très majoritaire." },
  "gestion-patrimoine-epa": { serieCode: "A1, A2, B, C, D, G1, G2, G3", placesBourse: 37, placesFPP: 15, note: "Quota boursier majoritaire." },
  "psychologie-fashs": { serieCode: "A1, A2, B, D", placesBourse: 15, placesFPP: 125, note: "Filière majoritairement à régime payant (FPP)." },
  "journalisme-enstic": { serieCode: "A1, A2, B, C, D, G1, G2, G3", placesBourse: 15, placesFPP: 0, note: "Admission sur concours, filière intégralement boursière." },
  "administration-generale-enam": { serieCode: "A1, A2, B, C, D, G1, G2, G3", placesBourse: 10, placesFPP: 25, note: "Quota partiellement boursier." },
  "genie-logiciel-ifri": { serieCode: "C, D, E, DT", placesBourse: 23, placesFPP: 5, note: "Quota boursier majoritaire pour cette filière numérique très demandée." },
  "production-vegetale-fsa": { serieCode: "C, D, DEAT", placesBourse: 24, placesFPP: 3, note: "Quota boursier très majoritaire." },
  "medecine-generale-fss": { serieCode: "C, D", placesBourse: 95, placesFPP: 20, note: "Quota boursier majoritaire pour la médecine générale." },
  "genie-informatique-telecom-epac": { serieCode: "C, D, E, F2", placesBourse: 30, placesFPP: 5, note: "Quota boursier majoritaire pour cette filière d'ingénierie." },
  "commerce-international-herci": { serieCode: "B, C, D, G2, G3", placesBourse: 10, placesFPP: 3, note: "Quota boursier majoritaire, petit effectif." },
  "eps-injeps": { serieCode: "A1, A2, B, C, D", placesBourse: 35, placesFPP: 0, note: "Admission sur concours, filière intégralement boursière." },
  "anglais-ens-portonovo": { serieCode: "A1, A2, B, C, D", placesBourse: 15, placesFPP: 0, note: "Admission sur concours, filière intégralement boursière." },
  "droit-fadesp": { serieCode: "A1, A2, B, C, D, G2", placesBourse: 0, placesFPP: 500, note: "Filière non boursière cette campagne : toutes les places relèvent du régime payant." },
  "economie-gestion-faseg": { serieCode: "B, C, D, G2, G3, DT", placesBourse: 10, placesFPP: 700, note: "Filière très majoritairement à régime payant (FPP), quota boursier symbolique." },
  "physique-chimie-fast": { serieCode: "C, D", placesBourse: 233, placesFPP: 405, note: "Grand effectif partiellement boursier, la majorité des places étant en FPP." },
  "langue-chinoise-confucius": { serieCode: "A1, A2, B, C, D", placesBourse: 0, placesFPP: 0, note: "Admission sur dossier, hors quota bourse/FPP national." },
  "culture-islamique-ilaci": { serieCode: "A1, A2, B, C, D", placesBourse: 0, placesFPP: 0, note: "Admission sur dossier, hors quota bourse/FPP national." },
  "production-vegetale-fa-up": { serieCode: "C, D, DEAT", placesBourse: 30, placesFPP: 10, note: "Quota boursier majoritaire." },
  "medecine-humaine-fm-up": { serieCode: "C, D", placesBourse: 100, placesFPP: 30, note: "Quota boursier majoritaire pour la médecine humaine à Parakou." },
  "sante-publique-enatse": { serieCode: "C, D", placesBourse: 54, placesFPP: 25, note: "Quota boursier majoritaire." },
  "soins-infirmiers-ifsio": { serieCode: "C, D", placesBourse: 50, placesFPP: 0, note: "Admission sur concours, filière intégralement boursière." },
  "informatique-gestion-iut": { serieCode: "C, D, G2", placesBourse: 35, placesFPP: 11, note: "Quota boursier majoritaire." },
  "statistiques-appliquees-enspd": { serieCode: "C, D", placesBourse: 15, placesFPP: 0, note: "Admission sur concours, filière intégralement boursière." },
  "finance-comptabilite-faseg-up": { serieCode: "B, C, D, G2, G3", placesBourse: 10, placesFPP: 120, note: "Filière majoritairement à régime payant (FPP)." },
  "droit-prive-fdsp-up": { serieCode: "A1, A2, B, C, D, G1, G2, G3", placesBourse: 0, placesFPP: 270, note: "Filière non boursière cette campagne : toutes les places relèvent du régime payant." },
  "anglais-flash-up": { serieCode: "A1, A2, B, C, D, DEAT", placesBourse: 5, placesFPP: 210, note: "Filière très majoritairement à régime payant (FPP)." },
  "genie-civil-enset": { serieCode: "C, D, F4, DT", placesBourse: 27, placesFPP: 0, note: "Admission sur concours, filière intégralement boursière." },
  "genie-civil-insti": { serieCode: "C, D, E, F4, DT", placesBourse: 50, placesFPP: 10, note: "Quota boursier majoritaire." },
  "sciences-ingenieur-inspei": { serieCode: "C, D, E", placesBourse: 83, placesFPP: 0, note: "Admission sur concours, classes préparatoires intégralement boursières." },
  "mathematiques-informatique-ens-nati": { serieCode: "C, D", placesBourse: 41, placesFPP: 0, note: "Admission sur concours, filière intégralement boursière." },
  "biotechnologie-medicale-ensbba": { serieCode: "C, D", placesBourse: 18, placesFPP: 10, note: "Quota partiellement boursier." },
  "mathematiques-informatiques-fast-nati": { serieCode: "C, D", placesBourse: 63, placesFPP: 43, note: "Grand effectif partiellement boursier." },
  "froid-climatisation-ensgep": { serieCode: "C, D, DT", placesBourse: 19, placesFPP: 3, note: "Quota boursier majoritaire, petit effectif." },
  "genie-civil-enstp": { serieCode: "C, D, E, EA, F4, DT", placesBourse: 41, placesFPP: 4, note: "Quota boursier très majoritaire." },
  "aquaculture-eaq": { serieCode: "C, D, DEAT", placesBourse: 22, placesFPP: 4, note: "Quota boursier majoritaire." },
  "horticulture-ehaev": { serieCode: "C, D, DEAT", placesBourse: 31, placesFPP: 3, note: "Quota boursier très majoritaire." },
  "production-vegetale-semenciere-egpvs": { serieCode: "C, D, DEAT", placesBourse: 39, placesFPP: 5, note: "Quota boursier très majoritaire." },
  "industrie-agroalimentaire-estctpa": { serieCode: "C, D, DEAT", placesBourse: 35, placesFPP: 5, note: "Quota boursier très majoritaire." },
  "agroequipement-egr": { serieCode: "C, D, E, F1, F2, F3, DEAT", placesBourse: 21, placesFPP: 4, note: "Quota boursier majoritaire." },
  "productions-animales-egese": { serieCode: "C, D, DEAT", placesBourse: 50, placesFPP: 3, note: "Quota boursier très majoritaire." },
  "gestion-exploitations-eapa": { serieCode: "C, D, DEAT", placesBourse: 30, placesFPP: 2, note: "Quota boursier très majoritaire." },
  "sociologie-rurale-esrva": { serieCode: "C, D, DEAT", placesBourse: 47, placesFPP: 5, note: "Quota boursier très majoritaire." },
  "foresterie-tropicale-efort": { serieCode: "C, D, DEAT", placesBourse: 19, placesFPP: 3, note: "Quota boursier majoritaire." },
};
export const guideFormations = Object.fromEntries(
  Object.entries(brut).map(([id, v]) => [
    id,
    { ...v, regime: regimeDe(v.placesBourse, v.placesFPP) },
  ])
);
