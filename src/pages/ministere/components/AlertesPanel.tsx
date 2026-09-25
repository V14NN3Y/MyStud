import { useTranslation } from "react-i18next";
import { alertesPilotage } from "@/mocks/ministere";
const NIVEAUX: Record<string, { dot: string; chip: string; icon: string }> = {
  eleve: { dot: "bg-secondary-500", chip: "bg-secondary-100 text-secondary-900", icon: "ri-error-warning-line" },
  moyen: { dot: "bg-accent-500", chip: "bg-accent-100 text-accent-900", icon: "ri-alert-line" },
  faible: { dot: "bg-primary-500", chip: "bg-primary-100 text-primary-800", icon: "ri-information-line" },
};
export default function AlertesPanel() {
  const { t } = useTranslation();
  return (
    <ul className="space-y-3">
      {alertesPilotage.map((alerte, index) => {
        const style = NIVEAUX[alerte.niveau] ?? NIVEAUX.faible;
        return (
          <li
            key={alerte.id}
            className={`reveal flex items-start gap-3 rounded-md border border-background-200 bg-background-50 p-4 ${
              index < 3 ? `delay-${index + 1}` : ""
            }`}
          >
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.chip}`}>
              <i className={`${style.icon} text-base`}></i>
            </span>
            <div className="min-w-0">
              <p className="text-sm leading-relaxed text-foreground-800">{alerte.label}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-foreground-500">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-semibold ${style.chip}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`}></span>
                  {t(`ministere.niveau.${alerte.niveau}`)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="ri-map-pin-2-line"></i>
                  {alerte.cible}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
