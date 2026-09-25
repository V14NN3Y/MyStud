// FAQ d'assistance MyStud (section 14) : NPI, candidatures, statuts, bourses,
// notes, documents et problèmes de téléphone associé à l'identité.
export const faqCategories = [
  {
    id: "npi",
    titre: "Numéro Personnel d'Identification (NPI)",
    icon: "ri-fingerprint-line",
    questions: [
      {
        id: "npi-1",
        q: "Où trouver mon NPI ?",
        r: "Le NPI figure sur votre carte d'identité biométrique, sous la forme de dix chiffres. Il est demandé lors de la première identification sur MyStud.",
      },
      {
        id: "npi-2",
        q: "Mon NPI est-il affiché partout sur la plateforme ?",
        r: "Non. Le NPI sert uniquement à l'identification et n'apparaît jamais dans les adresses de page ni dans les listes. MyStud vous attribue un matricule interne qui sert d'identifiant d'affichage.",
      },
      {
        id: "npi-3",
        q: "La vérification ANIP est-elle active dans le prototype ?",
        r: "Non. Dans cette démonstration, la vérification ANIP et l'envoi du code par SMS sont simulés. Aucune donnée réelle n'est interrogée.",
      },
    ],
  },
  {
    id: "candidatures",
    titre: "Candidatures",
    icon: "ri-send-plane-line",
    questions: [
      {
        id: "cand-1",
        q: "Combien de candidatures puis-je déposer ?",
        r: "Vous pouvez déposer jusqu'à trois candidatures, classées par ordre de préférence, du choix n° 1 au choix n° 3.",
      },
      {
        id: "cand-2",
        q: "Puis-je modifier ou retirer un choix ?",
        r: "Oui, tant que la candidature n'est pas marquée « en traitement ». Après le début de l'instruction, toute modification doit être adressée à l'université.",
      },
      {
        id: "cand-3",
        q: "Dois-je redéposer mes pièces justificatives ?",
        r: "Non. Les pièces déjà validées dans les systèmes officiels ne sont pas à redéposer, sauf si une université demande une information complémentaire.",
      },
    ],
  },
  {
    id: "statuts",
    titre: "Statuts et décisions",
    icon: "ri-flow-chart",
    questions: [
      {
        id: "stat-1",
        q: "Que signifient les statuts de ma candidature ?",
        r: "Chaque candidature passe par : brouillon, soumise, transmise, en vérification, en traitement, complément demandé, acceptée, refusée ou liste d'attente. Chaque étape indique sa date et l'organisme responsable.",
      },
      {
        id: "stat-2",
        q: "Qui décide de l'admission ?",
        r: "L'université reste seule responsable de la décision d'admission. MyStud transmet le dossier et affiche la décision, sans décider à sa place.",
      },
      {
        id: "stat-3",
        q: "Comment connaître le motif d'un refus ?",
        r: "En cas de refus, l'université sélectionne un motif standardisé et peut ajouter une explication, que vous retrouvez dans le suivi de votre candidature.",
      },
    ],
  },
  {
    id: "bourses",
    titre: "Bourses et aides",
    icon: "ri-hand-coin-line",
    questions: [
      {
        id: "bou-1",
        q: "MyStud attribue-t-il automatiquement les bourses ?",
        r: "Non. MyStud collecte et suit votre candidature, mais la décision d'attribution appartient au ministère ou à l'organisme responsable du programme.",
      },
      {
        id: "bou-2",
        q: "Comment connaître les filières non boursières ?",
        r: "Chaque fiche de formation indique son régime : boursière, partiellement boursière ou non boursière, ainsi que les places à frais partagés (FPP).",
      },
      {
        id: "bou-3",
        q: "Quelles sont les étapes du suivi d'une bourse ?",
        r: "Brouillon, soumise, en étude, pièce complémentaire, acceptée, rejetée, mise en paiement et clôturée.",
      },
    ],
  },
  {
    id: "notes",
    titre: "Notes et examens",
    icon: "ri-bar-chart-box-line",
    questions: [
      {
        id: "note-1",
        q: "Quand une note devient-elle visible ?",
        r: "Une note n'apparaît pour l'étudiant qu'après validation par le circuit prévu par l'établissement.",
      },
      {
        id: "note-2",
        q: "Que faire si je conteste une note ?",
        r: "Vous pouvez déposer une demande de vérification ou une réclamation. Elle est horodatée, adressée au service compétent et suivie par statut.",
      },
      {
        id: "note-3",
        q: "Un changement d'examen m'est-il notifié ?",
        r: "Oui. Les changements urgents de salle, d'horaire ou d'annulation déclenchent une notification prioritaire.",
      },
    ],
  },
  {
    id: "documents",
    titre: "Documents administratifs",
    icon: "ri-folder-download-line",
    questions: [
      {
        id: "doc-1",
        q: "Quels documents puis-je demander ?",
        r: "Certificat de scolarité, attestation de réussite, relevé de notes, carte étudiant, quittance, attestation de stage et lettre de recommandation, lorsque l'établissement offre ce service.",
      },
      {
        id: "doc-2",
        q: "Comment vérifier l'authenticité d'un document ?",
        r: "Chaque document produit porte une référence unique et, dans la version pilote, un QR code de vérification. La signature électronique officielle est une évolution à venir.",
      },
    ],
  },
  {
    id: "telephone",
    titre: "Téléphone associé à l'identité",
    icon: "ri-smartphone-line",
    questions: [
      {
        id: "tel-1",
        q: "Je ne reçois pas les SMS de vérification.",
        r: "Vérifiez que le numéro associé à votre NPI est bien à jour. Si le numéro a changé, la mise à jour doit être confirmée auprès du service compétent avant l'envoi d'un nouveau code.",
      },
      {
        id: "tel-2",
        q: "J'ai changé de numéro de téléphone.",
        r: "Le numéro associé à l'identité ne peut pas être modifié librement : la modification suit une procédure de vérification pour éviter toute usurpation, puis la demande est journalisée.",
      },
    ],
  },
];
