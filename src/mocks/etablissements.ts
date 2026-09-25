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
      "https://readdy.ai/api/search-image?query=modern african university campus building with green lawns and palm trees under warm sunlight, clean architectural photography, warm neutral tones&width=900&height=640&seq=mystud-etab-uac-01&orientation=landscape&nocache=false",
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
      "https://readdy.ai/api/search-image?query=northern benin university campus with modern low buildings and dry savanna landscape, warm golden afternoon light, clean editorial architecture photography&width=900&height=640&seq=mystud-etab-up-02&orientation=landscape&nocache=false",
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
      "https://readdy.ai/api/search-image?query=modern engineering school campus with laboratory buildings and clear sky, minimal contemporary architecture, warm stone and green tones&width=900&height=640&seq=mystud-etab-unstim-03&orientation=landscape&nocache=false",
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
      "https://readdy.ai/api/search-image?query=agricultural university campus surrounded by green cultivated fields and experimental farm plots, warm natural light, clean documentary aerial photography&width=900&height=640&seq=mystud-etab-una-04&orientation=landscape&nocache=false",
    site: "www.una.bj",
    contact: "scolarite@una.bj",
  },
];
