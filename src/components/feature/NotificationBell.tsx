import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useNotifications from "@/hooks/useNotifications";
import { CATEGORIE_META } from "@/pages/notifications/components/notificationMeta";
interface NotificationBellProps {
  solid: boolean;
}
export default function NotificationBell({ solid }: NotificationBellProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { list, nonLues, markRead, toutLire, ouvrir } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const apercu = list.slice(0, 4);
  const openNotification = (id: string) => {
    markRead(id);
    ouvrir(id);
    setOpen(false);
    navigate("/notifications");
  };
  const voirTout = () => {
    setOpen(false);
    navigate("/notifications");
  };
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t("nav.notifications")}
        title={t("nav.notifications")}
        className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-md transition-colors ${
          solid
            ? "bg-background-100 text-foreground-700 hover:text-primary-700"
            : "bg-background-50/20 text-background-50 hover:bg-background-50/30"
        }`}
      >
        <i className="ri-notification-3-line text-lg"></i>
        {nonLues > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-foreground-950">
            {nonLues > 9 ? "9+" : nonLues}
          </span>
        )}
      </button>
      {open && (
        <div className="animate-scale-in absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-background-200 bg-background-50">
          <div className="flex items-center justify-between gap-2 border-b border-background-200 px-4 py-3">
            <span className="font-heading text-sm font-bold text-foreground-950">{t("notif.menu.title")}</span>
            <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-semibold text-primary-800">
              {nonLues} {t("notif.menu.unread")}
            </span>
          </div>
          {apercu.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-foreground-500">{t("notif.menu.empty")}</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {apercu.map((notification) => {
                const meta = CATEGORIE_META[notification.categorie] ?? CATEGORIE_META.documents;
                return (
                  <li key={notification.id}>
                    <button
                      type="button"
                      onClick={() => openNotification(notification.id)}
                      className="flex w-full cursor-pointer items-start gap-3 border-b border-background-100 px-4 py-3 text-left transition-colors last:border-0 hover:bg-background-100"
                    >
                      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${meta.classes}`}>
                        <i className={`${meta.icon} text-sm`}></i>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-foreground-950">{notification.titre}</span>
                          {!notification.lu && <span className="h-2 w-2 shrink-0 rounded-full bg-accent-500"></span>}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-foreground-500">
                          {notification.canal} · {notification.date}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="flex items-center justify-between gap-2 border-t border-background-200 bg-background-100/60 px-3 py-2.5">
            <button
              type="button"
              onClick={toutLire}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold text-foreground-600 transition-colors hover:text-primary-700"
            >
              <i className="ri-check-double-line text-sm"></i>
              {t("notif.menu.markAll")}
            </button>
            <button
              type="button"
              onClick={voirTout}
              className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:text-primary-800"
            >
              {t("notif.menu.seeAll")}
              <i className="ri-arrow-right-line text-sm"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
