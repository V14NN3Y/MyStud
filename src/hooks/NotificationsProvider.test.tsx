import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
vi.mock("@/lib/api", () => ({
  listNotifications: vi.fn(),
  markNotificationRead: vi.fn(),
  markAllNotificationsRead: vi.fn(),
}));
import { listNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/api";
import { NotificationsProvider } from "./NotificationsProvider";
import useNotifications from "./useNotifications";
const row = (over: Partial<{ id: number; lu: number }> = {}) => ({
  id: 1,
  titre: "Examen déplacé",
  message: "Détail",
  categorie: "notes",
  canal: "Portail",
  priorite: "haute",
  etat_envoi: "Envoyé",
  lu: 0,
  created_at: "2026-09-26T09:12:00.000Z",
  ...over,
});
function setup() {
  return renderHook(() => useNotifications(), { wrapper: NotificationsProvider });
}
describe("NotificationsProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("fetches the real feed on mount and derives the unread count from it", async () => {
    vi.mocked(listNotifications).mockResolvedValue([row({ id: 1, lu: 0 }), row({ id: 2, lu: 1 })]);
    const { result } = setup();
    await waitFor(() => expect(result.current.list).toHaveLength(2));
    expect(result.current.nonLues).toBe(1);
    expect(result.current.enLigne).toBe(true);
  });
  it("stays empty (not fake data) when the backend is unreachable", async () => {
    vi.mocked(listNotifications).mockRejectedValue(new Error("network error"));
    const { result } = setup();
    await waitFor(() => expect(result.current.enLigne).toBe(false));
    expect(result.current.list).toHaveLength(0);
    expect(result.current.nonLues).toBe(0);
  });
  it("markRead() persists to the backend and updates the count optimistically", async () => {
    vi.mocked(listNotifications).mockResolvedValue([row({ id: 1, lu: 0 })]);
    vi.mocked(markNotificationRead).mockResolvedValue(row({ id: 1, lu: 1 }));
    const { result } = setup();
    await waitFor(() => expect(result.current.list).toHaveLength(1));
    act(() => result.current.markRead("1"));
    expect(result.current.nonLues).toBe(0);
    await waitFor(() => expect(markNotificationRead).toHaveBeenCalledWith(1));
  });
  it("toutLire() marks every notification read and calls the bulk endpoint", async () => {
    vi.mocked(listNotifications).mockResolvedValue([row({ id: 1, lu: 0 }), row({ id: 2, lu: 0 })]);
    vi.mocked(markAllNotificationsRead).mockResolvedValue([]);
    const { result } = setup();
    await waitFor(() => expect(result.current.list).toHaveLength(2));
    act(() => result.current.toutLire());
    expect(result.current.nonLues).toBe(0);
    await waitFor(() => expect(markAllNotificationsRead).toHaveBeenCalled());
  });
  it("ouvrir() opens a notification and marks it read", async () => {
    vi.mocked(listNotifications).mockResolvedValue([row({ id: 1, lu: 0 })]);
    vi.mocked(markNotificationRead).mockResolvedValue(row({ id: 1, lu: 1 }));
    const { result } = setup();
    await waitFor(() => expect(result.current.list).toHaveLength(1));
    act(() => result.current.ouvrir("1"));
    expect(result.current.ouverteId).toBe("1");
    expect(result.current.notificationOuverte?.id).toBe("1");
    expect(result.current.nonLues).toBe(0);
  });
});
