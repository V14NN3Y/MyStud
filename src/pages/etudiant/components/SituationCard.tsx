import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CountUp from "@/components/base/CountUp";
import type { ProfilDemo } from "@/hooks/useDemoSession";
import { situationEtudiante, unitesEnseignement } from "@/mocks/etudiant";
interface SituationCardProps {
  profil: ProfilDemo | null;
}
export default function SituationCard({ profil }: SituationCardProps) {
  const { t } = useTranslation();
  const creditsSemestre = unitesEnseignement
    .filter((ue) => ue.statut === "Validée")
    .reduce((sum, ue) => sum + ue.credits, 0);
  const creditsSemestreTotal = unitesEnseignement.reduce((sum, ue) => sum + ue.credits, 0);
  const pourcentageCursus = Math.round((situationEtudiante.creditsAcquis / situationEtudiante.creditsTotal) * 100);
  const pourcentageSemestre = Math.round((creditsSemestre / creditsSemestreTotal) * 100);
  const initiales = profil
    ? `${profil.prenom.charAt(0)}${profil.nom.charAt(0)}`.toUpperCase()
    : "MS";
  const infos = [
    { label: t("etudiant.situation.etablissement"), value: situationEtudiante.etablissement, icon: "ri-building-4-line" },
    { label: t("etudiant.situation.faculte"), value: situationEtudiante.faculte, icon: "ri-community-line" },
    { label: t("etudiant.situation.niveau"), value: situationEtudiante.niveau, icon: "ri-stack-line" },
    { label: t("etudiant.situation.semestre"), value: situationEtudiante.semestre, icon: "ri-calendar-check-line" },
    { label: t("etudiant.situation.groupe"), value: situationEtudiante.groupe, icon: "ri-group-line" },
    { label: t("etudiant.situation.annee"), value: situationEtudiante.anneeAcademique, icon: "ri-calendar-2-line" },
  ];
  return (
    <article className="rounded-lg border border-background-200 bg-background-50 p-5 animate-fade-up md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-500">
            <span className="font-heading text-xl font-bold text-background-50">{initiales}</span>
          </span>
          <div className="min-w-0">
            <p className="text-xs text-foreground-600">
              {t("etudiant.hello")}
              {profil ? ` ${profil.prenom} ${profil.nom}` : ""}
            </p>
            <h2 className="mt-0.5 font-heading text-lg font-bold leading-snug text-foreground-950 md:text-xl">
              {situationEtudiante.formation}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-100 px-2.5 py-1 text-[11px] font-semibold text-primary-800">
                <i className="ri-verified-badge-line text-[13px]"></i>
                {situationEtudiante.statutAdministratif}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-background-300 bg-background-100 px-2.5 py-1 text-[11px] font-medium text-foreground-700">
                <i className="ri-map-pin-2-line text-[13px] text-secondary-500"></i>
                {situationEtudiante.ville}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/formations/${situationEtudiante.formationId}`}
            className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-3.5 py-2 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
          >
            <i className="ri-book-2-line text-sm"></i>
            {t("etudiant.situation.voirFormation")}
          </Link>
          <Link
            to={`/etablissements/${situationEtudiante.etablissementId}`}
            className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-3.5 py-2 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
          >
            <i className="ri-building-4-line text-sm"></i>
            {t("etudiant.situation.voirEtab")}
          </Link>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-background-200 pt-5 sm:grid-cols-2">
        {infos.map((info) => (
          <div key={info.label} className="flex items-start justify-between gap-3">
            <dt className="inline-flex items-center gap-2 text-xs text-foreground-600">
              <i className={`${info.icon} text-[13px] text-secondary-500`}></i>
              {info.label}
            </dt>
            <dd className="text-right text-xs font-semibold text-foreground-950">{info.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-background-200 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md bg-background-100 p-4">
          <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-foreground-500">
            <i className="ri-medal-line text-secondary-500"></i>
            {t("etudiant.situation.credits")}
          </p>
          <p className="mt-1.5 font-heading text-xl font-bold text-foreground-950">
            <CountUp value={situationEtudiante.creditsAcquis} />
            <span className="ml-1 text-xs font-medium text-foreground-500">
              / {situationEtudiante.creditsTotal}
            </span>
          </p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-background-300">
            <div className="h-full rounded-full bg-primary-500" style={{ width: `${pourcentageCursus}%` }}></div>
          </div>
          <p className="mt-1.5 text-[11px] text-foreground-500">{t("etudiant.situation.progression")} · {pourcentageCursus}%</p>
        </div>
        <div className="rounded-md bg-background-100 p-4">
          <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-foreground-500">
            <i className="ri-line-chart-line text-secondary-500"></i>
            {t("etudiant.situation.moyenne")}
          </p>
          <p className="mt-1.5 font-heading text-xl font-bold text-foreground-950">
            <CountUp value={situationEtudiante.moyenneGenerale} decimals={2} />
            <span className="ml-1 text-xs font-medium text-foreground-500">/ 20</span>
          </p>
          <p className="mt-2.5 text-[11px] text-foreground-500">{situationEtudiante.semestre}</p>
        </div>
        <div className="rounded-md bg-background-100 p-4">
          <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-foreground-500">
            <i className="ri-trophy-line text-secondary-500"></i>
            {t("etudiant.situation.rang")}
          </p>
          <p className="mt-1.5 font-heading text-xl font-bold text-foreground-950">{situationEtudiante.rang}</p>
          <p className="mt-2.5 text-[11px] text-foreground-500">{situationEtudiante.groupe}</p>
        </div>
        <div className="rounded-md border border-accent-200 bg-accent-50 p-4">
          <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-accent-800">
            <i className="ri-alarm-warning-line"></i>
            {t("etudiant.situation.prochaine")}
          </p>
          <p className="mt-1.5 font-heading text-base font-bold text-foreground-950">{situationEtudiante.prochaineEcheance}</p>
          <p className="mt-1 text-[11px] leading-snug text-foreground-700">{situationEtudiante.prochaineEcheanceLibelle}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-md bg-background-100 px-4 py-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-foreground-700">
          <i className="ri-checkbox-circle-line text-base text-primary-600"></i>
          {t("etudiant.notes.semestreCredits")}
        </span>
        <span className="text-xs text-foreground-600">
          {creditsSemestre} / {creditsSemestreTotal} · {pourcentageSemestre}%
        </span>
      </div>
    </article>
  );
}
