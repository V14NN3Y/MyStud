import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import { annonces } from "@/mocks/annonces";
const CALENDRIER = [
  { date: "18 septembre 2026", label: "Ouverture de la campagne nationale de candidatures", tag: "Campagne" },
  { date: "20 novembre 2026", label: "Clôture des candidatures — Médecine et Statistique", tag: "Échéance" },
  { date: "30 novembre 2026", label: "Clôture générale des candidatures publiques", tag: "Échéance" },
  { date: "15 décembre 2026", label: "Début de l'instruction des dossiers par les universités", tag: "Instruction" },
  { date: "Janvier 2027", label: "Publication des premières décisions d'admission", tag: "Décision" },
];
export default function Annonces() {
  const { t } = useTranslation();
  const [main, ...rest] = annonces;
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("nav.annonces")}
          title="Annonces officielles et calendrier"
          subtitle="Campagnes, calendriers, rentrées universitaires et programmes de bourses : retrouvez les informations publiées par le ministère et les établissements."
          crumbs={[{ label: t("brand.name"), to: "/" }, { label: t("nav.annonces") }]}
        />
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <article className="overflow-hidden rounded-lg border border-background-200 bg-background-50">
                <div className="h-60 w-full overflow-hidden md:h-80">
                  <img
                    src={main.image}
                    alt={main.titre}
                    title={`${main.titre} — MyStud Bénin`}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold text-primary-800">
                      {main.categorie}
                    </span>
                    <span className="text-xs text-foreground-600">{main.date}</span>
                  </div>
                  <h2 className="mt-3 font-heading text-xl font-bold leading-snug text-foreground-950 md:text-2xl">
                    {main.titre}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-foreground-700">{main.extrait}</p>
                </div>
              </article>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {rest.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col overflow-hidden rounded-lg border border-background-200 bg-background-50"
                  >
                    <div className="h-40 w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.titre}
                        title={`${item.titre} — MyStud Bénin`}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-secondary-100 px-2.5 py-0.5 text-[11px] font-semibold text-secondary-800">
                          {item.categorie}
                        </span>
                        <span className="text-xs text-foreground-600">{item.date}</span>
                      </div>
                      <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground-950">
                        {item.titre}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-foreground-600">{item.extrait}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <aside>
              <div className="rounded-lg border border-background-200 bg-background-100 p-5 lg:sticky lg:top-24">
                <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground-950">
                  <i className="ri-calendar-check-line text-base text-primary-600"></i>
                  Calendrier des campagnes
                </h2>
                <ol className="mt-5 space-y-5">
                  {CALENDRIER.map((etape, index) => (
                    <li key={etape.label} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                            index === 0
                              ? "bg-accent-500 text-primary-950"
                              : "bg-primary-100 text-primary-800"
                          }`}
                        >
                          {index + 1}
                        </span>
                        {index < CALENDRIER.length - 1 && (
                          <span className="mt-1 h-full w-px flex-1 bg-background-300"></span>
                        )}
                      </div>
                      <div className="pb-1">
                        <p className="text-xs font-semibold text-secondary-700">{etape.date}</p>
                        <p className="mt-1 text-sm leading-snug text-foreground-900">{etape.label}</p>
                        <span className="mt-2 inline-flex rounded-full bg-background-200 px-2.5 py-0.5 text-[11px] font-medium text-foreground-700">
                          {etape.tag}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 flex items-start gap-2 border-t border-background-300 pt-4 text-[11px] leading-relaxed text-foreground-600">
                  <i className="ri-information-line mt-0.5"></i>
                  Calendrier prévisionnel — {t("common.demo")}.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <PortalFooter />
    </div>
  );
}
