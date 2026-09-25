export const CATEGORIE_META: Record<string, { icon: string; classes: string }> = {
  identite: { icon: "ri-fingerprint-line", classes: "bg-primary-100 text-primary-700" },
  candidatures: { icon: "ri-send-plane-line", classes: "bg-secondary-100 text-secondary-700" },
  notes: { icon: "ri-bar-chart-box-line", classes: "bg-accent-100 text-accent-800" },
  bourses: { icon: "ri-hand-coin-line", classes: "bg-primary-100 text-primary-700" },
  documents: { icon: "ri-folder-download-line", classes: "bg-secondary-100 text-secondary-700" },
  securite: { icon: "ri-shield-keyhole-line", classes: "bg-accent-100 text-accent-800" },
};
export const ETAT_STYLES: Record<string, string> = {
  Envoyé: "bg-primary-100 text-primary-800",
  Échec: "bg-accent-100 text-accent-900",
  "En attente": "bg-background-200 text-foreground-700",
};
