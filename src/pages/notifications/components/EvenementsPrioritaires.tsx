import { useTranslation } from "react-i18next";
import { evenementsPrioritaires } from "@/mocks/notifications";
export default function EvenementsPrioritaires() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {evenementsPrioritaires.map((event) => (
        <div
          key={event.id}
          className="flex items-center gap-3 rounded-lg border border-background-200 bg-background-50 p-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-100">
            <i className={`${event.icon} text-lg text-accent-800`}></i>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground-950">{event.label}</p>
            <p className="mt-0.5 text-[11px] text-foreground-500">
              {t("notif.evenements.canalDefaut")} : <span className="font-medium text-foreground-700">{event.canalDefaut}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
