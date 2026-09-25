import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
// RTL's automatic afterEach(cleanup) only registers itself when it detects a
// global test-runner hook. This project keeps `globals` off (explicit
// imports everywhere), so cleanup is wired here instead — otherwise every
// render leaks into the next test's DOM.
afterEach(() => {
  cleanup();
});
