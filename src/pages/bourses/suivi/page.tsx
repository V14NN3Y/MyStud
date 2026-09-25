import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import { candidaturesBourseSeed } from "@/mocks/candidaturesBourse";
import BourseCandidatureCard from "./components/BourseCandidatureCard";
import BourseWizard from "./components/BourseWizard";
export default function BourseSuivi() {
  const { t } = useTranslation();
  const [candidatures, setCandidatures] = useState(candidaturesBourseSeed);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [succes, setSucces] = useState(false);
  const handleSubmit = (candidature: (typeof candidaturesBourseSeed)[number]) => {
    setCandidatures((prev) => [candidature, ...prev] as typeof candidaturesBourseSeed);
    setWizardOpen(false);
    setSucces(true);
    window.setTimeout(() => setSucces(false), 4000);
  };
  const handleRemove = (id: string) => {
    setCandidatures((prev) => prev.filter((c) => c.id !== id));
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("bsuivi.eyebrow")}
          title={t("bsuivi.title")}
          subtitle={t("bsuivi.subtitle")}
          crumbs={[
            { label: t("brand.name"), to: "/" },
            { label: t("nav.bourses"), to: "/bourses" },
            { label: t("bsuivi.title") },
          ]}
        >
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setWizardOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
            >
              <i className="ri-add-line text-base"></i>
              {t("bsuivi.depot.start")}
            </button>
            <Link
              to="/bourses"
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-5 py-2.5 text-sm font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              <i className="ri-hand-coin-line text-base"></i>
              {t("bsuivi.voirProgrammes")}
            </Link>
          </div>
        </PageHero>
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto w-full max-w-5xl space-y-6">
            {succes && (
              <div className="flex items-start gap-3 rounded-lg border border-primary-200 bg-primary-50 p-4 animate-fade-in">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <i className="ri-checkbox-circle-line text-lg text-primary-700"></i>
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground-950">{t("bsuivi.depot.done")}</p>
                  <p className="mt-0.5 text-xs text-foreground-600">{t("bsuivi.depot.doneDesc")}</p>
                </div>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-background-200 bg-background-100 p-4">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-900">
                <i className="ri-file-list-3-line text-base text-secondary-500"></i>
                {candidatures.length} {t("bsuivi.compte")}
              </span>
              <span className="inline-flex items-center gap-2 text-xs text-foreground-600">
                <i className="ri-information-line text-secondary-500"></i>
                {t("bsuivi.notice")}
              </span>
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground-950">{t("bsuivi.suivi.title")}</h2>
              <p className="mt-1 text-sm text-foreground-600">{t("bsuivi.suivi.desc")}</p>
            </div>
            {candidatures.length > 0 ? (
              <div className="space-y-4">
                {candidatures.map((candidature) => (
                  <BourseCandidatureCard key={candidature.id} candidature={candidature} onRemove={handleRemove} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-lg border border-dashed border-background-300 bg-background-100 px-6 py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background-200">
                  <i className="ri-hand-coin-line text-2xl text-foreground-600"></i>
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-foreground-950">{t("bsuivi.empty.title")}</h3>
                <p className="mt-2 max-w-md text-sm text-foreground-600">{t("bsuivi.empty.desc")}</p>
                <button
                  type="button"
                  onClick={() => setWizardOpen(true)}
                  className="mt-5 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
                >
                  <i className="ri-add-line text-base"></i>
                  {t("bsuivi.depot.start")}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <BourseWizard open={wizardOpen} onClose={() => setWizardOpen(false)} onSubmit={handleSubmit} />
      <PortalFooter />
    </div>
  );
}
