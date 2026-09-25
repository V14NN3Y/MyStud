import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import HeroSection from "./components/HeroSection";
import StatsStrip from "./components/StatsStrip";
import DomainsSection from "./components/DomainsSection";
import FeaturedFormations from "./components/FeaturedFormations";
import StepsSection from "./components/StepsSection";
import EstablishmentsStrip from "./components/EstablishmentsStrip";
import BoursesHighlight from "./components/BoursesHighlight";
import NewsSection from "./components/NewsSection";
import TrustSection from "./components/TrustSection";
import CtaSection from "./components/CtaSection";
export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <HeroSection />
        <StatsStrip />
        <DomainsSection />
        <FeaturedFormations />
        <StepsSection />
        <EstablishmentsStrip />
        <BoursesHighlight />
        <NewsSection />
        <TrustSection />
        <CtaSection />
      </main>
      <PortalFooter />
    </div>
  );
}
