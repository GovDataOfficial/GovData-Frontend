import { describe, expect, it, vi } from "vitest";
import InformationPage from "../page";
import { notFound, redirect } from "next/navigation";
import { fetchTypo3Data } from "@/app/_lib/getData";

vi.mock("@/app/_lib/getData", () => ({
  fetchTypo3Data: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

const mockTypo3Data = {
  id: 1,
  meta: { title: "test", description: "" },
  content: {
    colPos0: [
      {
        type: "menu_subpages" as const,
        id: 1,
        content: {
          menu: [
            { title: "First Sub Page Of Information", link: "/info/1" },
            { title: "Second Page", link: "/info/mehr" },
          ],
        },
      },
    ],
  },
};

describe("Information Page", () => {
  it("should call redirect", async () => {
    vi.mocked(fetchTypo3Data).mockResolvedValue(mockTypo3Data);
    await InformationPage();
    expect(redirect).toHaveBeenCalledWith("/info/1");
  });

  it("should call notFound", async () => {
    vi.mocked(fetchTypo3Data).mockResolvedValue(undefined);
    await InformationPage();
    expect(notFound).toHaveBeenCalled();
  });
});
