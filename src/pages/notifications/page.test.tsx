import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, renderWithProviders, screen, waitFor } from "@/test/render";
import Notifications from "./page";
vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    listNotifications: vi.fn().mockResolvedValue([]),
    listNotificationPreferences: vi.fn(),
    updateNotificationPreference: vi.fn(),
  };
});
import { listNotificationPreferences, listNotifications, updateNotificationPreference } from "@/lib/api";
const prefRow = (over: Partial<Record<string, unknown>> = {}) => ({
  categorie: "notes",
  portail: 1,
  sms: 0,
  email: 1,
  verrouille: 0,
  ...over,
});
describe("Notifications page — préférences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("loads the real preference matrix from the backend", async () => {
    vi.mocked(listNotificationPreferences).mockResolvedValue([
      prefRow({ categorie: "notes" }),
      prefRow({ categorie: "identite", verrouille: 1 }),
    ]);
    renderWithProviders(<Notifications />);
    await waitFor(() => expect(listNotificationPreferences).toHaveBeenCalled());
  });
  it("toggles a category's channel and persists it to the backend", async () => {
    vi.mocked(listNotificationPreferences).mockResolvedValue([prefRow({ categorie: "notes", sms: 0 })]);
    vi.mocked(updateNotificationPreference).mockResolvedValue(prefRow({ categorie: "notes", sms: 1 }));
    renderWithProviders(<Notifications />);
    fireEvent.click(screen.getByRole("button", { name: "Préférences" }));
    const toggle = await screen.findByRole("button", { name: /Notes et examens — sms/i });
    fireEvent.click(toggle);
    await waitFor(() => expect(updateNotificationPreference).toHaveBeenCalledWith("notes", "sms", true));
  });
  it("reverts the toggle if the backend rejects the change", async () => {
    vi.mocked(listNotificationPreferences).mockResolvedValue([prefRow({ categorie: "notes", sms: 0 })]);
    vi.mocked(updateNotificationPreference).mockRejectedValue(new Error("boom"));
    renderWithProviders(<Notifications />);
    fireEvent.click(screen.getByRole("button", { name: "Préférences" }));
    const toggle = await screen.findByRole("button", { name: /Notes et examens — sms/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(toggle);
    await waitFor(() => expect(updateNotificationPreference).toHaveBeenCalled());
    await waitFor(() => expect(toggle).toHaveAttribute("aria-pressed", "false"));
  });
  it("shows an offline notice when the backend feed can't be reached", async () => {
    vi.mocked(listNotifications).mockRejectedValue(new Error("boom"));
    vi.mocked(listNotificationPreferences).mockRejectedValue(new Error("boom"));
    renderWithProviders(<Notifications />);
    expect(await screen.findByText(/backend indisponible/i)).toBeInTheDocument();
  });
});
