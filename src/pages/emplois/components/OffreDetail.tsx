import { useEffect } from "react";
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
interface OffreDetailProps {
  offre: Offre | null;
  applied: boolean;
  onClose: () => void;
  onApply: (id: string) => void;
}
export default function OffreDetail({ offre, applied, onClose, onApply }: OffreDetailProps) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!offre) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [offre]);
  if (!offre) return null;
  const infos = [
    { icon: "ri-briefcase-line", label: t("emplois.contrat"), valeur: offre.contrat },
    { icon: "ri-time-line", label: t("emplois.duree"), valeur: offre.duree },
    { icon: "ri-map-pin-2-line", label: t("emplois.filters.ville"), valeur: offre.ville },
    { icon: "ri-wallet-3-line", label: t("emplois.remuneration"), valeur: offre.remuneration },
    { icon: "ri-graduation-cap-line", label: t("emplois.niveau"), valeur: offre.niveauRequis },
    { icon: "ri-calendar-event-line", label: t("emplois.dateLimite"), valeur: offre.dateLimite },
  ];
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground-950/50 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <button type="button" aria-label={t("emplois.close")} onClick={onClose} className="absolute inset-0 cursor-pointer"></button>
      <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-background-50 p-5 animate-scale-in sm:rounded-lg md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[11px] uppercase tracking-wide text-foreground-500">{offre.secteur}</span>
            <h2 className="mt-1 font-heading text-xl font-bold text-foreground-950">{offre.titre}</h2>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-foreground-700">
              <i className="ri-building-line text-secondary-500"></i>
              {offre.entreprise}
              {offre.entrepriseVerifiee && <i className="ri-shield-check-line text-primary-600"></i>}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("emplois.close")}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-background-100 text-foreground-700 transition-colors hover:bg-background-200"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        {!offre.entrepriseVerifiee && (
          <p className="mt-4 flex items-start gap-2 rounded-md border border-accent-200 bg-accent-50 p-3 text-xs text-foreground-700">
            <i className="ri-error-warning-line mt-0.5 text-base text-accent-700"></i>
            {t("emplois.pendingNote")}
          </p>
        )}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {infos.map((info) => (
            <div key={info.label} className="rounded-md bg-background-100 px-4 py-3">
              <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-foreground-500">
                <i className={`${info.icon} text-[13px] text-secondary-500`}></i>
                {info.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground-950">{info.valeur}</p>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-foreground-950">{t("emplois.competences")}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {offre.competences.map((competence) => (
              <span key={competence} className="rounded-full border border-background-200 bg-background-100 px-3 py-1 text-xs font-medium text-foreground-700">
                {competence}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-foreground-950">{t("emplois.detail")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground-700">{offre.description}</p>
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-background-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-foreground-500">
            {t("emplois.publieLe")} {offre.publieLe}
          </span>
          <button
            type="button"
            onClick={() => onApply(offre.id)}
            disabled={applied}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${
              applied ? "cursor-default bg-primary-100 text-primary-800" : "bg-primary-500 text-background-50 hover:bg-primary-600"
            }`}
          >
            <i className={applied ? "ri-check-line" : "ri-send-plane-line"}></i>
            {applied ? t("emplois.applyDone") : t("emplois.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
