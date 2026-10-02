import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Nettoie automatiquement les arbres DOM après chaque test.
afterEach(() => {
  cleanup();
});
