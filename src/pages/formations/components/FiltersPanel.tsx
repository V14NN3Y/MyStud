import { useTranslation } from "react-i18next";
export interface FilterState {
  keyword: string;
  domaine: string;
  niveau: string;
  etablissement: string;
  ville: string;
  type: string;
  serie: string;
  boursiereOnly: boolean;
}
interface FiltersPanelProps {
  state: FilterState;
  options: {
    domaines: string[];
    niveaux: string[];
    etablissements: { id: string; nom: string }[];
    villes: string[];
    types: string[];
    series: string[];
  };
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  activeCount: number;
}
const selectClass =
  "w-full cursor-pointer rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 outline-none transition-colors focus:border-primary-400";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-600";
export default function FiltersPanel({
  state,
  options,
  onChange,
  onReset,
  activeCount,
}: FiltersPanelProps) {
  const { t } = useTranslation();
  return (
    <aside className="w-full rounded-lg border border-background-200 bg-background-50 p-5 lg:sticky lg:top-24 lg:w-[300px]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground-950">
          <i className="ri-filter-3-line text-base text-primary-600"></i>
          {t("catalogue.filters")}
          {activeCount > 0 && (
            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-semibold text-primary-800">
              {activeCount}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer text-xs font-medium text-secondary-700 transition-colors hover:text-secondary-900"
        >
          {t("common.reset")}
        </button>
      </div>
      <div className="mt-5 space-y-4">
        <div>
          <label className={labelClass} htmlFor="filter-keyword">
            {t("catalogue.keyword")}
          </label>
          <div className="flex items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3 py-2.5">
            <i className="ri-search-line text-base text-foreground-500"></i>
            <input
              id="filter-keyword"
              type="text"
              value={state.keyword}
              onChange={(e) => onChange({ keyword: e.target.value })}
              placeholder={t("catalogue.searchPlaceholder")}
              className="w-full bg-transparent text-sm text-foreground-950 outline-none placeholder:text-foreground-500"
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="filter-domaine">
            {t("catalogue.domain")}
          </label>
          <select
            id="filter-domaine"
            className={selectClass}
            value={state.domaine}
            onChange={(e) => onChange({ domaine: e.target.value })}
          >
            <option value="">{t("common.all")}</option>
            {options.domaines.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="filter-niveau">
            {t("catalogue.level")}
          </label>
          <select
            id="filter-niveau"
            className={selectClass}
            value={state.niveau}
            onChange={(e) => onChange({ niveau: e.target.value })}
          >
            <option value="">{t("common.all")}</option>
            {options.niveaux.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="filter-etab">
            {t("catalogue.university")}
          </label>
          <select
            id="filter-etab"
            className={selectClass}
            value={state.etablissement}
            onChange={(e) => onChange({ etablissement: e.target.value })}
          >
            <option value="">{t("common.all")}</option>
            {options.etablissements.map((e) => (
              <option key={e.id} value={e.id}>{e.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="filter-ville">
            {t("catalogue.city")}
          </label>
          <select
            id="filter-ville"
            className={selectClass}
            value={state.ville}
            onChange={(e) => onChange({ ville: e.target.value })}
          >
            <option value="">{t("common.all")}</option>
            {options.villes.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="filter-serie">
            {t("catalogue.series")}
          </label>
          <select
            id="filter-serie"
            className={selectClass}
            value={state.serie}
            onChange={(e) => onChange({ serie: e.target.value })}
          >
            <option value="">{t("common.all")}</option>
            {options.series.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="filter-type">
            {t("catalogue.type")}
          </label>
          <div className="flex flex-wrap gap-2" id="filter-type">
            <button
              type="button"
              onClick={() => onChange({ type: "" })}
              className={`cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                state.type === ""
                  ? "bg-primary-500 text-background-50"
                  : "bg-background-200 text-foreground-700 hover:bg-background-300"
              }`}
            >
              {t("common.all")}
            </button>
            {options.types.map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => onChange({ type: tp })}
                className={`cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  state.type === tp
                    ? "bg-primary-500 text-background-50"
                    : "bg-background-200 text-foreground-700 hover:bg-background-300"
                }`}
              >
                {tp}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className={labelClass}>{t("catalogue.boursiereOnly")}</span>
          <button
            type="button"
            onClick={() => onChange({ boursiereOnly: !state.boursiereOnly })}
            aria-pressed={state.boursiereOnly}
            className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left transition-colors ${
              state.boursiereOnly
                ? "border-primary-300 bg-primary-50"
                : "border-background-300 bg-background-50 hover:border-primary-200"
            }`}
          >
            <span className="flex items-center gap-2 text-xs font-semibold text-foreground-800">
              <i className="ri-hand-coin-line text-sm text-primary-600"></i>
              {t(state.boursiereOnly ? "catalogue.boursiereOnly.on" : "catalogue.boursiereOnly.off")}
            </span>
            <span
              className={`relative flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                state.boursiereOnly ? "bg-primary-500" : "bg-background-300"
              }`}
            >
              <span
                className={`absolute h-4 w-4 rounded-full bg-background-50 transition-transform ${
                  state.boursiereOnly ? "translate-x-4" : "translate-x-0.5"
                }`}
              ></span>
            </span>
          </button>
          <p className="mt-2 text-[11px] leading-relaxed text-foreground-500">
            {t("catalogue.boursiereOnlyHint")}
          </p>
        </div>
      </div>
    </aside>
  );
}
