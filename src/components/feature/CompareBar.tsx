import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useDemoSession, { MAX_CANDIDATURES } from "@/hooks/useDemoSession";
import { formations } from "@/mocks/formations";
export default function CompareBar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { comparaison, retirerComparaison, viderComparaison } = useDemoSession();
  if (comparaison.length === 0 || location.pathname === "/formations/comparer") return null;
  const selection = formations.filter((f) => comparaison.includes(f.id));
  const pretAComparer = selection.length >= 2;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
      <div className="animate-scale-in pointer-events-auto w-full max-w-4xl rounded-lg border border-background-300 bg-background-50/95 p-3 backdrop-blur md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-600">
              <i className="ri-scales-3-line text-base text-primary-600"></i>
              {t("compare.bar")} · {selection.length}/{MAX_CANDIDATURES} {t("compare.selected")}
            </p>
            <div className="flex flex-wrap gap-2">
              {selection.map((formation) => (
                <span
                  key={formation.id}
                  className="inline-flex max-w-full items-center gap-2 rounded-full bg-background-100 px-3 py-1 text-xs font-medium text-foreground-800"
                >
                  <span className="truncate">{formation.nom}</span>
                  <button
                    type="button"
                    aria-label={`${t("compare.remove")} ${formation.nom}`}
                    onClick={() => retirerComparaison(formation.id)}
                    className="cursor-pointer text-foreground-500 transition-colors hover:text-foreground-900"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={viderComparaison}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              <i className="ri-delete-bin-6-line"></i>
              {t("compare.clear")}
            </button>
            {pretAComparer ? (
              <Link
                to="/formations/comparer"
                className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2.5 text-xs font-semibold text-background-50 transition-colors hover:bg-primary-600"
              >
                <i className="ri-layout-column-line"></i>
                {t("compare.see")}
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-2 whitespace-nowrap rounded-md bg-background-200 px-4 py-2.5 text-xs font-semibold text-foreground-600">
                <i className="ri-add-line"></i>
                {t("compare.needTwo")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
