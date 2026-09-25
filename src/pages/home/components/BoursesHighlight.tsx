import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SectionHeading from "@/components/base/SectionHeading";
import StatusBadge from "@/components/base/StatusBadge";
import { bourses } from "@/mocks/bourses";
export default function BoursesHighlight() {
  const { t } = useTranslation();
  const highlight = bourses.slice(0, 3);
  return (
    <section className="w-full bg-accent-50 px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow={t("nav.bourses")}
          title={t("home.bourses.title")}
          subtitle={t("home.bourses.subtitle")}
          action={
            <Link
              to="/bourses"
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-accent-300 bg-background-50 px-4 py-2.5 text-sm font-semibold text-accent-900 transition-colors hover:bg-accent-100"
            >
              {t("common.seeAll")}
              <i className="ri-arrow-right-line text-base"></i>
            </Link>
          }
        />
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {highlight.map((bourse, index) => (
            <Link
              key={bourse.id}
              to="/bourses"
              className={`group flex cursor-pointer flex-col rounded-lg border border-accent-200 bg-background-50 p-5 transition-colors hover:border-accent-400 animate-fade-up delay-${index + 1}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent-100">
                  <i className="ri-hand-coin-line text-xl text-accent-800"></i>
                </span>
                <StatusBadge statut={bourse.statut} />
              </div>
              <h3 className="mt-4 text-base font-semibold leading-snug text-foreground-950">
                {bourse.nom}
              </h3>
              <p className="mt-2 text-xs text-foreground-600">{bourse.organisme}</p>
              <div className="mt-4 space-y-2 border-t border-background-200 pt-4 text-xs">
                <p className="flex items-center gap-2 text-foreground-700">
                  <i className="ri-money-cny-circle-line text-secondary-500"></i>
                  {bourse.montant}
                </p>
                <p className="flex items-center gap-2 text-foreground-700">
                  <i className="ri-calendar-line text-secondary-500"></i>
                  {bourse.periode}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
