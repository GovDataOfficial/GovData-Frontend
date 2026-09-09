import { describe, expect, it, vi } from "vitest";
import { notFound } from "next/navigation";

import InformationSlugPage from "../[slug]/page";

vi.mock("@/app/_lib/getData", () => ({
  fetchTypo3Data: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

describe("Information Slug Page", () => {
  it("should redirect to not-found page", async () => {
    await InformationSlugPage({
      params: Promise.resolve({ slug: "test" }),
      searchParams: Promise.resolve({}),
    });
    expect(notFound).toHaveBeenCalled();
  });
});
