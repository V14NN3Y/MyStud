import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import CompareTable from "./components/CompareTable";
import ComparePicker from "./components/ComparePicker";
import useDemoSession from "@/hooks/useDemoSession";
import { formations } from "@/mocks/formations";
export default function CompareFormations() {
  const { t } = useTranslation();
  const { comparaison, retirerComparaison, viderComparaison } = useDemoSession();
  const selection = formations.filter((f) => comparaison.includes(f.id));
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1 pb-28">
        <PageHero
          eyebrow={t("common.compare")}
          title={t("compare.title")}
          subtitle={t("compare.subtitle")}
          crumbs={[
            { label: t("brand.name"), to: "/" },
            { label: t("nav.formations"), to: "/formations" },
            { label: t("compare.title") },
          ]}
        />
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto w-full max-w-6xl space-y-8 print-area">
            {selection.length >= 2 ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 no-print">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-accent-100 px-3 py-1.5 text-xs font-semibold text-accent-900">
                      <i className="ri-focus-3-line"></i>
                      {t("compare.diff")}
                    </span>
                    <span className="text-sm text-foreground-600">
                      {selection.length} {t("compare.selected")}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2.5 text-xs font-semibold text-background-50 transition-colors hover:bg-primary-600"
                    >
                      <i className="ri-printer-line"></i>
                      {t("compare.print")}
                    </button>
                    <button
                      type="button"
                      onClick={viderComparaison}
                      className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2.5 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
                    >
                      <i className="ri-delete-bin-6-line"></i>
                      {t("compare.clear")}
                    </button>
                  </div>
                </div>
                <div className="hidden print:block">
                  <h1 className="font-heading text-xl font-bold text-foreground-950">
                    {t("compare.printHeader")}
                  </h1>
                  <p className="mt-1 text-xs text-foreground-600">
                    {t("brand.name")} · {t("compare.printedOn")}{" "}
                    {new Date().toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-1 text-xs text-foreground-600">
                    {selection.map((f) => f.nom).join(" · ")}
                  </p>
                </div>
                <CompareTable formations={selection} onRemove={retirerComparaison} />
              </>
            ) : (
              <div className="flex flex-col items-center rounded-lg border border-dashed border-background-300 bg-background-100 px-6 py-14 text-center no-print">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background-200">
                  <i className="ri-scales-3-line text-2xl text-foreground-600"></i>
                </span>
                <h2 className="mt-4 font-heading text-lg font-bold text-foreground-950">
                  {t("compare.empty.title")}
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground-600">
                  {t("compare.empty.desc")}
                </p>
                <Link
                  to="/formations"
                  className="mt-5 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
                >
                  <i className="ri-book-2-line text-base"></i>
                  {t("nav.formations")}
                </Link>
              </div>
            )}
            <div className="no-print">
              <ComparePicker />
            </div>
          </div>
        </section>
      </main>
      <PortalFooter />
    </div>
  );
}
