import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, renderWithProviders, screen, waitFor } from "@/test/render";
import PublicationPanel from "./PublicationPanel";
vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return { ...actual, listPublications: vi.fn(), togglePublication: vi.fn() };
});
import { listPublications, togglePublication } from "@/lib/api";
describe("PublicationPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("shows the mock content while there is no session token", () => {
    renderWithProviders(<PublicationPanel token={null} onAudit={vi.fn()} />);
    expect(screen.getByText(/Semestre 4 — Génie Informatique/)).toBeInTheDocument();
    expect(listPublications).not.toHaveBeenCalled();
  });
  it("replaces the mock rows with the real backend list once a token is available", async () => {
    vi.mocked(listPublications).mockResolvedValue([
      { id: "pub-edt", type: "Emploi du temps", libelle: "Une vraie publication serveur", statut: "Brouillon", updated_at: "2026-09-24T09:00:00.000Z" },
    ]);
    renderWithProviders(<PublicationPanel token="tok-1" onAudit={vi.fn()} />);
    expect(await screen.findByText("Une vraie publication serveur")).toBeInTheDocument();
  });
  it("toggling a publication persists the change and reports an audit event", async () => {
    vi.mocked(listPublications).mockResolvedValue([
      { id: "pub-edt", type: "Emploi du temps", libelle: "Semestre 4 — Génie Informatique (Licence 2)", statut: "Brouillon", updated_at: "2026-09-24T09:00:00.000Z" },
    ]);
    vi.mocked(togglePublication).mockResolvedValue({
      id: "pub-edt", type: "Emploi du temps", libelle: "Semestre 4 — Génie Informatique (Licence 2)", statut: "Publié", updated_at: "2026-09-26T10:00:00.000Z",
    });
    const onAudit = vi.fn();
    renderWithProviders(<PublicationPanel token="tok-1" onAudit={onAudit} />);
    const button = await screen.findByRole("button", { name: /Publier/i });
    fireEvent.click(button);
    expect(onAudit).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(togglePublication).toHaveBeenCalledWith("tok-1", "pub-edt"));
    expect(await screen.findByText("Publié")).toBeInTheDocument();
  });
});
