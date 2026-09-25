import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Formation } from "@/types/portal";
import useDemoSession, {
  DECISIONS,
  STATUTS_PROGRESSION,
  type CandidatureDemo,
} from "@/hooks/useDemoSession";
import DecisionTimeline from "./DecisionTimeline";
interface CandidatureCardProps {
  candidature: CandidatureDemo;
  formation: Formation;
}
const STATUT_BADGE = [
  "border-background-300 bg-background-200 text-foreground-700",
  "border-secondary-200 bg-secondary-100 text-secondary-900",
  "border-accent-300 bg-accent-100 text-accent-900",
  "border-secondary-200 bg-secondary-100 text-secondary-900",
  "border-primary-200 bg-primary-100 text-primary-800",
];
export default function CandidatureCard({ candidature, formation }: CandidatureCardProps) {
  const { t } = useTranslation();
  const { deplacerCandidature, retirerCandidature, avancerCandidature, setDecision } = useDemoSession();
  const [open, setOpen] = useState(false);
  const decisionMeta = DECISIONS.find((d) => d.key === candidature.decision) ?? DECISIONS[0];
  const statutIndex = Math.min(candidature.statutIndex, STATUTS_PROGRESSION.length - 1);
  const statut = STATUTS_PROGRESSION[statutIndex];
  const maxAtteint = candidature.statutIndex >= STATUTS_PROGRESSION.length - 1;
  return (
    <article className="hover-lift rounded-lg border border-background-200 bg-background-50 p-4 animate-fade-up md:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-32">
          <img
            src={formation.image}
            alt={`${formation.nom} — ${formation.etablissement}`}
            title={`${formation.nom} ${formation.ville} Bénin`}
            className="h-full w-full object-cover object-top"
          />
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-accent-950">
            <i className="ri-sort-desc"></i>
            {t("espace.choix")} {candidature.rang}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={`/formations/${formation.id}`}
                className="font-heading text-sm font-bold leading-snug text-foreground-950 transition-colors hover:text-primary-700"
              >
                {formation.nom}
              </Link>
              <p className="mt-1 text-xs text-foreground-600">{formation.etablissement}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-foreground-600">
                <span className="inline-flex items-center gap-1.5">
                  <i className="ri-map-pin-2-line text-[13px] text-secondary-500"></i>
                  {formation.ville}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="ri-time-line text-[13px] text-secondary-500"></i>
                  {formation.duree}
                </span>
                <Link
                  to={`/etablissements/${formation.etablissementId}`}
                  className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-secondary-700 transition-colors hover:text-secondary-900"
                >
                  <i className="ri-building-4-line text-[13px]"></i>
                  {t("espace.voirEtab")}
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUT_BADGE[statutIndex]}`}>
                <i className="ri-loader-4-line text-[13px]"></i>
                {statut}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${decisionMeta.badge}`}>
                <i className={`${decisionMeta.icon} text-[13px]`}></i>
                {t(decisionMeta.labelKey)}
              </span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              title={t("espace.moveUp")}
              aria-label={t("espace.moveUp")}
              disabled={candidature.rang === 1}
              onClick={() => deplacerCandidature(candidature.id, "up")}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-background-300 bg-background-50 text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <i className="ri-arrow-up-line"></i>
            </button>
            <button
              type="button"
              title={t("espace.moveDown")}
              aria-label={t("espace.moveDown")}
              disabled={candidature.rang === 3}
              onClick={() => deplacerCandidature(candidature.id, "down")}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-background-300 bg-background-50 text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <i className="ri-arrow-down-line"></i>
            </button>
            <button
              type="button"
              disabled={maxAtteint}
              onClick={() => avancerCandidature(candidature.id)}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-3 py-2 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <i className="ri-play-circle-line text-[15px]"></i>
              {t("espace.advance")}
            </button>
            <button
              type="button"
              onClick={() => retirerCandidature(candidature.id)}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-3 py-2 text-xs font-semibold text-foreground-600 transition-colors hover:border-secondary-300 hover:text-secondary-700"
            >
              <i className="ri-delete-bin-6-line text-[15px]"></i>
              {t("espace.remove")}
            </button>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-foreground-500">
              <i className="ri-refresh-line"></i>
              {t("espace.updatedOn")} {candidature.majLe}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-background-200 pt-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-foreground-700">
          <i className="ri-magic-line text-[14px] text-secondary-500"></i>
          {t("espace.simulerDecision")}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {DECISIONS.map((decision) => {
            const actif = candidature.decision === decision.key;
            return (
              <button
                key={decision.key}
                type="button"
                onClick={() => setDecision(candidature.id, decision.key)}
                aria-pressed={actif}
                className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  actif
                    ? decision.badge
                    : "border-background-300 bg-background-50 text-foreground-600 hover:border-primary-300 hover:text-primary-700"
                }`}
              >
                <i className={decision.icon}></i>
                {t(decision.labelKey)}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-3 inline-flex w-full cursor-pointer items-center justify-between gap-2 rounded-md bg-background-100 px-3 py-2.5 text-xs font-semibold text-foreground-800 transition-colors hover:bg-background-200"
        >
          <span className="inline-flex items-center gap-2">
            <i className="ri-flow-chart text-[15px] text-primary-600"></i>
            {open ? t("espace.chronologie.masquer") : t("espace.chronologie.afficher")}
          </span>
          <i className={`${open ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} text-base`}></i>
        </button>
        {open && (
          <div className="mt-4 animate-fade-in rounded-md border border-background-200 bg-background-100/60 p-4">
            <DecisionTimeline candidature={candidature} />
          </div>
        )}
      </div>
    </article>
  );
}
