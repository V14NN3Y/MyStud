// Les 4 universités publiques du Bénin (Guide MESRS 2026-2027). IMSP, ENS de
// Porto-Novo, INE et ENSPD sont des établissements rattachés à l'UAC (ou à
// l'UP pour l'ENSPD), pas des universités indépendantes — voir
// src/mocks/facultes.ts pour le détail de leurs formations.
export const etablissements = [
  {
    id: "uac",
    nom: "Université d'Abomey-Calavi",
    sigle: "UAC",
    ville: "Abomey-Calavi",
    type: "Public",
    fondation: 1970,
    effectif: 68730,
    formationsCount: 26,
    domaine: "Pluridisciplinaire",
    statut: "Vérifiée",
    majLe: "20 août 2026",
    description:
      "Première université publique du Bénin et principal pôle d'enseignement supérieur du pays, l'UAC regroupe 26 facultés, écoles et instituts couvrant l'ensemble des grands domaines de formation, dont l'IMSP, l'INE et l'ENS de Porto-Novo.",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/University_of_Benin_Faculty_building_front_view.jpg/1280px-University_of_Benin_Faculty_building_front_view.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail" /* University of Benin Faculty building front view.jpg — Wikimedia Commons (CC BY-SA 4.0) */,
    site: "www.uac.bj",
    contact: "scolarite@uac.bj",
  },
  {
    id: "up",
    nom: "Université de Parakou",
    sigle: "UP",
    ville: "Parakou",
    type: "Public",
    fondation: 2001,
    effectif: 19260,
    formationsCount: 9,
    domaine: "Pluridisciplinaire",
    statut: "Vérifiée",
    majLe: "18 août 2026",
    description:
      "Située au cœur du septentrion, l'Université de Parakou propose des formations en agronomie, médecine, sciences juridiques, sciences économiques et gestion, ainsi qu'en lettres et sciences humaines, sur 9 établissements dont l'ENSPD.",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Universit%C3%A9_de_Parakou.jpg/1280px-Universit%C3%A9_de_Parakou.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail" /* Université de Parakou.jpg — Wikimedia Commons (CC BY-SA 4.0) */,
    site: "www.univ-parakou.bj",
    contact: "scolarite@univ-parakou.bj",
  },
  {
    id: "unstm",
    nom: "Université Nationale des Sciences, Technologies, Ingénierie et Mathématiques",
    sigle: "UNSTIM",
    ville: "Abomey",
    type: "Public",
    fondation: 2009,
    effectif: 12400,
    formationsCount: 8,
    domaine: "Sciences & Ingénierie",
    statut: "Vérifiée",
    majLe: "17 août 2026",
    description:
      "Réseau national dédié aux sciences appliquées, à la technologie, à l'ingénierie et aux mathématiques, l'UNSTIM forme les futurs cadres techniques du Bénin sur 8 établissements répartis entre Abomey, Lokossa et Natitingou.",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Campus_Building_ITS_Engineering_College.jpg/1280px-Campus_Building_ITS_Engineering_College.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail" /* Campus Building ITS Engineering College.jpg — Wikimedia Commons (CC BY-SA 4.0) */,
    site: "www.unstim.bj",
    contact: "info@unstim.bj",
  },
  {
    id: "una",
    nom: "Université Nationale d'Agriculture",
    sigle: "UNA",
    ville: "Kétou",
    type: "Public",
    fondation: 2009,
    effectif: 6800,
    formationsCount: 9,
    domaine: "Agronomie & Sciences du vivant",
    statut: "Vérifiée",
    majLe: "16 août 2026",
    description:
      "Établissement public de référence pour la formation agronomique, l'UNA forme les ingénieurs et techniciens de la production agricole, de l'agroalimentaire et de la gestion des ressources naturelles à travers 9 écoles spécialisées.",
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Rice_Fields1.jpg/1280px-Rice_Fields1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail" /* Rice Fields1.jpg — Wikimedia Commons (CC BY-SA 4.0) */,
    site: "www.una.bj",
    contact: "scolarite@una.bj",
  },
];
