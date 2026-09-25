import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import useDemoSession from "@/hooks/useDemoSession";
import { formations } from "@/mocks/formations";
import EspaceGate from "./components/EspaceGate";
import ProfilCard from "./components/ProfilCard";
import CandidatureCard from "./components/CandidatureCard";
import CandidaturePicker from "./components/CandidaturePicker";
import EspaceEtudiantCta from "./components/EspaceEtudiantCta";
export default function Espace() {
  const { t } = useTranslation();
  const { profil, identifie, candidatures, deconnecter } = useDemoSession();
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("nav.acces")}
          title={t("espace.title")}
          subtitle={t("espace.subtitle")}
          crumbs={[{ label: t("brand.name"), to: "/" }, { label: t("espace.title") }]}
        />
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto w-full max-w-6xl">
            {!identifie || !profil ? (
              <EspaceGate />
            ) : (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="w-full lg:col-span-1">
                  <div className="lg:sticky lg:top-24">
                    <ProfilCard profil={profil} onLogout={deconnecter} />
                  </div>
                </div>
                <div className="w-full space-y-6 lg:col-span-2">
                  <div>
                    <p className="text-sm font-semibold text-primary-700">
                      {t("espace.hello")} {profil.prenom}
                    </p>
                    <h2 className="mt-1 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
                      {t("espace.candidatures")}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-600">
                      {t("espace.candidaturesDesc")}
                    </p>
                  </div>
                  <EspaceEtudiantCta />
                  {candidatures.length > 0 ? (
                    <div className="space-y-4">
                      {candidatures.map((candidature) => {
                        const formation = formations.find((f) => f.id === candidature.formationId);
                        if (!formation) return null;
                        return (
                          <CandidatureCard
                            key={candidature.id}
                            candidature={candidature}
                            formation={formation}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center rounded-lg border border-dashed border-background-300 bg-background-100 px-6 py-12 text-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background-200">
                        <i className="ri-file-add-line text-2xl text-foreground-600"></i>
                      </span>
                      <h3 className="mt-4 font-heading text-base font-bold text-foreground-950">
                        {t("espace.empty.title")}
                      </h3>
                      <p className="mt-2 max-w-md text-sm text-foreground-600">
                        {t("espace.empty.desc")}
                      </p>
                    </div>
                  )}
                  <CandidaturePicker />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <PortalFooter />
    </div>
  );
}
