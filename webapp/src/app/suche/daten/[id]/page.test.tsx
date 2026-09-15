import { describe, expect, it, vi } from "vitest";

import { fetchMetadata } from "@/app/_lib/getData";
import { metaDataTestProps } from "@/app/suche/__tests__/props";

import { generateMetadata } from "./page";

vi.mock("@/app/_lib/getData", () => ({
  fetchMetadata: vi.fn(),
}));

describe("Dataset Page", () => {
  it("should strip markdown from the meta description", async () => {
    vi.mocked(fetchMetadata).mockResolvedValue({
      ...metaDataTestProps,
      notes: "**Aktualisierungszyklus:**\n\n- keine Aktualisierung",
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "test-id" }),
    } as any);

    expect(metadata.description).toBe(
      "Aktualisierungszyklus: keine Aktualisierung",
    );
    expect(metadata.openGraph?.description).toBe(
      "Aktualisierungszyklus: keine Aktualisierung",
    );
  });

  it("should leave out the description if there are no notes", async () => {
    vi.mocked(fetchMetadata).mockResolvedValue({
      ...metaDataTestProps,
      notes: "",
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "test-id" }),
    } as any);

    expect(metadata).toHaveProperty("description", undefined);
  });
});
