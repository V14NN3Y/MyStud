export const zonesMinistere = ["Sud", "Centre", "Nord"];
export const perimetreMinistere = {
  anneeAcademique: "2025 – 2026",
  miseAJour: "20 septembre 2026",
  campagne: "Campagne nationale de candidatures 2026",
  responsable: "Direction nationale de l'enseignement supérieur",
};
export const indicateursNationaux = [
  { key: "effectifs", valeur: 107190, unite: "étudiants", tendance: "+3,1 %", positif: true },
  { key: "etablissements", valeur: 8, unite: "établissements publics", tendance: "stable", positif: true },
  { key: "formations", valeur: 334, unite: "formations référencées", tendance: "+12", positif: true },
  { key: "candidatures", valeur: 76330, unite: "candidatures reçues", tendance: "+8,4 %", positif: true },
  { key: "admissions", valeur: 25350, unite: "admissions publiées", tendance: "+5,2 %", positif: true },
  { key: "listeAttente", valeur: 8050, unite: "dossiers en liste d'attente", tendance: "−1,7 %", positif: true },
  { key: "tauxReussite", valeur: 81.4, unite: "% de réussite", tendance: "+1,9 pt", positif: true },
  { key: "bourses", valeur: 18650, unite: "bourses et aides accordées", tendance: "+6,8 %", positif: true },
];
export const effectifsEtablissements = [
  { id: "uac", sigle: "UAC", nom: "Université d'Abomey-Calavi", ville: "Abomey-Calavi", zone: "Sud", effectif: 62000 },
  { id: "up", sigle: "UP", nom: "Université de Parakou", ville: "Parakou", zone: "Nord", effectif: 18500 },
  { id: "unstm", sigle: "UNSTIM", nom: "Sciences, Technologie, Ingénierie et Mathématiques", ville: "Abomey", zone: "Centre", effectif: 12400 },
  { id: "una", sigle: "UNA", nom: "Université Nationale d'Agriculture", ville: "Kétou", zone: "Centre", effectif: 6800 },
  { id: "ens", sigle: "ENS", nom: "École Normale Supérieure de Porto-Novo", ville: "Porto-Novo", zone: "Sud", effectif: 4300 },
  { id: "imsp", sigle: "IMSP", nom: "Institut de Mathématiques et de Sciences Physiques", ville: "Dangbo", zone: "Centre", effectif: 1450 },
  { id: "ine", sigle: "INE", nom: "Institut National de l'Eau", ville: "Abomey-Calavi", zone: "Sud", effectif: 980 },
  { id: "enspd", sigle: "ENSPD", nom: "Statistique et de la Démographie", ville: "Abomey-Calavi", zone: "Sud", effectif: 760 },
];
export const effectifsDomaines = [
  { domaine: "Sciences & Ingénierie", effectif: 34500 },
  { domaine: "Économie & Gestion", effectif: 18200 },
  { domaine: "Droit & Sciences politiques", effectif: 15600 },
  { domaine: "Sciences humaines & sociales", effectif: 14800 },
  { domaine: "Santé", effectif: 9800 },
  { domaine: "Sciences de l'éducation", effectif: 6300 },
  { domaine: "Agronomie & Sciences du vivant", effectif: 5400 },
  { domaine: "Sciences fondamentales", effectif: 2590 },
];
export const repartitionGenre = [
  { genre: "Femmes", pourcentage: 43.6 },
  { genre: "Hommes", pourcentage: 56.4 },
];
export const candidaturesEtablissements = [
  { id: "uac", sigle: "UAC", nom: "Université d'Abomey-Calavi", candidatures: 38400, admissions: 12800, listeAttente: 4200, refus: 21400 },
  { id: "up", sigle: "UP", nom: "Université de Parakou", candidatures: 14200, admissions: 4900, listeAttente: 1600, refus: 7700 },
  { id: "unstm", sigle: "UNSTIM", nom: "Sciences, Technologie, Ingénierie et Mathématiques", candidatures: 9800, admissions: 3100, listeAttente: 950, refus: 5750 },
  { id: "una", sigle: "UNA", nom: "Université Nationale d'Agriculture", candidatures: 6100, admissions: 2000, listeAttente: 620, refus: 3480 },
  { id: "ens", sigle: "ENS", nom: "École Normale Supérieure de Porto-Novo", candidatures: 4200, admissions: 1350, listeAttente: 410, refus: 2440 },
  { id: "enc", sigle: "ENSPD", nom: "Statistique et de la Démographie", candidatures: 1400, admissions: 460, listeAttente: 110, refus: 830 },
  { id: "imsp", sigle: "IMSP", nom: "Institut de Mathématiques et de Sciences Physiques", candidatures: 1250, admissions: 420, listeAttente: 90, refus: 740 },
  { id: "ine", sigle: "INE", nom: "Institut National de l'Eau", candidatures: 980, admissions: 320, listeAttente: 70, refus: 590 },
];
export const tauxReussiteNiveaux = [
  { niveau: "Licence", taux: 78.4 },
  { niveau: "Master", taux: 84.2 },
  { niveau: "Doctorat", taux: 89.6 },
];
export const tendancesEffectifs = [
  { annee: "2022", effectif: 92000 },
  { annee: "2023", effectif: 96500 },
  { annee: "2024", effectif: 100200 },
  { annee: "2025", effectif: 104000 },
  { annee: "2026", effectif: 107190 },
];
export const boursesPilotage = [
  { id: "bourse-bac", programme: "Bourse nationale du nouveau bachelier", organisme: "Ministère de l'Enseignement Supérieur", candidatures: 24800, accordees: 12400, montantEngage: "3,1 milliards FCFA", statut: "Mise en paiement" },
  { id: "aide-sociale", programme: "Aide sociale étudiante", organisme: "Ministère des Affaires Sociales", candidatures: 9200, accordees: 3400, montantEngage: "612 millions FCFA", statut: "En étude" },
  { id: "bourse-excellence", programme: "Bourse d'excellence académique", organisme: "Ministère de l'Enseignement Supérieur", candidatures: 4100, accordees: 1850, montantEngage: "480 millions FCFA", statut: "Clôturée" },
  { id: "aide-transport", programme: "Aide au transport et à la restauration", organisme: "Conseil national de la vie étudiante", candidatures: 5600, accordees: 1000, montantEngage: "95 millions FCFA", statut: "En étude" },
  { id: "bourse-master", programme: "Bourse de mobilité Master", organisme: "Coopération internationale", candidatures: 860, accordees: 0, montantEngage: "—", statut: "À venir" },
];
export const alertesPilotage = [
  { id: "capacite", niveau: "eleve", label: "Saturation de capacité à l'UAC sur les filières Sciences & Ingénierie", cible: "UAC" },
  { id: "attente", niveau: "moyen", label: "Liste d'attente en progression à l'UNSTIM", cible: "UNSTIM" },
  { id: "bourses", niveau: "moyen", label: "Aide sociale étudiante : 40 % des dossiers en attente d'instruction", cible: "National" },
  { id: "reussite", niveau: "faible", label: "Taux de réussite en Licence inférieur à la moyenne nationale à l'ENS", cible: "ENS" },
];
