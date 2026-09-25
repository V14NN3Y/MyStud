import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Formation } from "@/types/portal";
import useDemoSession from "@/hooks/useDemoSession";
import { guideFormations } from "@/mocks/formationsGuide";
interface FormationCardProps {
  formation: Formation;
  delay?: number;
}
const REGIME_STYLES: Record<string, { classes: string; icon: string }> = {
  Boursière: { classes: "bg-primary-100 text-primary-800", icon: "ri-hand-coin-line" },
  "Partiellement boursière": { classes: "bg-accent-100 text-accent-900", icon: "ri-hand-coin-line" },
  "Non boursière": { classes: "bg-background-200 text-foreground-700", icon: "ri-forbid-2-line" },
};
export default function FormationCard({ formation, delay = 0 }: FormationCardProps) {
  const { t } = useTranslation();
  const { comparaison, toggleComparaison, estCandidate } = useDemoSession();
  const delayClass = delay > 0 ? `delay-${Math.min(delay, 5)}` : "";
  const dansComparateur = comparaison.includes(formation.id);
  const dansDossier = estCandidate(formation.id);
  const guide = guideFormations[formation.id as keyof typeof guideFormations];
  return (
    <article
      className={`group hover-lift flex flex-col overflow-hidden rounded-lg border border-background-200 bg-background-50 hover:border-primary-300 animate-fade-up ${delayClass}`}
      data-product-shop
    >
      <div className="relative w-full h-44 overflow-hidden">
        <img
          src={formation.image}
          alt={`${formation.nom} — ${formation.etablissement}`}
          title={`${formation.nom} ${formation.ville} Bénin`}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-50/95 px-2.5 py-1 text-[11px] font-semibold text-primary-800">
            {formation.niveau}
          </span>
          {dansDossier && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-500 px-2.5 py-1 text-[11px] font-semibold text-background-50">
              <i className="ri-checkbox-circle-fill"></i>
              {t("espace.dansDossier")}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-foreground-950/70 px-2.5 py-1 text-[11px] font-medium text-background-50">
            {formation.domaine}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="text-base font-semibold leading-snug text-foreground-950">
          {formation.nom}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-foreground-600">
          {formation.etablissement}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-foreground-600">
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-map-pin-2-line text-[13px] text-secondary-500"></i>
            {formation.ville}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-time-line text-[13px] text-secondary-500"></i>
            {formation.duree}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-group-line text-[13px] text-secondary-500"></i>
            {formation.capacite} places
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {formation.series.map((s) => (
            <span
              key={s}
              className="rounded-md bg-secondary-50 px-2 py-0.5 text-[11px] font-medium text-secondary-800"
            >
              Série {s}
            </span>
          ))}
        </div>
        {guide && (
          <div className="mt-3 rounded-md border border-background-200 bg-background-100/70 p-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                  REGIME_STYLES[guide.regime]?.classes ?? REGIME_STYLES["Non boursière"].classes
                }`}
              >
                <i className={`${REGIME_STYLES[guide.regime]?.icon ?? "ri-hand-coin-line"} text-[12px]`}></i>
                {guide.regime}
              </span>
              {guide.placesBourse > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground-700">
                  <i className="ri-award-line text-[12px] text-primary-600"></i>
                  {guide.placesBourse} {t("guide.placesBourse")}
                </span>
              )}
              {guide.placesFPP > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground-700">
                  <i className="ri-wallet-3-line text-[12px] text-secondary-600"></i>
                  {guide.placesFPP} {t("guide.placesFPP")}
                </span>
              )}
            </div>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-xs font-semibold text-foreground-800">{formation.frais}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleComparaison(formation.id)}
              aria-pressed={dansComparateur}
              title={dansComparateur ? t("compare.added") : t("compare.add")}
              className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border px-2.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                dansComparateur
                  ? "border-primary-300 bg-primary-100 text-primary-800"
                  : "border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300 hover:text-primary-700"
              }`}
            >
              <i className={dansComparateur ? "ri-check-line text-[13px]" : "ri-scales-3-line text-[13px]"}></i>
              {dansComparateur ? t("compare.added") : t("compare.add")}
            </button>
            <Link
              to={`/formations/${formation.id}`}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-primary-500 px-3 py-2 text-xs font-semibold whitespace-nowrap text-background-50 transition-colors hover:bg-primary-600"
            >
              {t("common.seeDetails")}
              <i className="ri-arrow-right-line text-[13px]"></i>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
