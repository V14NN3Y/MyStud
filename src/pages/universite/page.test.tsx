import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, renderWithProviders, screen, waitFor } from "@/test/render";
import Universite from "./page";
vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    createSession: vi.fn(),
    listAuditEvents: vi.fn(),
    postAuditEvent: vi.fn(),
    // NotificationsProvider wraps every page (see src/App.tsx) and fetches
    // on mount; give it something to resolve to so it doesn't reject.
    listNotifications: vi.fn().mockResolvedValue([]),
  };
});
import { createSession, listAuditEvents, postAuditEvent } from "@/lib/api";
describe("Universite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("shows a verified-session badge once the backend mints a token", async () => {
    vi.mocked(createSession).mockResolvedValue({ token: "tok-1", role: "universite" });
    vi.mocked(listAuditEvents).mockResolvedValue([]);
    renderWithProviders(<Universite />);
    expect(await screen.findByText("Session serveur vérifiée")).toBeInTheDocument();
  });
  it("falls back to local demo mode when the backend session request fails", async () => {
    vi.mocked(createSession).mockRejectedValue(new Error("network error"));
    renderWithProviders(<Universite />);
    expect(await screen.findByText(/Mode démonstration locale/)).toBeInTheDocument();
  });
  it("posts a real audit event when a decision is made with a live session", async () => {
    vi.mocked(createSession).mockResolvedValue({ token: "tok-1", role: "universite" });
    vi.mocked(listAuditEvents).mockResolvedValue([]);
    vi.mocked(postAuditEvent).mockResolvedValue({
      id: 42,
      action: "Décision publiée : Acceptée",
      cible: "Candidature cand-2026-0142 — AGBODJAN R.",
      auteur_role: "universite",
      created_at: "2026-09-26T10:00:00.000Z",
    });
    renderWithProviders(<Universite />);
    await screen.findByText("Session serveur vérifiée");
    fireEvent.click(screen.getAllByText("Accepter")[0]);
    await waitFor(() =>
      expect(postAuditEvent).toHaveBeenCalledWith("tok-1", expect.any(String), expect.any(String))
    );
    expect(await screen.findByText("Décision publiée : Acceptée")).toBeInTheDocument();
  });
  it("keeps the locally-built audit event when posting to the backend fails", async () => {
    vi.mocked(createSession).mockResolvedValue({ token: "tok-1", role: "universite" });
    vi.mocked(listAuditEvents).mockResolvedValue([]);
    vi.mocked(postAuditEvent).mockRejectedValue(new Error("boom"));
    renderWithProviders(<Universite />);
    await screen.findByText("Session serveur vérifiée");
    fireEvent.click(screen.getAllByText("Accepter")[0]);
    expect(await screen.findByText(/Décision publiée : Acceptée/)).toBeInTheDocument();
  });
});
