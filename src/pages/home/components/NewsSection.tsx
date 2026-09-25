import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SectionHeading from "@/components/base/SectionHeading";
import { annonces } from "@/mocks/annonces";
export default function NewsSection() {
  const { t } = useTranslation();
  const [main, ...rest] = annonces;
  return (
    <section className="w-full bg-background-50 px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow={t("home.news.eyebrow")}
          title={t("home.news.title")}
          action={
            <Link
              to="/annonces"
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2.5 text-sm font-semibold text-foreground-900 transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              {t("common.seeAll")}
              <i className="ri-arrow-right-line text-base"></i>
            </Link>
          }
        />
        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Link
            to="/annonces"
            className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-background-200 bg-background-50 transition-colors hover:border-primary-300 animate-fade-up"
          >
            <div className="h-56 w-full overflow-hidden md:h-72">
              <img
                src={main.image}
                alt={main.titre}
                title={`${main.titre} — MyStud Bénin`}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold text-primary-800">
                  {main.categorie}
                </span>
                <span className="text-xs text-foreground-600">{main.date}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground-950">
                {main.titre}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-600">{main.extrait}</p>
            </div>
          </Link>
          <div className="flex flex-col gap-4">
            {rest.map((item, index) => (
              <Link
                key={item.id}
                to="/annonces"
                className={`group flex cursor-pointer gap-4 rounded-lg border border-background-200 bg-background-50 p-4 transition-colors hover:border-primary-300 animate-fade-up delay-${index + 1}`}
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md md:h-28 md:w-28">
                  <img
                    src={item.image}
                    alt={item.titre}
                    title={`${item.titre} — MyStud Bénin`}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-secondary-100 px-2.5 py-0.5 text-[11px] font-semibold text-secondary-800">
                      {item.categorie}
                    </span>
                    <span className="text-xs text-foreground-600">{item.date}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground-950">
                    {item.titre}
                  </h3>
                  <p className="mt-1.5 hidden text-xs leading-relaxed text-foreground-600 sm:block">
                    {item.extrait}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
