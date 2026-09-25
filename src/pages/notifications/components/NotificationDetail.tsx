import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { NotificationData } from "@/hooks/useNotifications";
import { categoriesNotification } from "@/mocks/notifications";
import { CATEGORIE_META, ETAT_STYLES } from "./notificationMeta";
interface NotificationDetailProps {
  notification: NotificationData | null;
  onClose: () => void;
}
export default function NotificationDetail({ notification, onClose }: NotificationDetailProps) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!notification) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [notification, onClose]);
  if (!notification) return null;
  const meta = CATEGORIE_META[notification.categorie] ?? CATEGORIE_META.documents;
  const categorieLabel =
    categoriesNotification.find((c) => c.id === notification.categorie)?.nom ?? notification.categorie;
  const infos = [
    { icon: "ri-price-tag-3-line", label: t("notif.detail.categorie"), valeur: categorieLabel },
    { icon: "ri-send-plane-line", label: t("notif.detail.canal"), valeur: notification.canal },
    { icon: "ri-calendar-line", label: t("notif.detail.date"), valeur: notification.date },
    { icon: "ri-check-double-line", label: t("notif.detail.etat"), valeur: notification.etatEnvoi },
  ];
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground-950/50 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <button type="button" aria-label={t("notif.detail.close")} onClick={onClose} className="absolute inset-0 cursor-pointer"></button>
      <div className="animate-scale-in relative z-10 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-lg bg-background-50 p-5 sm:rounded-lg md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${meta.classes}`}>
              <i className={`${meta.icon} text-xl`}></i>
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-foreground-500">{t("notif.detail.title")}</p>
              <h2 className="mt-1 font-heading text-lg font-bold text-foreground-950">{notification.titre}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("notif.detail.close")}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-background-100 text-foreground-700 transition-colors hover:bg-background-200"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {notification.priorite === "haute" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-900">
              <i className="ri-alarm-warning-line text-[12px]"></i>
              {t("notif.detail.prioriteHaute")}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              ETAT_STYLES[notification.etatEnvoi] ?? ETAT_STYLES["En attente"]
            }`}
          >
            <i className={notification.etatEnvoi === "Échec" ? "ri-error-warning-line" : "ri-check-line"}></i>
            {notification.etatEnvoi}
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground-700">{notification.message}</p>
        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {infos.map((info) => (
            <div key={info.label} className="rounded-md bg-background-100 px-4 py-3">
              <dt className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-foreground-500">
                <i className={`${info.icon} text-[13px] text-secondary-500`}></i>
                {info.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground-950">{info.valeur}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-col gap-3 border-t border-background-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2 text-[11px] text-foreground-500">
            <i className="ri-information-line"></i>
            {t("notif.detail.demo")}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
          >
            <i className="ri-check-line text-base"></i>
            {t("notif.detail.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
