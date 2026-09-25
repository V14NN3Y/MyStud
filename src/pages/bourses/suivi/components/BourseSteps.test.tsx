import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "@/test/render";
import { etapesBourse } from "@/mocks/candidaturesBourse";
import BourseSteps from "./BourseSteps";
describe("BourseSteps", () => {
  it("renders one list item per step of the bourse workflow", () => {
    renderWithProviders(<BourseSteps statut="soumise" />);
    expect(screen.getAllByRole("listitem")).toHaveLength(etapesBourse.length);
    expect(screen.getByText("Candidature soumise")).toBeInTheDocument();
    expect(screen.getByText("Dossier clôturé")).toBeInTheDocument();
  });
  it("marks a terminal statut (rejetee) as done up to that point, never stuck 'en cours'", () => {
    renderWithProviders(<BourseSteps statut="rejetee" />);
    expect(screen.getAllByText("Terminé").length).toBeGreaterThan(0);
    expect(screen.queryByText("En cours")).not.toBeInTheDocument();
    expect(screen.getAllByText("À venir").length).toBeGreaterThan(0);
  });
  it("shows the optional message for the current step", () => {
    renderWithProviders(<BourseSteps statut="etude" message="Un agent examine votre dossier." />);
    expect(screen.getByText("Un agent examine votre dossier.")).toBeInTheDocument();
    expect(screen.getByText("En cours")).toBeInTheDocument();
  });
});
