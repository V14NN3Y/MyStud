import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { historiqueNotifications } from "@/mocks/notifications";
export interface NotificationData {
  id: string;
  titre: string;
  message: string;
  categorie: string;
  canal: string;
  priorite: string;
  date: string;
  lu: boolean;
  etatEnvoi: string;
}
interface NotificationsValue {
  list: NotificationData[];
  nonLues: number;
  markRead: (id: string) => void;
  toutLire: () => void;
  ouverteId: string | null;
  notificationOuverte: NotificationData | null;
  ouvrir: (id: string | null) => void;
}
const NotificationsContext = createContext<NotificationsValue | null>(null);
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
  const value = useMemo<NotificationsValue>(
    () => ({ list, nonLues, markRead, toutLire, ouverteId, notificationOuverte, ouvrir }),
    [list, nonLues, markRead, toutLire, ouverteId, notificationOuverte, ouvrir]
  );
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}
export default function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications doit être utilisé à l'intérieur de NotificationsProvider");
  }
  return context;
}
