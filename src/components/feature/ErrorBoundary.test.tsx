import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";
function Boom(): never {
  throw new Error("boom");
}
describe("ErrorBoundary", () => {
  it("renders children normally when nothing throws", () => {
    render(
      <ErrorBoundary>
        <p>Contenu normal</p>
      </ErrorBoundary>
    );
    expect(screen.getByText("Contenu normal")).toBeInTheDocument();
  });
  it("catches a render error and shows the French fallback instead of a blank app", () => {
    // React logs the error to the console by design; keep the test output clean.
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText("Une erreur inattendue est survenue")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /recharger la page/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /retour à l'accueil/i })).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
