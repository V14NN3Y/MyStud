import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type ServerNotification,
} from "@/lib/api";
import { formatServerDate } from "@/lib/format";
import { NotificationsContext, type NotificationData } from "@/hooks/useNotifications";
function toDisplay(row: ServerNotification): NotificationData {
  return {
    id: String(row.id),
    titre: row.titre,
    message: row.message,
    categorie: row.categorie,
    canal: row.canal,
    priorite: row.priorite,
    date: formatServerDate(row.created_at),
    lu: Boolean(row.lu),
    etatEnvoi: row.etat_envoi,
  };
}
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<NotificationData[]>([]);
  const [enLigne, setEnLigne] = useState(true);
  const [ouverteId, setOuverteId] = useState<string | null>(null);
  // The feed lives in server/src/db.ts's `notifications` table now — no more
  // static historiqueNotifications array reset to the same unread count on
  // every reload. If the backend isn't running, the list stays empty rather
  // than falling back to fake data.
  useEffect(() => {
    let cancelled = false;
    listNotifications()
      .then((rows) => {
        if (cancelled) return;
        setList(rows.map(toDisplay));
        setEnLigne(true);
      })
      .catch(() => {
        if (cancelled) return;
        setEnLigne(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const markRead = useCallback((id: string) => {
    setList((prev) => prev.map((n) => (n.id === id ? { ...n, lu: true } : n)));
    markNotificationRead(Number(id)).catch(() => {
      // Optimistic update stands even if the backend call fails.
    });
  }, []);
  const toutLire = useCallback(() => {
    setList((prev) => prev.map((n) => ({ ...n, lu: true })));
    markAllNotificationsRead().catch(() => {});
  }, []);
  const ouvrir = useCallback(
    (id: string | null) => {
      setOuverteId(id);
      if (id) markRead(id);
    },
    [markRead]
  );
  const nonLues = useMemo(() => list.filter((n) => !n.lu).length, [list]);
  const notificationOuverte = useMemo(
    () => list.find((n) => n.id === ouverteId) ?? null,
    [list, ouverteId]
  );
  const value = useMemo(
    () => ({ list, nonLues, markRead, toutLire, ouverteId, notificationOuverte, ouvrir, enLigne }),
    [list, nonLues, markRead, toutLire, ouverteId, notificationOuverte, ouvrir, enLigne]
  );
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}
