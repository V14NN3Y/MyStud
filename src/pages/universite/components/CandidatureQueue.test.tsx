import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, renderWithProviders, screen, waitFor } from "@/test/render";
import CandidatureQueue from "./CandidatureQueue";
vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return { ...actual, listCandidatures: vi.fn(), decideCandidature: vi.fn() };
});
import { decideCandidature, listCandidatures } from "@/lib/api";
const serverRow = (over: Partial<Record<string, unknown>> = {}) => ({
  id: "cand-2026-0142",
  matricule: "MS-2004-014278",
  nom: "AGBODJAN R.",
  formation: "Génie Informatique",
  serie: "C",
  mention: "Bien",
  moyenne_bac: 15.4,
  date_depot: "22 septembre 2026",
  statut: "En attente",
  motif_refus: null,
  commentaire: null,
  updated_at: "2026-09-26T10:00:00.000Z",
  ...over,
});
describe("CandidatureQueue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("shows the mock content while there is no session token", () => {
    renderWithProviders(<CandidatureQueue token={null} onAudit={vi.fn()} />);
    expect(screen.getByText("AGBODJAN R.")).toBeInTheDocument();
    expect(listCandidatures).not.toHaveBeenCalled();
  });
  it("accepting a candidature persists it and reports an audit event", async () => {
    vi.mocked(listCandidatures).mockResolvedValue([serverRow()]);
    vi.mocked(decideCandidature).mockResolvedValue(serverRow({ statut: "Acceptée" }));
    const onAudit = vi.fn();
    renderWithProviders(<CandidatureQueue token="tok-1" onAudit={onAudit} />);
    const accepter = await screen.findByRole("button", { name: /Accepter/i });
    fireEvent.click(accepter);
    expect(onAudit).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(decideCandidature).toHaveBeenCalledWith("tok-1", "cand-2026-0142", "Acceptée", undefined)
    );
    expect(await screen.findByText("Acceptée")).toBeInTheDocument();
  });
  it("refusing requires a motif before it can be confirmed", async () => {
    vi.mocked(listCandidatures).mockResolvedValue([serverRow()]);
    renderWithProviders(<CandidatureQueue token="tok-1" onAudit={vi.fn()} />);
    fireEvent.click(await screen.findByRole("button", { name: /Refuser/i }));
    fireEvent.click(screen.getByRole("button", { name: /Confirmer le refus/i }));
    expect(screen.getByText("Sélectionnez un motif avant de confirmer.")).toBeInTheDocument();
    expect(decideCandidature).not.toHaveBeenCalled();
  });
  it("refusing with a motif persists the decision and the reason", async () => {
    vi.mocked(listCandidatures).mockResolvedValue([serverRow()]);
    vi.mocked(decideCandidature).mockResolvedValue(
      serverRow({ statut: "Refusée", motif_refus: "Dossier incomplet ou pièce non conforme" })
    );
    renderWithProviders(<CandidatureQueue token="tok-1" onAudit={vi.fn()} />);
    fireEvent.click(await screen.findByRole("button", { name: /Refuser/i }));
    fireEvent.click(screen.getByRole("button", { name: "Dossier incomplet ou pièce non conforme" }));
    fireEvent.click(screen.getByRole("button", { name: /Confirmer le refus/i }));
    await waitFor(() =>
      expect(decideCandidature).toHaveBeenCalledWith("tok-1", "cand-2026-0142", "Refusée", {
        motif: "Dossier incomplet ou pièce non conforme",
        commentaire: undefined,
      })
    );
    expect(await screen.findByText("Refusée")).toBeInTheDocument();
  });
});
