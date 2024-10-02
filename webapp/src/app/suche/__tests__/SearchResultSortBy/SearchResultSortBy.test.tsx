import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SearchResultSortBy } from "@/app/suche/_components/SearchResultSortBy/SearchResultSortBy";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("SearchResultsSortBy", () => {
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReadonlyURLSearchParams,
    );
  });

  it("should render correct", () => {
    render(<SearchResultSortBy />);

    screen.getByRole("button", {
      name: "Relevanz absteigend",
    });

    const list = screen.getByRole("list", { hidden: true });
    const listBoxLinks = within(list).getAllByRole("link", { hidden: true });

    expect(listBoxLinks.length).toBe(6);
    expect(listBoxLinks[0].textContent).toBe("Relevanz aufsteigend");
  });
});
