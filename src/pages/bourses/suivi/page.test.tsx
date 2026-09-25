import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, renderWithProviders, screen, waitFor } from "@/test/render";
import BourseSuivi from "./page";
vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    listBourseCandidatures: vi.fn(),
    createBourseCandidature: vi.fn(),
    deleteBourseCandidature: vi.fn(),
  };
});
import { createBourseCandidature, deleteBourseCandidature, listBourseCandidatures } from "@/lib/api";
const row = (over: Partial<Record<string, unknown>> = {}) => ({
  id: "cb-1",
  programme_id: "bourse-bac",
  programme: "Bourse nationale du nouveau bachelier",
  organisme: "Ministère de l'Enseignement Supérieur",
  montant: "Prise en charge complète",
  reference: "MYSTUD-BRS-2026-004871",
  statut: "etude",
  montant_accorde: "—",
  date_depot: "2026-09-04T09:00:00.000Z",
  message: "Votre dossier est en cours d'instruction par le service des bourses.",
  updated_at: "2026-09-16T09:00:00.000Z",
  ...over,
});
describe("BourseSuivi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("loads the real candidature list from the backend", async () => {
    vi.mocked(listBourseCandidatures).mockResolvedValue([row()]);
    renderWithProviders(<BourseSuivi />);
    expect(await screen.findByText("Bourse nationale du nouveau bachelier")).toBeInTheDocument();
  });
  it("shows an offline notice instead of a false 'no candidature' empty state", async () => {
    vi.mocked(listBourseCandidatures).mockRejectedValue(new Error("boom"));
    renderWithProviders(<BourseSuivi />);
    expect(await screen.findByText("Backend indisponible")).toBeInTheDocument();
    expect(screen.queryByText("Aucune candidature de bourse")).not.toBeInTheDocument();
  });
  it("submitting the wizard persists the candidature and shows it in the list", async () => {
    vi.mocked(listBourseCandidatures).mockResolvedValue([]);
    vi.mocked(createBourseCandidature).mockResolvedValue(
      row({ id: "cb-new", programme: "Aide sociale étudiante", statut: "soumise" })
    );
    renderWithProviders(<BourseSuivi />);
    await screen.findByText("Aucune candidature de bourse");
    fireEvent.click(screen.getAllByText("Nouvelle candidature")[0]);
    fireEvent.click(await screen.findByText(/Aide sociale étudiante/));
    fireEvent.click(screen.getByText("Continuer"));
    fireEvent.click(screen.getByText("Continuer"));
    fireEvent.click(screen.getByText("Continuer"));
    fireEvent.click(screen.getByText("Déposer ma candidature"));
    await waitFor(() => expect(createBourseCandidature).toHaveBeenCalled());
    expect(await screen.findByText("Candidature de bourse déposée")).toBeInTheDocument();
  });
  it("withdrawing removes the candidature and calls the real DELETE", async () => {
    vi.mocked(listBourseCandidatures).mockResolvedValue([row()]);
    vi.mocked(deleteBourseCandidature).mockResolvedValue(undefined);
    renderWithProviders(<BourseSuivi />);
    await screen.findByText("Bourse nationale du nouveau bachelier");
    fireEvent.click(screen.getByText("Retirer de ma liste"));
    await waitFor(() => expect(deleteBourseCandidature).toHaveBeenCalledWith("cb-1"));
    expect(screen.queryByText("Bourse nationale du nouveau bachelier")).not.toBeInTheDocument();
  });
  it("restores the candidature if withdrawing fails on the backend", async () => {
    vi.mocked(listBourseCandidatures).mockResolvedValue([row()]);
    vi.mocked(deleteBourseCandidature).mockRejectedValue(new Error("boom"));
    renderWithProviders(<BourseSuivi />);
    await screen.findByText("Bourse nationale du nouveau bachelier");
    fireEvent.click(screen.getByText("Retirer de ma liste"));
    await waitFor(() => expect(deleteBourseCandidature).toHaveBeenCalled());
    expect(await screen.findByText("Bourse nationale du nouveau bachelier")).toBeInTheDocument();
  });
});
