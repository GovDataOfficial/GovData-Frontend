import { describe, expect, it, vi } from "vitest";

import { metadata } from "../page";

describe("Kartensuche Page", () => {
  it("should set correct metadata ", async () => {
    expect(metadata).toBeDefined();

    expect(metadata.title).toMatch(/^Kartensuche -/);
    expect(metadata.openGraph?.title).toMatch(/^Kartensuche -/);

    expect(metadata).toHaveProperty(
      "description",
      "Diese geografische Suche sucht nach Datensätzen im gesamten Katalog, die Angaben zur geografischen Lokalisation enthalten.",
    );
    expect(metadata.openGraph).toHaveProperty(
      "description",
      "Diese geografische Suche sucht nach Datensätzen im gesamten Katalog, die Angaben zur geografischen Lokalisation enthalten.",
    );
  });
});
