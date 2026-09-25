import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import FormationCard from "@/components/base/FormationCard";
import FiltersPanel, { type FilterState } from "./components/FiltersPanel";
import { formations } from "@/mocks/formations";
import { guideFormations } from "@/mocks/formationsGuide";
import { niveaux, series } from "@/mocks/referentiels";
type SortKey = "relevance" | "name" | "capacity" | "placesBourse";
const placesBourse = (id: string) => guideFormations[id as keyof typeof guideFormations]?.placesBourse ?? 0;
export default function Formations() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const [state, setState] = useState<FilterState>({
    keyword: params.get("q") ?? "",
    domaine: params.get("domaine") ?? "",
    niveau: "",
    etablissement: "",
    ville: "",
    type: "",
    serie: "",
    boursiereOnly: false,
  });
  const [sort, setSort] = useState<SortKey>("relevance");
  const [mobileFilters, setMobileFilters] = useState(false);
  const options = useMemo(
    () => ({
      domaines: Array.from(new Set(formations.map((f) => f.domaine))).sort(),
      niveaux,
      etablissements: Array.from(
        new Map(formations.map((f) => [f.etablissementId, { id: f.etablissementId, nom: f.etablissement }])).values()
      ),
      villes: Array.from(new Set(formations.map((f) => f.ville))).sort(),
      types: Array.from(new Set(formations.map((f) => f.typeEtablissement))),
      series,
    }),
    []
  );
  const results = useMemo(() => {
    const keyword = state.keyword.trim().toLowerCase();
    const filtered = formations.filter((f) => {
      if (keyword) {
        const haystack = `${f.nom} ${f.etablissement} ${f.ville} ${f.domaine} ${f.diplome}`.toLowerCase();
        if (!haystack.includes(keyword)) return false;
      }
      if (state.domaine && f.domaine !== state.domaine) return false;
      if (state.niveau && f.niveau !== state.niveau) return false;
      if (state.etablissement && f.etablissementId !== state.etablissement) return false;
      if (state.ville && f.ville !== state.ville) return false;
      if (state.type && f.typeEtablissement !== state.type) return false;
      if (state.serie && !f.series.includes(state.serie)) return false;
      if (state.boursiereOnly && placesBourse(f.id) <= 0) return false;
      return true;
    });
    const sorted = [...filtered];
    if (sort === "name") sorted.sort((a, b) => a.nom.localeCompare(b.nom));
    if (sort === "capacity") sorted.sort((a, b) => b.capacite - a.capacite);
    if (sort === "placesBourse") sorted.sort((a, b) => placesBourse(b.id) - placesBourse(a.id));
    return sorted;
  }, [state, sort]);
  const activeCount = [
    state.keyword,
    state.domaine,
    state.niveau,
    state.etablissement,
    state.ville,
    state.type,
    state.serie,
    state.boursiereOnly,
  ].filter(Boolean).length;
  const onChange = (patch: Partial<FilterState>) => setState((prev) => ({ ...prev, ...patch }));
  const onReset = () =>
    setState({
      keyword: "",
      domaine: "",
      niveau: "",
      etablissement: "",
      ville: "",
      type: "",
      serie: "",
      boursiereOnly: false,
    });
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("nav.formations")}
          title={t("catalogue.title")}
          subtitle={t("catalogue.subtitle")}
          crumbs={[{ label: t("brand.name"), to: "/" }, { label: t("nav.formations") }]}
        />
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
            <div className={mobileFilters ? "block w-full lg:w-[300px]" : "hidden w-full lg:block lg:w-[300px]"}>
              <FiltersPanel
                state={state}
                options={options}
                onChange={onChange}
                onReset={onReset}
                activeCount={activeCount}
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-3 rounded-lg border border-background-200 bg-background-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileFilters((v) => !v)}
                    className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm font-medium text-foreground-900 lg:hidden"
                  >
                    <i className="ri-equalizer-line text-base"></i>
                    {t("catalogue.filters")}
                    {activeCount > 0 && (
                      <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-semibold text-primary-800">
                        {activeCount}
                      </span>
                    )}
                  </button>
                  <p className="text-sm text-foreground-700">
                    <span className="font-semibold text-foreground-950">{results.length}</span>{" "}
                    {t("common.results")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="whitespace-nowrap text-xs font-medium text-foreground-600">
                    {t("catalogue.sort")}
                  </label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="cursor-pointer rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-900 outline-none"
                  >
                    <option value="relevance">{t("catalogue.sort.relevance")}</option>
                    <option value="name">{t("catalogue.sort.name")}</option>
                    <option value="capacity">{t("catalogue.sort.capacity")}</option>
                    <option value="placesBourse">{t("catalogue.sort.placesBourse")}</option>
                  </select>
                </div>
              </div>
              {activeCount > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-foreground-600">
                    {t("catalogue.activeFilters")} :
                  </span>
                  {state.domaine && (
                    <button
                      type="button"
                      onClick={() => onChange({ domaine: "" })}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800"
                    >
                      {state.domaine}
                      <i className="ri-close-line"></i>
                    </button>
                  )}
                  {state.niveau && (
                    <button
                      type="button"
                      onClick={() => onChange({ niveau: "" })}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800"
                    >
                      {state.niveau}
                      <i className="ri-close-line"></i>
                    </button>
                  )}
                  {state.ville && (
                    <button
                      type="button"
                      onClick={() => onChange({ ville: "" })}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800"
                    >
                      {state.ville}
                      <i className="ri-close-line"></i>
                    </button>
                  )}
                  {state.serie && (
                    <button
                      type="button"
                      onClick={() => onChange({ serie: "" })}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800"
                    >
                      Série {state.serie}
                      <i className="ri-close-line"></i>
                    </button>
                  )}
                  {state.boursiereOnly && (
                    <button
                      type="button"
                      onClick={() => onChange({ boursiereOnly: false })}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800"
                    >
                      {t("catalogue.boursiereOnly")}
                      <i className="ri-close-line"></i>
                    </button>
                  )}
                  {state.keyword && (
                    <button
                      type="button"
                      onClick={() => onChange({ keyword: "" })}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-800"
                    >
                      {state.keyword}
                      <i className="ri-close-line"></i>
                    </button>
                  )}
                </div>
              )}
              {results.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((formation, index) => (
                    <FormationCard key={formation.id} formation={formation} delay={(index % 3) + 1} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-background-300 bg-background-50 px-6 py-16 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background-200">
                    <i className="ri-search-eye-line text-2xl text-foreground-600"></i>
                  </span>
                  <h2 className="mt-4 text-base font-semibold text-foreground-950">
                    {t("catalogue.empty")}
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-foreground-600">{t("catalogue.emptyHint")}</p>
                  <button
                    type="button"
                    onClick={() => {
                      onReset();
                      setSort("relevance");
                    }}
                    className="mt-5 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
                  >
                    <i className="ri-refresh-line text-base"></i>
                    {t("common.reset")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <PortalFooter />
    </div>
  );
}
