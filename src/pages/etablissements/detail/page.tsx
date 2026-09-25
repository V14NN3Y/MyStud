import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import StatusBadge from "@/components/base/StatusBadge";
import FormationCard from "@/components/base/FormationCard";
import FacultesGrid from "./components/FacultesGrid";
import EtabInfoCard from "./components/EtabInfoCard";
import { etablissements } from "@/mocks/etablissements";
import { facultes } from "@/mocks/facultes";
import { formations } from "@/mocks/formations";
export default function EtablissementDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const etablissement = etablissements.find((e) => e.id === id);
  if (!etablissement) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background-50">
        <PortalNavbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background-200">
            <i className="ri-building-4-line text-3xl text-foreground-600"></i>
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold text-foreground-950">
            Établissement introuvable
          </h1>
          <p className="mt-3 max-w-md text-sm text-foreground-600">
            Cet établissement n'existe pas ou n'est plus référencé dans l'annuaire.
          </p>
          <Link
            to="/etablissements"
            className="mt-6 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
          >
            <i className="ri-arrow-left-line text-base"></i>
            {t("nav.etablissements")}
          </Link>
        </main>
        <PortalFooter />
      </div>
    );
  }
  const composantes = facultes.filter((f) => f.etablissementId === etablissement.id);
  const formationsEtab = formations.filter((f) => f.etablissementId === etablissement.id);
  const chiffres = [
    { label: t("etab.etudiants"), value: etablissement.effectif.toLocaleString("fr-FR"), icon: "ri-group-line" },
    { label: t("etab.formationsCount"), value: `${etablissement.formationsCount}`, icon: "ri-book-2-line" },
    { label: t("etab.composantes"), value: `${composantes.length}`, icon: "ri-building-2-line" },
    { label: t("etab.fondation"), value: `${etablissement.fondation}`, icon: "ri-calendar-line" },
  ];
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <section className="relative flex w-full items-end overflow-hidden pt-28 md:pt-36">
          <img
            src={etablissement.image}
            alt={`Campus de ${etablissement.nom}`}
            title={`${etablissement.nom} ${etablissement.ville} Bénin`}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/25"></div>
          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 md:px-6 md:pb-14">
            <nav aria-label="Fil d'ariane" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-background-200">
              <Link to="/" className="cursor-pointer transition-colors hover:text-background-50">{t("brand.name")}</Link>
              <i className="ri-arrow-right-s-line"></i>
              <Link to="/etablissements" className="cursor-pointer transition-colors hover:text-background-50">{t("nav.etablissements")}</Link>
              <i className="ri-arrow-right-s-line"></i>
              <span className="text-background-50">{etablissement.sigle}</span>
            </nav>
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-background-50/95 md:h-20 md:w-20">
                <span className="font-heading text-base font-bold text-primary-800 md:text-lg">
                  {etablissement.sigle}
                </span>
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-background-50/15 px-3 py-1 text-xs font-medium text-background-50 backdrop-blur">
                    {etablissement.type}
                  </span>
                  <span className="rounded-full bg-background-50/15 px-3 py-1 text-xs font-medium text-background-50 backdrop-blur">
                    {etablissement.domaine}
                  </span>
                  <StatusBadge statut={etablissement.statut} />
                </div>
                <h1 className="mt-3 font-heading text-2xl font-bold leading-tight tracking-tight text-background-50 md:text-4xl">
                  {etablissement.nom}
                </h1>
                <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-background-100">
                  <span className="inline-flex items-center gap-2">
                    <i className="ri-map-pin-2-line"></i>
                    {etablissement.ville}, Bénin
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <i className="ri-calendar-line"></i>
                    depuis {etablissement.fondation}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full border-b border-background-200 bg-background-100 px-4 py-8 md:px-6 md:py-10">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4">
            {chiffres.map((chiffre, index) => (
              <div
                key={chiffre.label}
                className={`reveal rounded-lg border border-background-200 bg-background-50 p-4 md:p-5 ${index < 4 ? `delay-${index + 1}` : ""}`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-100">
                  <i className={`${chiffre.icon} text-base text-primary-700`}></i>
                </span>
                <p className="mt-3 font-heading text-lg font-bold text-foreground-950 md:text-2xl">
                  {chiffre.value}
                </p>
                <p className="mt-1 text-xs leading-snug text-foreground-600">{chiffre.label}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="reveal">
                <h2 className="font-heading text-xl font-bold text-foreground-950 md:text-2xl">
                  {t("etab.presentation")}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-foreground-700 md:text-base">
                  {etablissement.description}
                </p>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-background-200 bg-background-100 p-4">
                    <p className="text-[11px] uppercase tracking-wide text-foreground-500">
                      {t("common.establishment")}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground-950">{etablissement.sigle}</p>
                  </div>
                  <div className="rounded-lg border border-background-200 bg-background-100 p-4">
                    <p className="text-[11px] uppercase tracking-wide text-foreground-500">
                      {t("common.domain")}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground-950">{etablissement.domaine}</p>
                  </div>
                </div>
              </div>
              <div className="reveal rounded-lg border border-accent-200 bg-accent-50 p-5 md:p-6">
                <h2 className="flex items-center gap-2 font-heading text-base font-bold text-accent-900">
                  <i className="ri-lightbulb-line text-lg"></i>
                  {t("detail.tips")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground-700">
                  {t("detail.tipsText")}
                </p>
              </div>
            </div>
            <aside className="w-full lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <EtabInfoCard etablissement={etablissement} />
              </div>
            </aside>
          </div>
        </section>
        <section className="w-full border-y border-background-200 bg-background-100 px-4 py-12 md:px-6 md:py-16">
          <div className="mx-auto w-full max-w-6xl">
            <FacultesGrid facultes={composantes} />
          </div>
        </section>
        <section id="formations-rattachees" className="w-full scroll-mt-24 px-4 py-12 md:px-6 md:py-16">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground-950 md:text-2xl">
                  {t("etab.formations")}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-foreground-600">{t("etab.formationsDesc")}</p>
              </div>
              <Link
                to={`/formations?etablissement=${etablissement.id}`}
                className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800"
              >
                {t("etab.allFormations")}
                <i className="ri-arrow-right-line text-base"></i>
              </Link>
            </div>
            {formationsEtab.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {formationsEtab.map((formation, index) => (
                  <FormationCard key={formation.id} formation={formation} delay={(index % 3) + 1} />
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-lg border border-dashed border-background-300 bg-background-100 px-5 py-10 text-center text-sm text-foreground-600">
                {t("etab.aucuneFormation")}
              </p>
            )}
          </div>
        </section>
        <section className="w-full bg-background-100 px-4 py-12 md:px-6 md:py-14">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 rounded-lg border border-background-200 bg-background-50 p-6 md:flex-row md:items-center md:p-8">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground-950 md:text-xl">
                {t("home.cta.title")}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-foreground-600">{t("home.cta.desc")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/acces"
                className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
              >
                <i className="ri-user-line text-base"></i>
                {t("home.cta.button")}
              </Link>
              <Link
                to="/formations"
                className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-5 py-3 text-sm font-semibold text-foreground-800 transition-colors hover:border-primary-300 hover:text-primary-700"
              >
                <i className="ri-book-2-line text-base"></i>
                {t("home.cta.secondary")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PortalFooter />
    </div>
  );
}
