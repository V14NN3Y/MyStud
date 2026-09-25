import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SectionHeading from "@/components/base/SectionHeading";
import { domaines } from "@/mocks/referentiels";
export default function DomainsSection() {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-background-50 px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow={t("home.domains.eyebrow")}
          title={t("home.domains.title")}
          subtitle={t("home.domains.subtitle")}
        />
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
          {domaines.map((domaine, index) => (
            <Link
              key={domaine.id}
              to={`/formations?domaine=${encodeURIComponent(domaine.nom)}`}
              className={`group flex cursor-pointer flex-col rounded-lg border border-background-200 bg-background-50 p-5 transition-colors duration-300 hover:border-primary-300 hover:bg-primary-50/60 animate-fade-up ${
                index < 4 ? `delay-${index + 1}` : ""
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 transition-colors group-hover:bg-primary-200">
                <i className={`${domaine.icon} text-xl text-primary-700`}></i>
              </span>
              <h3 className="mt-4 text-sm font-semibold leading-snug text-foreground-950">
                {domaine.nom}
              </h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-foreground-600">
                {domaine.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-background-200 pt-3">
                <span className="text-xs font-medium text-secondary-700">
                  {domaine.count} formations
                </span>
                <i className="ri-arrow-right-up-line text-base text-foreground-400 transition-colors group-hover:text-primary-600"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
