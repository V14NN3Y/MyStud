import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useDemoSession from "@/hooks/useDemoSession";
import { formations } from "@/mocks/formations";
export default function EspaceEtudiantCta() {
  const { t } = useTranslation();
  const { candidatures, setDecision } = useDemoSession();
  const acceptee = candidatures.find((candidature) => candidature.decision === "acceptee");
  const formation = acceptee ? formations.find((f) => f.id === acceptee.formationId) : undefined;
  if (acceptee && formation) {
    return (
      <article className="relative overflow-hidden rounded-lg bg-primary-900 p-5 animate-fade-up md:p-6">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent-500/20"></div>
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-background-50/10">
              <i className="ri-graduation-cap-fill text-xl text-accent-400"></i>
            </span>
            <div>
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent-300">
                <i className="ri-checkbox-circle-line"></i>
                {t("espace.etudiant.admission")}
              </p>
              <h3 className="mt-1 font-heading text-base font-bold text-background-50">{formation.nom}</h3>
              <p className="text-xs text-background-200">
                {formation.etablissement} · {formation.ville}
              </p>
            </div>
          </div>
          <Link
            to="/espace/etudiant"
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-accent-500 px-5 py-2.5 text-sm font-semibold text-primary-950 transition-colors hover:bg-accent-400"
          >
            {t("espace.etudiant.enter")}
            <i className="ri-arrow-right-up-line text-base"></i>
          </Link>
        </div>
      </article>
    );
  }
  return (
    <article className="rounded-lg border border-background-200 bg-background-100 p-5 animate-fade-up md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-background-50">
          <i className="ri-lock-2-line text-xl text-foreground-600"></i>
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-base font-bold text-foreground-950">{t("espace.etudiant.title")}</h3>
          <p className="mt-1 text-sm leading-relaxed text-foreground-600">{t("espace.etudiant.desc")}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 border-t border-background-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-start gap-2 text-xs text-foreground-600">
          <i className="ri-information-line mt-0.5 text-secondary-500"></i>
          {candidatures.length === 0 ? t("espace.etudiant.aucune") : t("espace.etudiant.locked")}
        </p>
        {candidatures.length === 0 ? (
          <Link
            to="/formations"
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2.5 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
          >
            <i className="ri-book-2-line text-sm"></i>
            {t("nav.formations")}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setDecision(candidatures[0].id, "acceptee")}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2.5 text-xs font-semibold text-background-50 transition-colors hover:bg-primary-600"
          >
            <i className="ri-magic-line text-sm"></i>
            {t("espace.etudiant.simuler")}
          </button>
        )}
      </div>
    </article>
  );
}
