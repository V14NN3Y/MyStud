import { describe, expect, it } from "vitest";
import { renderWithProviders, screen, within } from "@/test/render";
import NotFound from "./NotFound";
describe("NotFound", () => {
  it("renders a French, on-brand message instead of the raw builder placeholder", () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText("Cette page n'existe pas ou n'a pas encore été créée")).toBeInTheDocument();
    expect(screen.queryByText(/this page has not been generated/i)).not.toBeInTheDocument();
  });
  it("shows the path the visitor tried to reach", () => {
    renderWithProviders(<NotFound />, { route: "/route-inexistante-xyz" });
    expect(screen.getByText("/route-inexistante-xyz")).toBeInTheDocument();
  });
  it("offers shortcuts back into the site", () => {
    renderWithProviders(<NotFound />);
    // Scoped to <main>: "Formations" also appears as a nav-bar link, which
    // would otherwise make the query ambiguous.
    const shortcuts = within(screen.getByRole("main"));
    expect(shortcuts.getByRole("link", { name: /formations/i })).toHaveAttribute("href", "/formations");
    expect(shortcuts.getByRole("link", { name: /questions fréquentes/i })).toHaveAttribute("href", "/faq");
  });
});
