import { useTranslation } from "react-i18next";
import type { Faculte } from "@/types/portal";
interface FacultesGridProps {
  facultes: Faculte[];
}
export default function FacultesGrid({ facultes }: FacultesGridProps) {
  const { t } = useTranslation();
  if (facultes.length === 0) return null;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground-950 md:text-2xl">
            {t("etab.facultes")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-foreground-600">{t("etab.facultesDesc")}</p>
        </div>
        <span className="rounded-full bg-secondary-100 px-3 py-1.5 text-xs font-semibold text-secondary-800">
          {facultes.length} {t("etab.composantes")}
        </span>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facultes.map((faculte, index) => (
          <article
            key={faculte.id}
            className={`hover-lift reveal flex flex-col rounded-lg border border-background-200 bg-background-50 p-5 ${
              index < 3 ? `delay-${index + 1}` : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100">
                <i className={`${faculte.icone} text-lg text-primary-700`}></i>
              </span>
              <span className="rounded-full bg-background-100 px-2.5 py-1 text-[11px] font-medium text-foreground-600">
                {faculte.type}
              </span>
            </div>
            <p className="mt-4 font-heading text-xs font-bold uppercase tracking-wide text-secondary-700">
              {faculte.sigle}
            </p>
            <h3 className="mt-1 text-sm font-semibold leading-snug text-foreground-950">
              {faculte.nom}
            </h3>
            <p className="mt-3 flex-1 text-xs leading-relaxed text-foreground-600">
              {faculte.description}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-background-200 pt-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground-700">
                <i className="ri-book-2-line text-primary-600"></i>
                {faculte.formationsCount} formations
              </span>
              {faculte.formationIds.length > 0 && (
                <a
                  href="#formations-rattachees"
                  className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap text-xs font-semibold text-primary-700 transition-colors hover:text-primary-800"
                >
                  {t("etab.voirFormations")}
                  <i className="ri-arrow-down-line"></i>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
