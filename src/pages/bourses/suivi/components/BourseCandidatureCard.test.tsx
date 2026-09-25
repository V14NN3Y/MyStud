import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, renderWithProviders, screen, waitFor } from "@/test/render";
import BourseCandidatureCard, { type CandidatureBourse } from "./BourseCandidatureCard";
vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return { ...actual, deposerPiecesBourse: vi.fn() };
});
import { deposerPiecesBourse } from "@/lib/api";
const candidature: CandidatureBourse = {
  id: "cb-2",
  programmeId: "aide-sociale",
  programme: "Aide sociale étudiante",
  organisme: "Ministère des Affaires Sociales",
  montant: "Jusqu'à 25 000 FCFA / mois",
  reference: "MYSTUD-BRS-2026-004986",
  statut: "complement",
  montantAccorde: "—",
  dateDepot: "28 août 2026",
  majLe: "12 septembre 2026",
  message: "Une pièce complémentaire est demandée.",
};
describe("BourseCandidatureCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("submitting the missing documents persists the transition out of 'complement'", async () => {
    vi.mocked(deposerPiecesBourse).mockResolvedValue({
      id: "cb-2",
      programme_id: "aide-sociale",
      programme: "Aide sociale étudiante",
      organisme: "Ministère des Affaires Sociales",
      montant: "Jusqu'à 25 000 FCFA / mois",
      reference: "MYSTUD-BRS-2026-004986",
      statut: "etude",
      montant_accorde: "—",
      date_depot: "2026-08-28T09:00:00.000Z",
      message: "Les pièces complémentaires ont été reçues ; votre dossier retourne en instruction.",
      updated_at: "2026-09-26T10:00:00.000Z",
    });
    const onUpdated = vi.fn();
    renderWithProviders(<BourseCandidatureCard candidature={candidature} onRemove={vi.fn()} onUpdated={onUpdated} />);
    fireEvent.click(screen.getByText("J'ai déposé ces pièces"));
    await waitFor(() => expect(deposerPiecesBourse).toHaveBeenCalledWith("cb-2"));
    await waitFor(() => expect(onUpdated).toHaveBeenCalledWith(expect.objectContaining({ statut: "etude" })));
  });
  it("shows an error and keeps the panel when the backend refuses", async () => {
    vi.mocked(deposerPiecesBourse).mockRejectedValue(new Error("Cette candidature n'attend pas de pièce complémentaire."));
    renderWithProviders(<BourseCandidatureCard candidature={candidature} onRemove={vi.fn()} onUpdated={vi.fn()} />);
    fireEvent.click(screen.getByText("J'ai déposé ces pièces"));
    expect(await screen.findByText("Cette candidature n'attend pas de pièce complémentaire.")).toBeInTheDocument();
  });
});
