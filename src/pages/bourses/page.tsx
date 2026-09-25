import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import StatusBadge from "@/components/base/StatusBadge";
import { bourses } from "@/mocks/bourses";
export default function Bourses() {
  const { t } = useTranslation();
  const [type, setType] = useState("");
  const types = useMemo(() => Array.from(new Set(bourses.map((b) => b.type))), []);
  const results = type ? bourses.filter((b) => b.type === type) : bourses;
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("nav.bourses")}
          title="Bourses et aides publiques"
          subtitle="Programmes nationaux, aides sociales, bourses d'excellence et aides liées au transport ou à la restauration. Chaque programme précise l'organisme responsable, ses critères et son calendrier."
          crumbs={[{ label: t("brand.name"), to: "/" }, { label: t("nav.bourses") }]}
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setType("")}
              className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                type === ""
                  ? "bg-primary-500 text-background-50"
                  : "bg-background-50 text-foreground-700 hover:bg-background-200"
              }`}
            >
              {t("common.all")} ({bourses.length})
            </button>
            {types.map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => setType(tp)}
                className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  type === tp
                    ? "bg-primary-500 text-background-50"
                    : "bg-background-50 text-foreground-700 hover:bg-background-200"
                }`}
              >
                {tp}
              </button>
            ))}
          </div>
        </PageHero>
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 lg:grid-cols-2">
            {results.map((bourse, index) => (
              <article
                key={bourse.id}
                className={`flex flex-col rounded-lg border border-background-200 bg-background-50 p-5 md:p-6 animate-fade-up ${
                  index < 2 ? `delay-${index + 1}` : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-accent-100">
                      <i className="ri-hand-coin-line text-xl text-accent-800"></i>
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-foreground-500">{bourse.type}</p>
                      <h2 className="text-base font-semibold leading-snug text-foreground-950">{bourse.nom}</h2>
                    </div>
                  </div>
                  <StatusBadge statut={bourse.statut} />
                </div>
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-foreground-700">
                  <i className="ri-bank-line text-secondary-600"></i>
                  {bourse.organisme}
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-md bg-background-100 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-foreground-500">Montant / nature</p>
                    <p className="mt-1 text-sm font-semibold text-foreground-950">{bourse.montant}</p>
                  </div>
                  <div className="rounded-md bg-background-100 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-foreground-500">Période</p>
                    <p className="mt-1 text-sm font-semibold text-foreground-950">{bourse.periode}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-[11px] uppercase tracking-wide text-foreground-500">Public visé</p>
                  <p className="mt-1 text-sm text-foreground-700">{bourse.public}</p>
                </div>
                <div className="mt-4">
                  <p className="text-[11px] uppercase tracking-wide text-foreground-500">Critères d'éligibilité</p>
                  <ul className="mt-2 space-y-2">
                    {bourse.criteres.map((critere) => (
                      <li key={critere} className="flex items-start gap-2 text-sm text-foreground-700">
                        <i className="ri-checkbox-circle-line mt-0.5 text-base text-primary-600"></i>
                        {critere}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-background-200 pt-4">
                  <span className="text-[11px] text-foreground-500">
                    {t("common.updated")} {bourse.majLe}
                  </span>
                  <Link
                    to="/bourses/suivi"
                    className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2 text-xs font-semibold text-background-50 transition-colors hover:bg-primary-600"
                  >
                    <i className="ri-send-plane-line text-sm"></i>
                    Candidater
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-8 flex w-full max-w-6xl items-start gap-2 rounded-lg border border-accent-200 bg-accent-50 p-4 text-xs leading-relaxed text-foreground-700">
            <i className="ri-information-line mt-0.5 text-base text-accent-700"></i>
            MyStud ne décide pas automatiquement de l'attribution d'une aide. La décision appartient au ministère ou à l'organisme responsable du programme.
          </p>
        </section>
      </main>
      <PortalFooter />
    </div>
  );
}
