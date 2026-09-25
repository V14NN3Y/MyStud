import { useTranslation } from "react-i18next";
import { statsInstitution } from "@/mocks/universite";
export default function StatsInstitution() {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-background-200 bg-background-100 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground-950">{t("univ.stats.title")}</h2>
          <p className="mt-1 text-sm text-foreground-600">{t("univ.stats.desc")}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-800">
          <i className="ri-shield-check-line text-sm"></i>
          {t("univ.anonyme")}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsInstitution.map((stat) => (
          <div key={stat.id} className="rounded-lg border border-background-200 bg-background-50 px-4 py-4">
            <p className="font-heading text-2xl font-bold tracking-tight text-foreground-950">{stat.valeur}</p>
            <p className="mt-1 text-xs text-foreground-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
