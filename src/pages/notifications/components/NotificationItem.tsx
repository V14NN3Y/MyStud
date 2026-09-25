import { useTranslation } from "react-i18next";
import type { NotificationData } from "@/hooks/useNotifications";
import { CATEGORIE_META, ETAT_STYLES } from "./notificationMeta";
export type { NotificationData };
interface NotificationItemProps {
  notification: NotificationData;
  onMarkRead: (id: string) => void;
  onOpen: (id: string) => void;
}
export default function NotificationItem({ notification, onMarkRead, onOpen }: NotificationItemProps) {
  const { t } = useTranslation();
  const meta = CATEGORIE_META[notification.categorie] ?? CATEGORIE_META.documents;
  return (
    <li
      className={`group relative flex items-start gap-4 rounded-lg border p-4 transition-colors ${
        notification.lu ? "border-background-200 bg-background-50 hover:border-background-300" : "border-primary-200 bg-primary-50/60 hover:border-primary-300"
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(notification.id)}
        aria-label={`${t("notif.open")} — ${notification.titre}`}
        className="absolute inset-0 z-10 cursor-pointer rounded-lg"
      ></button>
      <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${meta.classes}`}>
        <i className={`${meta.icon} text-lg`}></i>
      </span>
      <div className="pointer-events-none relative min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {notification.priorite === "haute" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-900">
              <i className="ri-alarm-warning-line text-[11px]"></i>
              {t("notif.historique.prioritaire")}
            </span>
          )}
          {!notification.lu && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-background-50">
              {t("notif.historique.unread")}
            </span>
          )}
          <h3 className="text-sm font-semibold text-foreground-950">{notification.titre}</h3>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground-600">{notification.message}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-foreground-500">
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-price-tag-3-line"></i>
            {t("notif.historique.canal")} : {notification.canal}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-calendar-line"></i>
            {notification.date}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-semibold ${
              ETAT_STYLES[notification.etatEnvoi] ?? ETAT_STYLES["En attente"]
            }`}
          >
            <i
              className={`text-[11px] ${
                notification.etatEnvoi === "Échec" ? "ri-error-warning-line" : "ri-check-line"
              }`}
            ></i>
            {notification.etatEnvoi}
          </span>
        </div>
      </div>
      <div className="relative z-20 flex shrink-0 flex-col items-center gap-2">
        <i className="ri-arrow-right-up-line text-base text-foreground-300 transition-colors group-hover:text-primary-500"></i>
        {!notification.lu && (
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            title={t("notif.historique.marquerLue")}
            aria-label={t("notif.historique.marquerLue")}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-background-300 bg-background-50 text-foreground-600 transition-colors hover:border-primary-300 hover:text-primary-700"
          >
            <i className="ri-check-double-line text-base"></i>
          </button>
        )}
      </div>
    </li>
  );
}
