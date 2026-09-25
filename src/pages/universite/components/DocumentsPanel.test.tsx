import { describe, expect, it, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test/render";
import DocumentsPanel from "./DocumentsPanel";
vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, uploadDocument: vi.fn(), getDocumentLink: vi.fn() };
});
import { uploadDocument, getDocumentLink } from "@/lib/api";
describe("DocumentsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("shows an offline notice and disables submission without a session token", () => {
    renderWithProviders(<DocumentsPanel token={null} onAudit={vi.fn()} />);
    expect(screen.getByText(/backend indisponible/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /générer le document/i })).toBeDisabled();
  });
  it("uploads the file, mints a download link, and reports an audit event", async () => {
    vi.mocked(uploadDocument).mockResolvedValue({ id: "doc-1" });
    vi.mocked(getDocumentLink).mockResolvedValue({
      url: "/api/documents/download/signed-token",
      expiresInSeconds: 300,
    });
    const onAudit = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<DocumentsPanel token="tok-abc" onAudit={onAudit} />);
    const file = new File(["contenu"], "certificat.pdf", { type: "application/pdf" });
    await user.upload(screen.getByLabelText(/fichier/i), file);
    await user.click(screen.getByRole("button", { name: /générer le document/i }));
    await waitFor(() => expect(screen.getByText(/lien de téléchargement généré/i)).toBeInTheDocument());
    expect(uploadDocument).toHaveBeenCalledWith("tok-abc", file, expect.any(String));
    expect(getDocumentLink).toHaveBeenCalledWith("tok-abc", "doc-1", expect.any(String));
    expect(onAudit).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/signed-token/)).toBeInTheDocument();
  });
  it("shows an error instead of a link when generation fails", async () => {
    vi.mocked(uploadDocument).mockRejectedValue(new Error("boom"));
    const user = userEvent.setup();
    renderWithProviders(<DocumentsPanel token="tok-abc" onAudit={vi.fn()} />);
    const file = new File(["contenu"], "certificat.pdf", { type: "application/pdf" });
    await user.upload(screen.getByLabelText(/fichier/i), file);
    await user.click(screen.getByRole("button", { name: /générer le document/i }));
    await waitFor(() => expect(screen.getByText(/la génération du document a échoué/i)).toBeInTheDocument());
    expect(screen.queryByText(/lien de téléchargement généré/i)).not.toBeInTheDocument();
  });
});
