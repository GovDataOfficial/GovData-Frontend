// @vitest-environment node

import { describe, expect, it } from "vitest";

import { metaDataGenerator } from "@/app/_lib/getMetaData";

describe("metaDataGenerator", () => {
  it("should leave out the description if there is none", () => {
    const metadata = metaDataGenerator({ title: "title" });

    expect(metadata).toHaveProperty("description", undefined);
    expect(metadata.openGraph).toHaveProperty("description", undefined);
  });

  it("should keep a short description untouched", () => {
    const metadata = metaDataGenerator({
      title: "title",
      description: "kurze Beschreibung",
    });

    expect(metadata.description).toBe("kurze Beschreibung");
    expect(metadata.openGraph?.description).toBe("kurze Beschreibung");
  });

  it("should truncate a long description at a word boundary", () => {
    const description =
      "Die Datensammlung enthält die amtliche Straßen- und Hausnummernliste " +
      "der Universitäts- und Hansestadt Greifswald. Aktualisierungszyklus: " +
      "Eine regelmäßige Aktualisierung erfolgt nicht.";

    const truncated = metaDataGenerator({ title: "title", description })
      .description as string;

    expect(truncated).toBe(
      "Die Datensammlung enthält die amtliche Straßen- und Hausnummernliste " +
        "der Universitäts- und Hansestadt Greifswald. Aktualisierungszyklus: " +
        "Eine regelmäßige...",
    );
    expect(truncated.length).toBeLessThanOrEqual(160);
    // the last word must not be cut in half
    expect(description).toContain(truncated.replace("...", ""));
  });

  it("should truncate without a word boundary as well", () => {
    const description = "a".repeat(200);

    expect(metaDataGenerator({ title: "title", description }).description).toBe(
      "a".repeat(157) + "...",
    );
  });
});
