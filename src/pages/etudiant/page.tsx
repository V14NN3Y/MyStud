import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import useDemoSession from "@/hooks/useDemoSession";
import EtudiantGate from "./components/EtudiantGate";
import SituationCard from "./components/SituationCard";
import ActionsEcheances from "./components/ActionsEcheances";
import EtudiantTabs from "./components/EtudiantTabs";
export default function Etudiant() {
  const { t } = useTranslation();
  const { profil, identifie } = useDemoSession();
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("espace.etudiant.title")}
          title={t("etudiant.title")}
          subtitle={t("etudiant.subtitle")}
          crumbs={[
            { label: t("brand.name"), to: "/" },
            { label: t("espace.title"), to: "/espace" },
            { label: t("etudiant.title") },
          ]}
        />
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto w-full max-w-6xl">
            {!identifie ? (
              <EtudiantGate />
            ) : (
              <div className="space-y-6">
                <SituationCard profil={profil} />
                <ActionsEcheances />
                <EtudiantTabs />
              </div>
            )}
          </div>
        </section>
      </main>
      <PortalFooter />
    </div>
  );
}
