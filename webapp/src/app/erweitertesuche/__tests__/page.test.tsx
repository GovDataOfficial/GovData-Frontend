import { describe, expect, it } from "vitest";

import { metadata } from "../page";

describe("Extended Search Page", () => {
  it("should set correct metadata", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toMatch(/^Erweiterte Suche -/);
    expect(metadata.openGraph?.title).toMatch(/^Erweiterte Suche -/);
  });
});
