import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function CtaSection() {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-background-50 px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-lg bg-primary-900 px-6 py-12 md:px-14 md:py-16">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-500/20"></div>
          <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-secondary-500/20"></div>
          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-background-50 md:text-3xl">
                {t("home.cta.title")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-background-200 md:text-base">
                {t("home.cta.desc")}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <Link
                to="/acces"
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-accent-500 px-6 py-3 text-sm font-semibold text-primary-950 transition-colors hover:bg-accent-400"
              >
                <i className="ri-user-add-line text-base"></i>
                {t("home.cta.button")}
              </Link>
              <Link
                to="/formations"
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-50/30 px-6 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-background-50/10"
              >
                <i className="ri-book-2-line text-base"></i>
                {t("home.cta.secondary")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
