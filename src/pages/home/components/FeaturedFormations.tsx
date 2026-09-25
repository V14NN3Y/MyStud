import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FormationCard from "@/components/base/FormationCard";
import SectionHeading from "@/components/base/SectionHeading";
import { formations } from "@/mocks/formations";
export default function FeaturedFormations() {
  const { t } = useTranslation();
  const featured = formations.slice(0, 6);
  return (
    <section className="w-full bg-background-100 px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow={t("home.featured.eyebrow")}
          title={t("home.featured.title")}
          subtitle={t("home.featured.subtitle")}
          action={
            <Link
              to="/formations"
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2.5 text-sm font-semibold text-foreground-900 transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              {t("common.seeAll")}
              <i className="ri-arrow-right-line text-base"></i>
            </Link>
          }
        />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((formation, index) => (
            <FormationCard key={formation.id} formation={formation} delay={(index % 3) + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
