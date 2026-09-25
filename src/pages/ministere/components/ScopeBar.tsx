import { useTranslation } from "react-i18next";
import { perimetreMinistere, zonesMinistere } from "@/mocks/ministere";
interface ScopeBarProps {
  value: string;
  onChange: (zone: string) => void;
}
export default function ScopeBar({ value, onChange }: ScopeBarProps) {
  const { t } = useTranslation();
  const options = [{ key: "", label: t("ministere.scope.national") }, ...zonesMinistere.map((z) => ({ key: z, label: z }))];
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-500">
            <i className="ri-focus-3-line text-sm"></i>
            {t("ministere.perimetre")}
          </span>
          <div className="flex flex-wrap items-center gap-1 rounded-full bg-background-100 p-1">
            {options.map((option) => {
              const actif = value === option.key;
              return (
                <button
                  key={option.key || "national"}
                  type="button"
                  onClick={() => onChange(option.key)}
                  aria-pressed={actif}
                  className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    actif ? "bg-primary-500 text-background-50" : "text-foreground-600 hover:bg-background-50 hover:text-foreground-950"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-foreground-600">
          <span className="inline-flex items-center gap-2">
            <i className="ri-calendar-line text-secondary-500"></i>
            {t("ministere.campagne")} : <strong className="font-semibold text-foreground-800">{perimetreMinistere.campagne}</strong>
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="ri-refresh-line text-secondary-500"></i>
            {t("ministere.majLe")} {perimetreMinistere.miseAJour}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-start gap-2 border-t border-background-200 pt-4 text-xs text-foreground-600">
        <i className="ri-shield-check-line mt-0.5 text-base text-primary-600"></i>
        <span>
          <strong className="font-semibold text-foreground-800">{t("ministere.notice")}</strong> {t("ministere.scope.hint")}
        </span>
      </div>
    </div>
  );
}
