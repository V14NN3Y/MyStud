interface StatusBadgeProps {
  statut: string;
  size?: "sm" | "md";
}
const STATUT_STYLES: Record<string, { classes: string; icon: string }> = {
  Vérifiée: { classes: "bg-primary-100 text-primary-800 border-primary-200", icon: "ri-shield-check-line" },
  Importée: { classes: "bg-secondary-100 text-secondary-800 border-secondary-200", icon: "ri-download-cloud-line" },
  "En attente": { classes: "bg-accent-100 text-accent-900 border-accent-300", icon: "ri-time-line" },
  Démonstration: { classes: "bg-background-200 text-foreground-700 border-background-300", icon: "ri-flask-line" },
  Ouverte: { classes: "bg-primary-100 text-primary-800 border-primary-200", icon: "ri-door-open-line" },
  "Bientôt clôturée": { classes: "bg-accent-100 text-accent-900 border-accent-300", icon: "ri-alarm-warning-line" },
  "À venir": { classes: "bg-secondary-100 text-secondary-800 border-secondary-200", icon: "ri-calendar-event-line" },
};
export default function StatusBadge({ statut, size = "sm" }: StatusBadgeProps) {
  const style = STATUT_STYLES[statut] ?? STATUT_STYLES["Démonstration"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${style.classes} ${
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
      }`}
    >
      <i className={`${style.icon} text-[13px]`}></i>
      {statut}
    </span>
  );
}
