import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
// RTL's automatic afterEach(cleanup) only registers itself when it detects a
// global test-runner hook. This project keeps `globals` off (explicit
// imports everywhere), so cleanup is wired here instead — otherwise every
// render leaks into the next test's DOM.
afterEach(() => {
  cleanup();
});
// No test should depend on a real backend being reachable (behavior would
// then differ depending on whether a dev server happens to be running on
// the machine). Components that fetch on mount (e.g. NotificationsProvider)
// must degrade gracefully when this rejects; tests that need a specific
// response mock the relevant @/lib/api function directly instead, which
// bypasses this stub entirely.
vi.stubGlobal(
  "fetch",
  vi.fn(() => Promise.reject(new Error("network calls are disabled in tests; mock @/lib/api instead")))
);
