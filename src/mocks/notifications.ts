// Notifications et assistance (section 14 du cahier des charges).
// Trois canaux : portail, SMS, e-mail. Les alertes de sécurité et certaines échéances
// administratives restent obligatoires. Aucun envoi réel n'est effectué en démonstration.
export const canauxNotification = [
  {
    id: "portail",
    nom: "Portail MyStud",
    icon: "ri-notification-3-line",
    obligatoire: true,
    description: "Canal de référence : chaque événement est archivé dans votre portail, même si un autre canal échoue.",
  },
  {
    id: "sms",
    nom: "SMS",
    icon: "ri-smartphone-line",
    obligatoire: false,
    description: "Utilisé pour les alertes urgentes et les échéances proches, sur le numéro associé à votre NPI.",
  },
  {
    id: "email",
    nom: "E-mail",
    icon: "ri-mail-line",
    obligatoire: false,
    description: "Pour les documents, les décisions de candidature et les publications de bourses.",
  },
];
export const evenementsPrioritaires = [
  { id: "identite", label: "Validation de l'identité", icon: "ri-shield-check-line", canalDefaut: "Portail + SMS" },
  { id: "bac", label: "Fin de vérification du baccalauréat", icon: "ri-file-check-line", canalDefaut: "Portail + SMS" },
  { id: "candidature", label: "Dépôt et décision de candidature", icon: "ri-send-plane-line", canalDefaut: "Portail + E-mail" },
  { id: "complement", label: "Demande de pièce complémentaire", icon: "ri-file-warning-line", canalDefaut: "Portail + E-mail" },
  { id: "note", label: "Publication d'une note", icon: "ri-bar-chart-box-line", canalDefaut: "Portail" },
  { id: "examen", label: "Changement urgent d'examen", icon: "ri-alarm-warning-line", canalDefaut: "Portail + SMS" },
  { id: "bourse", label: "Publication d'une bourse", icon: "ri-hand-coin-line", canalDefaut: "Portail + E-mail" },
  { id: "document", label: "Génération d'un document", icon: "ri-folder-download-line", canalDefaut: "Portail" },
];
export const categoriesNotification = [
  { id: "identite", nom: "Identité et baccalauréat" },
  { id: "candidatures", nom: "Candidatures et décisions" },
  { id: "notes", nom: "Notes et examens" },
  { id: "bourses", nom: "Bourses et aides" },
  { id: "documents", nom: "Documents administratifs" },
  { id: "securite", nom: "Sécurité du compte" },
];
// L'historique des notifications et les préférences de canal par catégorie
// vivent désormais dans le backend (server/src/db.ts, tables `notifications`
// et `notification_preferences`) — voir src/hooks/NotificationsProvider.tsx
// et src/pages/notifications/page.tsx. Ce fichier ne garde que la taxonomie
// statique (canaux, catégories, types d'événements), qui ne dépend d'aucun
// état par visiteur.