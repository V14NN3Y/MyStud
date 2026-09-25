export interface Formation {
  id: string;
  nom: string;
  domaine: string;
  niveau: string;
  duree: string;
  diplome: string;
  etablissementId: string;
  etablissement: string;
  ville: string;
  typeEtablissement: string;
  series: string[];
  capacite: number;
  frais: string;
  debouches: string[];
  statut: string;
  majLe: string;
  campagneOuverture: string;
  campagneFermeture: string;
  description: string;
  image: string;
}
export interface Etablissement {
  id: string;
  nom: string;
  sigle: string;
  ville: string;
  type: string;
  fondation: number;
  effectif: number;
  formationsCount: number;
  domaine: string;
  statut: string;
  majLe: string;
  description: string;
  image: string;
  site: string;
  contact: string;
}
export interface Bourse {
  id: string;
  nom: string;
  organisme: string;
  type: string;
  montant: string;
  public: string;
  periode: string;
  criteres: string[];
  statut: string;
  majLe: string;
}
export interface Annonce {
  id: string;
  titre: string;
  categorie: string;
  date: string;
  extrait: string;
  image: string;
}
export interface Domaine {
  id: string;
  nom: string;
  icon: string;
  count: number;
  description: string;
}
export interface Faculte {
  id: string;
  etablissementId: string;
  sigle: string;
  nom: string;
  type: string;
  icone: string;
  formationsCount: number;
  formationIds: string[];
  description: string;
}
