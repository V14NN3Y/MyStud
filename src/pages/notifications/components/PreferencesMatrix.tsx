import { useTranslation } from "react-i18next";
import { canauxNotification, categoriesNotification } from "@/mocks/notifications";
export interface PreferenceRow {
  categorie: string;
  portail: boolean;
  sms: boolean;
  email: boolean;
  verrouille: boolean;
}
interface PreferencesMatrixProps {
  rows: PreferenceRow[];
  onToggle: (categorie: string, canal: "portail" | "sms" | "email") => void;
}
export default function PreferencesMatrix({ rows, onToggle }: PreferencesMatrixProps) {
  const { t } = useTranslation();
  const canaux: ("portail" | "sms" | "email")[] = ["portail", "sms", "email"];
  return (
    <div className="overflow-x-auto rounded-lg border border-background-200 bg-background-50">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="bg-background-100">
            <th className="border-b border-background-200 p-4 text-xs font-semibold uppercase tracking-wide text-foreground-600">
              {t("notif.preferences.categorie")}
            </th>
            {canauxNotification.map((canal) => (
              <th
                key={canal.id}
                className="border-b border-l border-background-200 p-4 text-center text-xs font-semibold text-foreground-700"
              >
                <span className="inline-flex items-center gap-1.5">
                  <i className={`${canal.icon} text-base text-secondary-600`}></i>
                  {canal.nom}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const cat = categoriesNotification.find((c) => c.id === row.categorie);
            return (
              <tr key={row.categorie} className={index % 2 === 1 ? "bg-background-100/60" : ""}>
                <td className="border-b border-background-200 p-4 text-sm font-medium text-foreground-900">
                  {cat?.nom ?? row.categorie}
                </td>
                {canaux.map((canal) => {
                  const actif = row[canal];
                  const locked = row.verrouille;
                  return (
                    <td key={canal} className="border-b border-l border-background-200 p-4 text-center">
                      <button
                        type="button"
                        disabled={locked}
                        aria-pressed={actif}
                        aria-label={`${cat?.nom ?? row.categorie} — ${canal}`}
                        onClick={() => onToggle(row.categorie, canal)}
                        className={`inline-flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
                          locked ? "cursor-default opacity-80" : "cursor-pointer"
                        } ${actif ? "bg-primary-500" : "bg-background-300"}`}
                      >
                        <span
                          className={`h-5 w-5 rounded-full bg-background-50 transition-transform ${
                            actif ? "translate-x-5" : "translate-x-0"
                          }`}
                        ></span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="flex items-start gap-2 border-t border-background-200 bg-background-100/60 p-4 text-xs leading-relaxed text-foreground-600">
        <i className="ri-lock-line mt-0.5 text-sm text-foreground-500"></i>
        {t("notif.preferences.verrouilleNote")}
      </p>
    </div>
  );
}
