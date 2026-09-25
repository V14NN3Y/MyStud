import { useTranslation } from "react-i18next";
import { rolesInstitutionnels, modulesInstitutionnels } from "@/mocks/universite";
interface RoleSwitcherProps {
  value: string;
  onChange: (roleId: string) => void;
}
export default function RoleSwitcher({ value, onChange }: RoleSwitcherProps) {
  const { t } = useTranslation();
  const role = rolesInstitutionnels.find((r) => r.id === value) ?? rolesInstitutionnels[0];
  const moduleNoms = role.modules
    .map((id) => modulesInstitutionnels.find((m) => m.id === id)?.nom)
    .filter(Boolean) as string[];
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-700">
            {t("univ.role.label")}
          </p>
          <h2 className="mt-1 font-heading text-lg font-bold text-foreground-950">{role.nom}</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-800">
          <i className="ri-shield-user-line text-sm"></i>
          {t("univ.role.current")} : {role.nom}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {rolesInstitutionnels.map((item) => {
          const actif = item.id === value;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              aria-pressed={actif}
              className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                actif
                  ? "border-primary-500 bg-primary-500 text-background-50"
                  : "border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300 hover:text-primary-700"
              }`}
            >
              <i className={`${item.icon} text-base`}></i>
              {item.nom}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-foreground-600">{role.description}</p>
      <div className="mt-4 border-t border-background-200 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
          {t("univ.role.modules")}
        </p>
        {moduleNoms.length === 0 ? (
          <p className="mt-2 text-sm text-foreground-600">{t("univ.role.noModule")}</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {moduleNoms.map((nom) => (
              <span
                key={nom}
                className="rounded-md bg-secondary-100 px-2.5 py-1 text-[11px] font-medium text-secondary-900"
              >
                {nom}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
