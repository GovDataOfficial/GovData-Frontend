import { describe, expect, it, vi } from "vitest";
import { generateMetadata } from "./page";
import { fetchTypo3Data } from "@/app/_lib/getData";

vi.mock("@/app/_lib/getData", () => ({
  fetchTypo3Data: vi.fn(),
}));

describe("Impressum Page", () => {
  it("should set correct metadata with title", async () => {
    vi.mocked(fetchTypo3Data).mockResolvedValue({
      meta: { title: "mein Title" },
    } as any);
    const metadata = await generateMetadata();

    expect(metadata).toBeDefined();
    expect(metadata).toHaveProperty("title", "mein Title - GovData");
    expect(metadata.openGraph).toHaveProperty("title", "mein Title - GovData");

    expect(metadata).toHaveProperty("description", undefined);
    expect(metadata.openGraph).toHaveProperty("description", undefined);
  });

  it("should set correct metadata with title and description", async () => {
    vi.mocked(fetchTypo3Data).mockResolvedValue({
      meta: { title: "mein Title", description: "Test1234" },
    } as any);
    const metadata = await generateMetadata();

    expect(metadata).toBeDefined();
    expect(metadata).toHaveProperty("title", "mein Title - GovData");
    expect(metadata.openGraph).toHaveProperty("title", "mein Title - GovData");

    expect(metadata).toHaveProperty("description", "Test1234");
    expect(metadata.openGraph).toHaveProperty("description", "Test1234");
  });
});
