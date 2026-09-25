import { useTranslation } from "react-i18next";
import { actionsAttendues, prochainesEcheances } from "@/mocks/etudiant";
const STATUT_STYLE: Record<string, { classes: string; icon: string; labelKey: string }> = {
  "À faire": { classes: "bg-accent-100 text-accent-900 border-accent-300", icon: "ri-error-warning-line", labelKey: "etudiant.actions.statut.AFaire" },
  "En cours": { classes: "bg-secondary-100 text-secondary-900 border-secondary-200", icon: "ri-loader-4-line", labelKey: "etudiant.actions.statut.EnCours" },
  Terminé: { classes: "bg-primary-100 text-primary-800 border-primary-200", icon: "ri-checkbox-circle-line", labelKey: "etudiant.actions.statut.Termine" },
};
const TYPE_TONE: Record<string, string> = {
  Évaluation: "bg-secondary-100 text-secondary-900",
  Examen: "bg-primary-100 text-primary-800",
  Administratif: "bg-accent-100 text-accent-900",
  Soutenance: "bg-background-200 text-foreground-700",
};
export default function ActionsEcheances() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <section className="rounded-lg border border-background-200 bg-background-50 p-5 animate-fade-up md:p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary-100">
            <i className="ri-task-line text-base text-secondary-700"></i>
          </span>
          <div>
            <h2 className="font-heading text-sm font-bold text-foreground-950">{t("etudiant.actions.title")}</h2>
            <p className="text-[11px] text-foreground-500">{t("etudiant.actions.desc")}</p>
          </div>
        </div>
        <ul className="mt-4 space-y-3">
          {actionsAttendues.map((action) => {
            const style = STATUT_STYLE[action.statut] ?? STATUT_STYLE["À faire"];
            return (
              <li
                key={action.id}
                className="flex items-start gap-3 rounded-md border border-background-200 bg-background-100/60 p-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background-50">
                  <i className={`${action.icon} text-base text-primary-600`}></i>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-foreground-950">{action.label}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-foreground-500">
                    <i className="ri-calendar-line text-[12px]"></i>
                    {t("etudiant.actions.echeance")} : {action.echeance}
                  </p>
                </div>
                <span className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${style.classes}`}>
                  <i className={`${style.icon} mr-1`}></i>
                  {t(style.labelKey)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="rounded-lg border border-background-200 bg-background-50 p-5 animate-fade-up md:p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-100">
            <i className="ri-calendar-event-line text-base text-accent-800"></i>
          </span>
          <div>
            <h2 className="font-heading text-sm font-bold text-foreground-950">{t("etudiant.echeances.title")}</h2>
            <p className="text-[11px] text-foreground-500">{t("etudiant.echeances.desc")}</p>
          </div>
        </div>
        <ol className="relative mt-4">
          {prochainesEcheances.map((echeance, index) => {
            const dernier = index === prochainesEcheances.length - 1;
            return (
              <li key={echeance.id} className="relative flex gap-3.5 pb-5 last:pb-0">
                {!dernier && (
                  <span aria-hidden="true" className="absolute left-[5px] top-4 h-[calc(100%-0.75rem)] w-px bg-background-300"></span>
                )}
                <span className="relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary-500"></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-foreground-950">{echeance.date}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_TONE[echeance.type] ?? TYPE_TONE.Soutenance}`}>
                      {echeance.type}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-foreground-600">{echeance.label}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
