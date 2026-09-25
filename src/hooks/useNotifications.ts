import { createContext, useContext } from "react";
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
export interface NotificationsValue {
  list: NotificationData[];
  nonLues: number;
  markRead: (id: string) => void;
  toutLire: () => void;
  ouverteId: string | null;
  notificationOuverte: NotificationData | null;
  ouvrir: (id: string | null) => void;
}
export const NotificationsContext = createContext<NotificationsValue | null>(null);
export default function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications doit être utilisé à l'intérieur de NotificationsProvider");
  }
  return context;
}
