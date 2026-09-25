import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, renderWithProviders, screen, waitFor } from "@/test/render";
import NotesValidation from "./NotesValidation";
vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return { ...actual, listNotesValidations: vi.fn(), validateNotes: vi.fn() };
});
import { listNotesValidations, validateNotes } from "@/lib/api";
describe("NotesValidation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("shows the mock content while there is no session token", () => {
    renderWithProviders(<NotesValidation token={null} onAudit={vi.fn()} />);
    expect(screen.getByText(/INF401/)).toBeInTheDocument();
    expect(listNotesValidations).not.toHaveBeenCalled();
  });
  it("validating a UE persists the change and reports an audit event", async () => {
    vi.mocked(listNotesValidations).mockResolvedValue([
      { id: "not-inf401", ue: "INF401 — Algorithmique avancée", enseignant: "Dr. BIAOU", effectif: 178, moyenne_classe: 13.2, statut: "À valider", validated_at: null },
    ]);
    vi.mocked(validateNotes).mockResolvedValue({
      id: "not-inf401", ue: "INF401 — Algorithmique avancée", enseignant: "Dr. BIAOU", effectif: 178, moyenne_classe: 13.2, statut: "Validée", validated_at: "2026-09-26T10:00:00.000Z",
    });
    const onAudit = vi.fn();
    renderWithProviders(<NotesValidation token="tok-1" onAudit={onAudit} />);
    const button = await screen.findByRole("button", { name: /Valider/i });
    fireEvent.click(button);
    expect(onAudit).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(validateNotes).toHaveBeenCalledWith("tok-1", "not-inf401"));
    expect(await screen.findByText("Validée")).toBeInTheDocument();
  });
});
