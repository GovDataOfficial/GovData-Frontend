import { describe, expect, it } from "vitest";
import { metadata } from "../page";

describe("Extended Search Page", () => {
  it("should set correct metadata", () => {
    expect(metadata).toBeDefined();
    expect(metadata).toHaveProperty("title", "Erweiterte Suche - GovData");
    expect(metadata.openGraph).toHaveProperty(
      "title",
      "Erweiterte Suche - GovData",
    );
  });
});
