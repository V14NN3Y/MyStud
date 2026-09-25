import { describe, expect, it } from "vitest";
import routes from "./config";
describe("router config", () => {
  it("declares every path exactly once", () => {
    const paths = routes.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("keeps the catch-all fallback last so no real route is shadowed", () => {
    const catchAllIndex = routes.findIndex((route) => route.path === "*");
    expect(catchAllIndex).toBe(routes.length - 1);
  });
  it("gives every route a non-empty element", () => {
    for (const route of routes) {
      expect(route.element).toBeTruthy();
    }
  });
});
