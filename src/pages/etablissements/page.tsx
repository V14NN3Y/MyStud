import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import StatusBadge from "@/components/base/StatusBadge";
import { etablissements } from "@/mocks/etablissements";
import { facultes } from "@/mocks/facultes";
export default function Etablissements() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("nav.etablissements")}
          title="Annuaire des établissements d'enseignement supérieur"
          subtitle="Universités, écoles et instituts du périmètre pilote. Chaque fiche détaille les facultés qui composent l'établissement et les formations rattachées."
          crumbs={[{ label: t("brand.name"), to: "/" }, { label: t("nav.etablissements") }]}
        />
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {etablissements.map((etab, index) => {
              const composantes = facultes.filter((f) => f.etablissementId === etab.id).length;
              return (
                <Link
                  key={etab.id}
                  to={`/etablissements/${etab.id}`}
                  className={`hover-lift group flex flex-col overflow-hidden rounded-lg border border-background-200 bg-background-50 hover:border-primary-300 animate-fade-up ${
                    index < 3 ? `delay-${index + 1}` : ""
                  }`}
                >
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={etab.image}
                      alt={`Campus de ${etab.nom}`}
                      title={`${etab.nom} ${etab.ville} Bénin`}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-secondary-100">
                        <span className="font-heading text-xs font-bold text-secondary-800">{etab.sigle}</span>
                      </span>
                      <StatusBadge statut={etab.statut} />
                    </div>
                    <h2 className="mt-4 text-base font-semibold leading-snug text-foreground-950 transition-colors group-hover:text-primary-700">
                      {etab.nom}
                    </h2>
                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-600">
                      <span className="inline-flex items-center gap-1.5">
                        <i className="ri-map-pin-2-line text-secondary-500"></i>
                        {etab.ville}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <i className="ri-calendar-line text-secondary-500"></i>
                        depuis {etab.fondation}
                      </span>
                    </p>
                    <p className="mt-3 flex-1 text-xs leading-relaxed text-foreground-600">
                      {etab.description.length > 140 ? `${etab.description.slice(0, 140)}…` : etab.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-background-200 pt-3 text-xs">
                      <span className="inline-flex items-center gap-1.5 text-foreground-700">
                        <i className="ri-book-2-line text-primary-600"></i>
                        {etab.formationsCount} formations
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-foreground-600">
                        <i className="ri-building-2-line text-secondary-500"></i>
                        {composantes} composantes
                      </span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700">
                      {t("common.learnMore")}
                      <i className="ri-arrow-right-line transition-transform group-hover:translate-x-0.5"></i>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mx-auto mt-10 w-full max-w-6xl rounded-lg border border-background-200 bg-background-100 p-6 text-center">
            <p className="text-sm text-foreground-700">
              Les établissements privés reconnus par l'État seront progressivement intégrés après validation du modèle de gouvernance.
            </p>
            <Link
              to="/formations"
              className="mt-4 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
            >
              <i className="ri-book-2-line text-base"></i>
              Explorer le catalogue des formations
            </Link>
          </div>
        </section>
      </main>
      <PortalFooter />
    </div>
  );
}
