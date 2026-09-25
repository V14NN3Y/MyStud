import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SectionHeading from "@/components/base/SectionHeading";
import { etablissements } from "@/mocks/etablissements";
export default function EstablishmentsStrip() {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-background-50 px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow={t("common.establishment")}
          title={t("home.etab.title")}
          subtitle={t("home.etab.subtitle")}
          action={
            <Link
              to="/etablissements"
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2.5 text-sm font-semibold text-foreground-900 transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              {t("common.seeAll")}
              <i className="ri-arrow-right-line text-base"></i>
            </Link>
          }
        />
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
          {etablissements.slice(0, 8).map((etab, index) => (
            <Link
              key={etab.id}
              to="/etablissements"
              className={`group flex cursor-pointer flex-col rounded-lg border border-background-200 bg-background-50 p-5 transition-colors hover:border-secondary-300 animate-fade-up ${
                index < 4 ? `delay-${index + 1}` : ""
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary-100">
                <span className="font-heading text-sm font-bold text-secondary-800">{etab.sigle}</span>
              </span>
              <h3 className="mt-4 text-sm font-semibold leading-snug text-foreground-950">
                {etab.nom}
              </h3>
              <p className="mt-2 flex-1 text-xs text-foreground-600">{etab.ville}</p>
              <div className="mt-4 flex items-center gap-3 border-t border-background-200 pt-3 text-xs text-foreground-600">
                <span className="inline-flex items-center gap-1.5">
                  <i className="ri-book-2-line text-secondary-500"></i>
                  {etab.formationsCount} formations
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
