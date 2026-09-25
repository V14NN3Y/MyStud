import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Formation } from "@/types/portal";
import { guideFormations } from "@/mocks/formationsGuide";
interface CompareTableProps {
  formations: Formation[];
  onRemove: (formationId: string) => void;
}
interface Critere {
  key: string;
  labelKey: string;
  icon: string;
  value: (formation: Formation) => string;
}
const CRITERES: Critere[] = [
  { key: "niveau", labelKey: "compare.criteres.niveau", icon: "ri-bar-chart-horizontal-line", value: (f) => f.niveau },
  { key: "domaine", labelKey: "compare.criteres.domaine", icon: "ri-price-tag-3-line", value: (f) => f.domaine },
  { key: "etablissement", labelKey: "compare.criteres.etablissement", icon: "ri-building-4-line", value: (f) => f.etablissement },
  { key: "ville", labelKey: "compare.criteres.ville", icon: "ri-map-pin-2-line", value: (f) => f.ville },
  { key: "type", labelKey: "compare.criteres.type", icon: "ri-verified-badge-line", value: (f) => f.typeEtablissement },
  { key: "diplome", labelKey: "compare.criteres.diplome", icon: "ri-award-line", value: (f) => f.diplome },
  { key: "duree", labelKey: "compare.criteres.duree", icon: "ri-time-line", value: (f) => f.duree },
  { key: "capacite", labelKey: "compare.criteres.capacite", icon: "ri-group-line", value: (f) => `${f.capacite} places` },
  { key: "frais", labelKey: "compare.criteres.frais", icon: "ri-money-cny-circle-line", value: (f) => f.frais },
  { key: "series", labelKey: "compare.criteres.series", icon: "ri-file-list-3-line", value: (f) => f.series.join(" · ") },
  { key: "regime", labelKey: "compare.criteres.regime", icon: "ri-hand-coin-line", value: (f) => guideFormations[f.id as keyof typeof guideFormations]?.regime ?? "—" },
  { key: "placesBourse", labelKey: "compare.criteres.placesBourse", icon: "ri-award-line", value: (f) => { const g = guideFormations[f.id as keyof typeof guideFormations]; return g && g.placesBourse > 0 ? `${g.placesBourse} places` : "Aucune"; } },
  { key: "placesFPP", labelKey: "compare.criteres.placesFPP", icon: "ri-wallet-3-line", value: (f) => { const g = guideFormations[f.id as keyof typeof guideFormations]; return g && g.placesFPP > 0 ? `${g.placesFPP} places` : "Aucune"; } },
  { key: "debouches", labelKey: "compare.criteres.debouches", icon: "ri-briefcase-4-line", value: (f) => f.debouches.join(" · ") },
  { key: "statut", labelKey: "compare.criteres.statut", icon: "ri-shield-check-line", value: (f) => f.statut },
  { key: "majLe", labelKey: "compare.criteres.majLe", icon: "ri-refresh-line", value: (f) => f.majLe },
];
export default function CompareTable({ formations, onRemove }: CompareTableProps) {
  const { t } = useTranslation();
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-background-200 bg-background-50">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr>
            <th className="w-[200px] border-b border-background-200 bg-background-100 p-4 align-bottom">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-600">
                <i className="ri-filter-3-line text-base text-primary-600"></i>
                {t("compare.criteria")}
              </span>
            </th>
            {formations.map((formation, index) => (
              <th
                key={formation.id}
                className={`border-b border-l border-background-200 p-4 align-top animate-fade-up ${
                  index < 3 ? `delay-${index + 1}` : ""
                }`}
              >
                <div className="relative h-28 w-full overflow-hidden rounded-md">
                  <img
                    src={formation.image}
                    alt={`${formation.nom} — ${formation.etablissement}`}
                    title={`${formation.nom} ${formation.ville} Bénin`}
                    className="h-full w-full object-cover object-top"
                  />
                  <button
                    type="button"
                    aria-label={`${t("compare.remove")} ${formation.nom}`}
                    onClick={() => onRemove(formation.id)}
                    className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-foreground-950/70 text-background-50 transition-colors hover:bg-foreground-950"
                  >
                    <i className="ri-close-line text-sm"></i>
                  </button>
                </div>
                <Link
                  to={`/formations/${formation.id}`}
                  className="mt-3 block font-heading text-sm font-bold leading-snug text-foreground-950 transition-colors hover:text-primary-700"
                >
                  {formation.nom}
                </Link>
                <p className="mt-1 text-xs text-foreground-600">{formation.ville}</p>
                <Link
                  to={`/etablissements/${formation.etablissementId}`}
                  className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-secondary-700 transition-colors hover:text-secondary-900"
                >
                  <i className="ri-building-4-line text-[13px]"></i>
                  {t("compare.voirEtab")}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CRITERES.map((critere, rowIndex) => {
            const valeurs = formations.map((f) => critere.value(f));
            const different = new Set(valeurs).size > 1;
            return (
              <tr key={critere.key} className={rowIndex % 2 === 1 ? "bg-background-100/60" : ""}>
                <th scope="row" className="border-b border-background-200 p-4 align-top">
                  <span className="flex items-start gap-2 text-xs font-semibold text-foreground-800">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background-100">
                      <i className={`${critere.icon} text-sm text-secondary-600`}></i>
                    </span>
                    <span className="pt-1">{t(critere.labelKey)}</span>
                  </span>
                </th>
                {formations.map((formation, index) => (
                  <td
                    key={`${critere.key}-${formation.id}`}
                    className={`border-b border-l border-background-200 p-4 align-top text-sm ${
                      different ? "font-medium text-foreground-950" : "text-foreground-700"
                    }`}
                  >
                    <span className="flex items-start gap-2">
                      {different && (
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true"></span>
                      )}
                      <span>
                        {valeurs[index]}
                        {critere.key === "debouches" && (
                          <span className="mt-2 block text-xs font-normal text-foreground-600">
                            {formation.debouches.length} métiers identifiés
                          </span>
                        )}
                      </span>
                    </span>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
