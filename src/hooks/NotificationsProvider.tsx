import { useCallback, useMemo, useState, type ReactNode } from "react";
import { historiqueNotifications } from "@/mocks/notifications";
import { NotificationsContext, type NotificationData } from "@/hooks/useNotifications";
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<NotificationData[]>(historiqueNotifications as NotificationData[]);
  const [ouverteId, setOuverteId] = useState<string | null>(null);
  const markRead = useCallback((id: string) => {
    setList((prev) => prev.map((n) => (n.id === id ? { ...n, lu: true } : n)));
  }, []);
  const toutLire = useCallback(() => {
    setList((prev) => prev.map((n) => ({ ...n, lu: true })));
  }, []);
  const ouvrir = useCallback((id: string | null) => {
    setOuverteId(id);
    if (id) {
      setList((prev) => prev.map((n) => (n.id === id ? { ...n, lu: true } : n)));
    }
  }, []);
  const nonLues = useMemo(() => list.filter((n) => !n.lu).length, [list]);
  const notificationOuverte = useMemo(
    () => list.find((n) => n.id === ouverteId) ?? null,
    [list, ouverteId]
  );
  const value = useMemo(
    () => ({ list, nonLues, markRead, toutLire, ouverteId, notificationOuverte, ouvrir }),
    [list, nonLues, markRead, toutLire, ouverteId, notificationOuverte, ouvrir]
  );
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}
