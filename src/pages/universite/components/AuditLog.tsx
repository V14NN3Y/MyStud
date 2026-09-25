import { useTranslation } from "react-i18next";
export interface AuditEvent {
  id: string;
  action: string;
  cible: string;
  auteur: string;
  role: string;
  date: string;
}
interface AuditLogProps {
  events: AuditEvent[];
}
export default function AuditLog({ events }: AuditLogProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary-100">
          <i className="ri-history-line text-lg text-secondary-700"></i>
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground-950">{t("univ.audit.title")}</h2>
          <p className="mt-1 text-sm text-foreground-600">{t("univ.audit.desc")}</p>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="bg-background-100">
              <th className="border-b border-background-200 p-3.5 text-xs font-semibold uppercase tracking-wide text-foreground-600">
                {t("univ.audit.col.action")}
              </th>
              <th className="border-b border-l border-background-200 p-3.5 text-xs font-semibold uppercase tracking-wide text-foreground-600">
                {t("univ.audit.col.cible")}
              </th>
              <th className="border-b border-l border-background-200 p-3.5 text-xs font-semibold uppercase tracking-wide text-foreground-600">
                {t("univ.audit.col.auteur")}
              </th>
              <th className="border-b border-l border-background-200 p-3.5 text-xs font-semibold uppercase tracking-wide text-foreground-600">
                {t("univ.audit.col.date")}
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event.id} className={index % 2 === 1 ? "bg-background-100/60" : ""}>
                <td className="border-b border-background-200 p-3.5 text-sm font-medium text-foreground-900">
                  {event.action}
                </td>
                <td className="border-b border-l border-background-200 p-3.5 text-sm text-foreground-700">
                  {event.cible}
                </td>
                <td className="border-b border-l border-background-200 p-3.5 text-sm text-foreground-700">
                  {event.auteur}
                  <span className="mt-0.5 block text-[11px] text-foreground-500">{event.role}</span>
                </td>
                <td className="border-b border-l border-background-200 p-3.5 text-xs text-foreground-600">
                  {event.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
