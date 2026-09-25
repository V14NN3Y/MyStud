export function formatServerDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const jour = date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const heure = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${jour} · ${heure}`;
}
