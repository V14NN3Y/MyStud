import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useDemoSession, { MAX_CANDIDATURES } from "@/hooks/useDemoSession";
import { formations } from "@/mocks/formations";
export default function CandidaturePicker() {
  const { t } = useTranslation();
  const { candidatures, ajouterCandidature, estCandidate } = useDemoSession();
  const [keyword, setKeyword] = useState("");
  const disponibles = useMemo(() => {
    const terme = keyword.trim().toLowerCase();
    return formations
      .filter((f) => !estCandidate(f.id))
      .filter((f) =>
        terme ? `${f.nom} ${f.etablissement} ${f.ville} ${f.domaine}`.toLowerCase().includes(terme) : true
      )
      .slice(0, 6);
  }, [estCandidate, keyword]);
  const complet = candidatures.length >= MAX_CANDIDATURES;
  return (
    <div className="rounded-lg border border-background-200 bg-background-100 p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-base font-bold text-foreground-950">
            {t("espace.picker.title")}
          </h2>
          <p className="mt-1 text-sm text-foreground-600">
            {complet ? t("espace.max3") : t("espace.picker.desc")}
          </p>
        </div>
        <div className="flex w-full items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3 py-2.5 sm:w-72">
          <i className="ri-search-line text-base text-foreground-500"></i>
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t("espace.picker.search")}
            className="w-full bg-transparent text-sm text-foreground-950 outline-none placeholder:text-foreground-500"
          />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {disponibles.map((formation, index) => (
          <div
            key={formation.id}
            className={`hover-lift flex items-center gap-3 rounded-lg border border-background-200 bg-background-50 p-3 animate-fade-up ${
              index < 3 ? `delay-${index + 1}` : ""
            }`}
          >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md">
              <img
                src={formation.image}
                alt={formation.nom}
                title={`${formation.nom} ${formation.ville} Bénin`}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground-950">{formation.nom}</p>
              <p className="truncate text-xs text-foreground-600">
                {formation.ville} · {formation.niveau}
              </p>
            </div>
            <button
              type="button"
              disabled={complet}
              onClick={() => ajouterCandidature(formation.id)}
              title={t("espace.picker.add")}
              className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors ${
                complet
                  ? "cursor-not-allowed bg-background-200 text-foreground-500"
                  : "bg-primary-500 text-background-50 hover:bg-primary-600"
              }`}
            >
              <i className="ri-add-line text-base"></i>
            </button>
          </div>
        ))}
      </div>
      {disponibles.length === 0 && (
        <div className="mt-5 rounded-md border border-dashed border-background-300 bg-background-50 px-4 py-8 text-center">
          <p className="text-sm text-foreground-600">{t("catalogue.empty")}</p>
          <Link
            to="/formations"
            className="mt-3 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800"
          >
            <i className="ri-book-2-line text-base"></i>
            {t("nav.formations")}
          </Link>
        </div>
      )}
    </div>
  );
}
