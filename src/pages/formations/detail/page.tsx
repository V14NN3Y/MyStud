import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import StatusBadge from "@/components/base/StatusBadge";
import FormationCard from "@/components/base/FormationCard";
import useDemoSession, { MAX_CANDIDATURES } from "@/hooks/useDemoSession";
import { formations } from "@/mocks/formations";
import { etablissements } from "@/mocks/etablissements";
import { guideFormations, SOURCE_GUIDE } from "@/mocks/formationsGuide";
export default function FormationDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { identifie, estCandidate, candidatures, ajouterCandidature, comparaison, toggleComparaison } =
    useDemoSession();
  const [retour, setRetour] = useState<"ok" | "plein" | null>(null);
  const formation = formations.find((f) => f.id === id);
  if (!formation) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background-50">
        <PortalNavbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background-200">
            <i className="ri-file-unknow-line text-3xl text-foreground-600"></i>
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold text-foreground-950">
            Formation introuvable
          </h1>
          <p className="mt-3 max-w-md text-sm text-foreground-600">
            Cette fiche n'existe pas ou a été retirée du catalogue national.
          </p>
          <Link
            to="/formations"
            className="mt-6 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
          >
            <i className="ri-arrow-left-line text-base"></i>
            {t("common.backToList")}
          </Link>
        </main>
        <PortalFooter />
      </div>
    );
  }
  const etab = etablissements.find((e) => e.id === formation.etablissementId);
  const guide = guideFormations[formation.id as keyof typeof guideFormations];
  const related = formations.filter((f) => f.domaine === formation.domaine && f.id !== formation.id).slice(0, 3);
  const dejaCandidat = estCandidate(formation.id);
  const dansComparateur = comparaison.includes(formation.id);
  const dossierPlein = candidatures.length >= MAX_CANDIDATURES;
  const postuler = () => {
    if (!identifie) {
      navigate("/acces");
      return;
    }
    if (dejaCandidat) return;
    const ajoute = ajouterCandidature(formation.id);
    setRetour(ajoute ? "ok" : "plein");
  };
  const keyInfos = [
    { label: t("common.establishment"), value: formation.etablissement, icon: "ri-building-4-line" },
    { label: t("common.city"), value: formation.ville, icon: "ri-map-pin-2-line" },
    { label: t("common.level"), value: formation.niveau, icon: "ri-bar-chart-horizontal-line" },
    { label: t("common.duration"), value: formation.duree, icon: "ri-time-line" },
    { label: t("common.diploma"), value: formation.diplome, icon: "ri-award-line" },
    { label: t("common.capacity"), value: `${formation.capacite} places`, icon: "ri-group-line" },
    { label: t("common.fees"), value: formation.frais, icon: "ri-money-cny-circle-line" },
    { label: t("common.recognition"), value: formation.typeEtablissement, icon: "ri-verified-badge-line" },
  ];
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <section className="relative flex w-full items-end overflow-hidden pt-28 md:pt-36">
          <img
            src={formation.image}
            alt={`${formation.nom} — ${formation.etablissement}`}
            title={`${formation.nom} ${formation.ville} Bénin`}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25"></div>
          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 md:px-6 md:pb-14">
            <nav aria-label="Fil d'ariane" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-background-200">
              <Link to="/" className="cursor-pointer transition-colors hover:text-background-50">{t("brand.name")}</Link>
              <i className="ri-arrow-right-s-line"></i>
              <Link to="/formations" className="cursor-pointer transition-colors hover:text-background-50">{t("nav.formations")}</Link>
              <i className="ri-arrow-right-s-line"></i>
              <span className="text-background-50">{formation.nom}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-background-50 px-3 py-1 text-xs font-semibold text-primary-800">
                {formation.niveau}
              </span>
              <span className="rounded-full bg-background-50/15 px-3 py-1 text-xs font-medium text-background-50 backdrop-blur">
                {formation.domaine}
              </span>
              <StatusBadge statut={formation.statut} />
            </div>
            <h1 className="mt-4 max-w-3xl font-heading text-3xl font-bold leading-tight tracking-tight text-background-50 md:text-5xl">
              {formation.nom}
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-background-100">
              <span className="inline-flex items-center gap-2">
                <i className="ri-building-4-line"></i>
                {formation.etablissement}
              </span>
              <span className="inline-flex items-center gap-2">
                <i className="ri-map-pin-2-line"></i>
                {formation.ville}
              </span>
            </p>
          </div>
        </section>
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
            <div className="flex-1 space-y-10">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground-950">
                  {t("detail.presentation")}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-foreground-700 md:text-base">
                  {formation.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {formation.series.map((s) => (
                    <span key={s} className="rounded-md bg-secondary-100 px-3 py-1.5 text-xs font-medium text-secondary-800">
                      Accessible avec la série {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-background-200 bg-background-100 p-5 md:p-6">
                <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground-950">
                  <i className="ri-door-open-line text-xl text-primary-600"></i>
                  {t("detail.admission")}
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-foreground-700">
                  <li className="flex items-start gap-3">
                    <i className="ri-checkbox-circle-line mt-0.5 text-base text-primary-600"></i>
                    Être titulaire du baccalauréat des séries {formation.series.join(", ")}.
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="ri-checkbox-circle-line mt-0.5 text-base text-primary-600"></i>
                    Disposer d'un dossier d'identité vérifié dans MyStud.
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="ri-checkbox-circle-line mt-0.5 text-base text-primary-600"></i>
                    Respecter les critères et le calendrier de la campagne nationale.
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="ri-checkbox-circle-line mt-0.5 text-base text-primary-600"></i>
                    Capacité déclarée : <strong>{formation.capacite} places</strong> pour l'année académique.
                  </li>
                </ul>
              </div>
              {guide && (
                <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-5 md:p-6">
                  <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground-950">
                    <i className="ri-hand-coin-line text-xl text-secondary-700"></i>
                    {t("guide.title")}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-foreground-600">{t("guide.subtitle")}</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-background-50 px-3 py-1.5 text-xs font-semibold text-secondary-900">
                    <i className="ri-bookmark-3-line text-sm"></i>
                    {t("guide.regime")} : {guide.regime}
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-md border border-background-200 bg-background-50 px-4 py-3">
                      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-foreground-500">
                        <i className="ri-award-line text-[13px] text-primary-600"></i>
                        {t("guide.placesBourse")}
                      </p>
                      <p className="mt-1 font-heading text-xl font-bold text-foreground-950">
                        {guide.placesBourse > 0 ? guide.placesBourse : "—"}
                      </p>
                      <p className="text-[11px] text-foreground-500">
                        {guide.placesBourse > 0 ? t("guide.placesBourseHint") : t("guide.aucuneBourse")}
                      </p>
                    </div>
                    <div className="rounded-md border border-background-200 bg-background-50 px-4 py-3">
                      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-foreground-500">
                        <i className="ri-wallet-3-line text-[13px] text-secondary-600"></i>
                        {t("guide.placesFPP")}
                      </p>
                      <p className="mt-1 font-heading text-xl font-bold text-foreground-950">
                        {guide.placesFPP > 0 ? guide.placesFPP : "—"}
                      </p>
                      <p className="text-[11px] text-foreground-500">
                        {guide.placesFPP > 0 ? t("guide.placesFPPHint") : t("guide.aucuneFPP")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-md bg-background-50 p-3">
                    <p className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-foreground-500">
                      <i className="ri-file-list-3-line text-[13px]"></i>
                      {t("guide.seriesAdmises")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {guide.serieCode.split(",").map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-800"
                        >
                          Série {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-foreground-700">
                    <i className="ri-lightbulb-line mt-0.5 text-sm text-secondary-700"></i>
                    {guide.note}
                  </p>
                  <p className="mt-3 flex items-start gap-2 border-t border-secondary-200 pt-3 text-[11px] leading-relaxed text-foreground-500">
                    <i className="ri-shield-check-line mt-0.5"></i>
                    {t("guide.source")} {SOURCE_GUIDE}. {t("common.demo")}.
                  </p>
                </div>
              )}
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground-950">
                  {t("detail.outcomes")}
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {formation.debouches.map((d) => (
                    <div
                      key={d}
                      className="flex items-center gap-3 rounded-lg border border-background-200 bg-background-50 px-4 py-3"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-100">
                        <i className="ri-briefcase-4-line text-base text-accent-800"></i>
                      </span>
                      <span className="text-sm font-medium text-foreground-900">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-accent-200 bg-accent-50 p-5 md:p-6">
                <h2 className="flex items-center gap-2 font-heading text-base font-bold text-accent-900">
                  <i className="ri-lightbulb-line text-lg"></i>
                  {t("detail.tips")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground-700">
                  {t("detail.tipsText")}
                </p>
              </div>
            </div>
            <aside className="w-full lg:w-[340px]">
              <div className="lg:sticky lg:top-24 space-y-4">
                <div className="rounded-lg border border-background-200 bg-background-50 p-5">
                  <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground-950">
                    <i className="ri-information-line text-base text-primary-600"></i>
                    {t("detail.keyInfo")}
                  </h2>
                  <dl className="mt-4 space-y-3">
                    {keyInfos.map((info) => (
                      <div key={info.label} className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background-100">
                          <i className={`${info.icon} text-sm text-foreground-700`}></i>
                        </span>
                        <div className="min-w-0">
                          <dt className="text-[11px] uppercase tracking-wide text-foreground-500">{info.label}</dt>
                          <dd className="text-sm font-medium text-foreground-950">{info.value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="rounded-lg border border-primary-200 bg-primary-50 p-5">
                  <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-primary-900">
                    <i className="ri-calendar-event-line text-base"></i>
                    {t("detail.campaign")}
                  </h2>
                  <div className="mt-3 space-y-2 text-sm text-foreground-700">
                    <p className="flex items-center justify-between gap-3">
                      <span>Ouverture</span>
                      <span className="font-medium text-foreground-950">{formation.campagneOuverture}</span>
                    </p>
                    <p className="flex items-center justify-between gap-3">
                      <span>Clôture</span>
                      <span className="font-medium text-foreground-950">{formation.campagneFermeture}</span>
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800">
                    <i className="ri-door-open-line"></i>
                    {t("detail.open")}
                  </span>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={postuler}
                      disabled={dejaCandidat}
                      className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-5 py-3 text-sm font-semibold transition-colors ${
                        dejaCandidat
                          ? "cursor-default bg-primary-100 text-primary-800"
                          : "bg-primary-500 text-background-50 hover:bg-primary-600"
                      }`}
                    >
                      <i className={dejaCandidat ? "ri-checkbox-circle-fill text-base" : "ri-send-plane-line text-base"}></i>
                      {dejaCandidat ? t("espace.dansDossier") : t("espace.postuler")}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleComparaison(formation.id)}
                      aria-pressed={dansComparateur}
                      className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 py-3 text-sm font-semibold transition-colors sm:w-auto ${
                        dansComparateur
                          ? "border-primary-300 bg-primary-100 text-primary-800"
                          : "border-background-300 bg-background-50 text-foreground-800 hover:border-primary-300 hover:text-primary-700"
                      }`}
                    >
                      <i className={dansComparateur ? "ri-check-line text-base" : "ri-scales-3-line text-base"}></i>
                      {dansComparateur ? t("compare.added") : t("compare.add")}
                    </button>
                  </div>
                  {retour === "ok" && (
                    <div className="animate-scale-in mt-3 rounded-md border border-primary-200 bg-background-50 p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold text-primary-800">
                        <i className="ri-checkbox-circle-fill"></i>
                        {t("espace.dansDossier")} — {candidatures.length}/{MAX_CANDIDATURES}
                      </p>
                      <Link
                        to="/espace"
                        className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary-700 transition-colors hover:text-primary-800"
                      >
                        {t("espace.title")}
                        <i className="ri-arrow-right-line"></i>
                      </Link>
                    </div>
                  )}
                  {retour === "plein" && (
                    <p className="animate-scale-in mt-3 flex items-start gap-2 rounded-md border border-accent-200 bg-accent-50 p-3 text-xs text-accent-900">
                      <i className="ri-information-line mt-0.5"></i>
                      {t("espace.max3")}
                    </p>
                  )}
                  {!identifie && (
                    <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-foreground-600">
                      <i className="ri-lock-line mt-0.5"></i>
                      {t("espace.gate.desc")}
                    </p>
                  )}
                  <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-foreground-600">
                    <i className="ri-information-line mt-0.5"></i>
                    {t("common.updated")} {formation.majLe} · {t("common.demo")}
                  </p>
                </div>
                {etab && (
                  <div className="rounded-lg border border-background-200 bg-background-50 p-5">
                    <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground-950">
                      <i className="ri-bank-line text-base text-secondary-600"></i>
                      {t("detail.aboutEtab")}
                    </h2>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-secondary-100">
                        <span className="font-heading text-xs font-bold text-secondary-800">{etab.sigle}</span>
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground-950">{etab.nom}</p>
                        <p className="text-xs text-foreground-600">{etab.ville} · depuis {etab.fondation}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-foreground-600">
                      {etab.effectif.toLocaleString("fr-FR")} étudiants · {etab.formationsCount} formations référencées
                    </p>
                    <Link
                      to={`/etablissements/${etab.id}`}
                      className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary-700 transition-colors hover:text-primary-800"
                    >
                      {t("espace.voirEtab")}
                      <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
        {related.length > 0 && (
          <section className="w-full border-t border-background-200 bg-background-100 px-4 py-12 md:px-6 md:py-16">
            <div className="mx-auto w-full max-w-6xl">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-heading text-xl font-bold text-foreground-950 md:text-2xl">
                  {t("detail.related")}
                </h2>
                <Link
                  to={`/formations?domaine=${encodeURIComponent(formation.domaine)}`}
                  className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800"
                >
                  {t("common.seeAll")}
                  <i className="ri-arrow-right-line text-base"></i>
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((f, index) => (
                  <FormationCard key={f.id} formation={f} delay={index + 1} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <PortalFooter />
    </div>
  );
}
