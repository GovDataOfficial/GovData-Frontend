import { beforeEach, describe, expect, it, vi } from "vitest";
import Page from "@/app/metadatenqualitaet/page";
import { notFound, redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

describe("MetaDatenQualität - Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("metadata_quality_dashboard_active", "1");
  });

  it("should redirect to another page", async () => {
    await Page();
    expect(vi.mocked(notFound)).not.toHaveBeenCalled();
    expect(vi.mocked(redirect)).toHaveBeenCalledWith(
      "/metadatenqualitaet/qualitaetsmerkmale",
    );
  });

  it("should call notFound if not active", async () => {
    vi.stubEnv("metadata_quality_dashboard_active", "");

    await Page();
    expect(vi.mocked(notFound)).toHaveBeenCalled();
  });
});
