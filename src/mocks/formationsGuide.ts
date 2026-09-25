// Données d'orientation issues du Guide d'information universitaire du MESRS (campagne 2026-2027).
// Clés = identifiants des formations du catalogue national (src/mocks/formations.ts).
// Valeurs fictives reconstituées pour la démonstration : elles illustrent les quotas de bourses,
// les places à régime payant (FPP) et les séries admises, sans reprendre de données individuelles.
export const SOURCE_GUIDE = "Guide d'information universitaire MESRS — campagne 2026-2027";
export const guideFormations = {
  "genie-informatique-epac": {
    serieCode: "C, D",
    regime: "Boursière",
    placesBourse: 120,
    placesFPP: 60,
    note: "Filière prioritaire éligible à la bourse nationale du nouveau bachelier et au Fonds d'appui à la formation.",
  },
  "genie-civil-epac": {
    serieCode: "C, D, E",
    regime: "Boursière",
    placesBourse: 100,
    placesFPP: 50,
    note: "Quota boursier garanti pour les séries scientifiques et techniques, places payantes complémentaires.",
  },
  "medecine-generale-fss": {
    serieCode: "C, D",
    regime: "Boursière",
    placesBourse: 120,
    placesFPP: 0,
    note: "Filière intégralement prise en charge par l'État ; aucune place à régime payant cette campagne.",
  },
  "sciences-agronomiques-una": {
    serieCode: "C, D",
    regime: "Boursière",
    placesBourse: 160,
    placesFPP: 40,
    note: "Bourse nationale ouverte, complétée par des places à frais partagés pour les non-boursiers.",
  },
  "mathematiques-imsp": {
    serieCode: "C, E",
    regime: "Boursière",
    placesBourse: 45,
    placesFPP: 0,
    note: "Institut de recherche : tous les étudiants admis bénéficient d'une prise en charge de l'État.",
  },
  "physique-unstim": {
    serieCode: "C, E",
    regime: "Boursière",
    placesBourse: 70,
    placesFPP: 20,
    note: "Filière scientifique boursière avec un contingent réduit de places payantes.",
  },
  "economie-gestion-faseg": {
    serieCode: "A1, A2, B, C, D",
    regime: "Partiellement boursière",
    placesBourse: 250,
    placesFPP: 150,
    note: "Filière partiellement boursière : une partie des places est financée, le reste relève du régime payant.",
  },
  "droit-public-fadsp": {
    serieCode: "A1, A2, B, C, D",
    regime: "Partiellement boursière",
    placesBourse: 200,
    placesFPP: 150,
    note: "Quota boursier limité, la majorité des places étant ouverte au régime à frais partagés.",
  },
  "sciences-education-ens": {
    serieCode: "A1, A2, B, C, D",
    regime: "Boursière",
    placesBourse: 180,
    placesFPP: 40,
    note: "Formation des enseignants financée en priorité par l'État au titre du plan national de l'éducation.",
  },
  "genie-eau-ine": {
    serieCode: "C, D, E",
    regime: "Boursière",
    placesBourse: 45,
    placesFPP: 15,
    note: "Master boursier à forte employabilité, quelques places payantes pour les candidats internationaux.",
  },
  "statistique-enspd": {
    serieCode: "C, D, E",
    regime: "Boursière",
    placesBourse: 60,
    placesFPP: 20,
    note: "Filière d'État boursière, avec un contingent payant limité pour les professionnels en reprise d'études.",
  },
  "sociologie-ucas": {
    serieCode: "A1, A2, B",
    regime: "Non boursière",
    placesBourse: 0,
    placesFPP: 260,
    note: "Filière non boursière cette campagne : l'ensemble des places relève du régime payant.",
  },
};