import { useTranslation } from "react-i18next";
import { etapesBourse } from "@/mocks/candidaturesBourse";
const INDEX_STATUT: Record<string, number> = {
  soumise: 0,
  etude: 1,
  complement: 2,
  acceptee: 3,
  rejetee: 3,
  paiement: 4,
  cloture: 5,
};
const STATUTS_TERMINAUX = ["acceptee", "rejetee", "cloture"];
export function indexStatut(statut: string): number {
  return INDEX_STATUT[statut] ?? 0;
}
const ETAT_STYLES: Record<string, { circle: string; line: string; chip: string; icon: string }> = {
  fait: {
    circle: "bg-primary-500 text-background-50",
    line: "bg-primary-300",
    chip: "bg-primary-100 text-primary-800",
    icon: "ri-check-line",
  },
  encours: {
    circle: "bg-accent-500 text-foreground-950 animate-pulse-ring",
    line: "bg-background-200",
    chip: "bg-accent-100 text-accent-900",
    icon: "ri-loader-4-line",
  },
  attente: {
    circle: "bg-background-200 text-foreground-500",
    line: "bg-background-200",
    chip: "bg-background-200 text-foreground-600",
    icon: "ri-more-line",
  },
};
interface BourseStepsProps {
  statut: string;
  message?: string;
}
export default function BourseSteps({ statut, message }: BourseStepsProps) {
  const { t } = useTranslation();
  const current = indexStatut(statut);
  const terminal = STATUTS_TERMINAUX.includes(statut);
  return (
    <ol className="space-y-0">
      {etapesBourse.map((etape, index) => {
        const fait = terminal ? index <= current : index < current;
        const encours = !terminal && index === current;
        const etat = fait ? "fait" : encours ? "encours" : "attente";
        const style = ETAT_STYLES[etat];
        const isLast = index === etapesBourse.length - 1;
        return (
          <li key={etape.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.circle}`}>
                <i className={`${fait ? style.icon : etape.icon} text-base`}></i>
              </span>
              {!isLast && <span className={`mt-1 w-px flex-1 ${style.line}`}></span>}
            </div>
            <div className={`min-w-0 ${isLast ? "" : "pb-5"}`}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-foreground-950">{t(etape.labelKey)}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.chip}`}>
                  {t(`bsuivi.etape.${etat}`)}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-foreground-600">{t(etape.descKey)}</p>
              {encours && message && (
                <p className="mt-2 rounded-md bg-secondary-50 px-3 py-2 text-xs leading-relaxed text-foreground-700">{message}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
