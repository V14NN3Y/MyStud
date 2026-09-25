import { useTranslation } from "react-i18next";
interface Offre {
  id: string;
  titre: string;
  entreprise: string;
  entrepriseVerifiee: boolean;
  secteur: string;
  type: string;
  contrat: string;
  ville: string;
  teletravail: boolean;
  duree: string;
  remuneration: string;
  niveauRequis: string;
  dateLimite: string;
  publieLe: string;
  competences: string[];
  description: string;
}
interface OffreCardProps {
  offre: Offre;
  applied: boolean;
  onOpen: (offre: Offre) => void;
  onApply: (id: string) => void;
}
const TYPE_STYLES: Record<string, string> = {
  Stage: "bg-primary-100 text-primary-800",
  Emploi: "bg-accent-100 text-accent-900",
  Alternance: "bg-secondary-100 text-secondary-900",
  Volontariat: "bg-background-200 text-foreground-700",
};
export default function OffreCard({ offre, applied, onOpen, onApply }: OffreCardProps) {
  const { t } = useTranslation();
  return (
    <article className="reveal hover-lift flex flex-col rounded-lg border border-background-200 bg-background-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TYPE_STYLES[offre.type] ?? TYPE_STYLES.Volontariat}`}>
              {offre.type}
            </span>
            {offre.entrepriseVerifiee ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-0.5 text-[11px] font-semibold text-primary-800">
                <i className="ri-shield-check-line text-[12px]"></i>
                {t("emplois.verified")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2.5 py-0.5 text-[11px] font-semibold text-accent-900">
                <i className="ri-error-warning-line text-[12px]"></i>
                {t("emplois.pending")}
              </span>
            )}
          </div>
          <h3 className="mt-3 font-heading text-base font-bold leading-snug text-foreground-950">{offre.titre}</h3>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-foreground-700">
            <i className="ri-building-line text-secondary-500"></i>
            {offre.entreprise}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground-600">
        <span className="inline-flex items-center gap-1.5">
          <i className="ri-map-pin-2-line text-secondary-500"></i>
          {offre.ville}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="ri-briefcase-line text-secondary-500"></i>
          {offre.contrat}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="ri-time-line text-secondary-500"></i>
          {offre.duree}
        </span>
        {offre.teletravail && (
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-computer-line text-secondary-500"></i>
            {t("emplois.teletravail")}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {offre.competences.slice(0, 4).map((competence) => (
          <span key={competence} className="rounded-full border border-background-200 bg-background-100 px-2.5 py-1 text-[11px] font-medium text-foreground-700">
            {competence}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-background-200 pt-4 sm:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-foreground-500">{t("emplois.remuneration")}</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground-950">{offre.remuneration}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-foreground-500">{t("emplois.dateLimite")}</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground-950">{offre.dateLimite}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onOpen(offre)}
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2.5 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
        >
          <i className="ri-eye-line text-sm"></i>
          {t("emplois.detail")}
        </button>
        <button
          type="button"
          onClick={() => onApply(offre.id)}
          disabled={applied}
          className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 text-xs font-semibold transition-colors ${
            applied
              ? "cursor-default bg-primary-100 text-primary-800"
              : "bg-primary-500 text-background-50 hover:bg-primary-600"
          }`}
        >
          <i className={applied ? "ri-check-line text-sm" : "ri-send-plane-line text-sm"}></i>
          {applied ? t("emplois.applyDone") : t("emplois.apply")}
        </button>
      </div>
    </article>
  );
}
