import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import useDemoSession, { MAX_CANDIDATURES } from "@/hooks/useDemoSession";
import { formations } from "@/mocks/formations";
export default function ComparePicker() {
  const { t } = useTranslation();
  const { comparaison, toggleComparaison } = useDemoSession();
  const [keyword, setKeyword] = useState("");
  const disponibles = useMemo(() => {
    const terme = keyword.trim().toLowerCase();
    return formations
      .filter((f) => !comparaison.includes(f.id))
      .filter((f) => (terme ? `${f.nom} ${f.etablissement} ${f.ville} ${f.domaine}`.toLowerCase().includes(terme) : true))
      .slice(0, 6);
  }, [comparaison, keyword]);
  const complet = comparaison.length >= MAX_CANDIDATURES;
  return (
    <div className="rounded-lg border border-background-200 bg-background-100 p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-base font-bold text-foreground-950">
            {t("compare.title")}
          </h2>
          <p className="mt-1 text-sm text-foreground-600">
            {complet ? t("compare.maxReached") : t("compare.subtitle")}
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
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              <p className="truncate text-xs text-foreground-600">{formation.ville} · {formation.niveau}</p>
            </div>
            <button
              type="button"
              disabled={complet}
              onClick={() => toggleComparaison(formation.id)}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors ${
                complet
                  ? "cursor-not-allowed bg-background-200 text-foreground-500"
                  : "cursor-pointer bg-primary-500 text-background-50 hover:bg-primary-600"
              }`}
              title={t("compare.add")}
            >
              <i className="ri-add-line text-base"></i>
            </button>
          </div>
        ))}
      </div>
      {disponibles.length === 0 && (
        <p className="mt-5 rounded-md border border-dashed border-background-300 bg-background-50 px-4 py-6 text-center text-sm text-foreground-600">
          {t("catalogue.empty")}
        </p>
      )}
    </div>
  );
}
