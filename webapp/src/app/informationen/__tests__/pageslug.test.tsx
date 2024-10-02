import { describe, expect, it, vi } from "vitest";
import InformationSlugPage from "../[slug]/page";
import { notFound } from "next/navigation";

vi.mock("@/app/_lib/getData", () => ({
  fetchTypo3Data: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

describe("Information Slug Page", () => {
  it("should redirect to not-found page", async () => {
    await InformationSlugPage({ params: { slug: "test" }, searchParams: {} });
    expect(notFound).toHaveBeenCalled();
  });
});
