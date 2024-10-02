import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchResultsEmpty } from "@/app/suche/_components/SearchResults/SearchResultsEmpty";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("SearchResultsEmpty", () => {
  const withQuery = new URLSearchParams("q=huhu") as ReadonlyURLSearchParams;

  it("should render a linked list with suggestions", () => {
    vi.mocked(useSearchParams).mockReturnValue(withQuery);

    render(
      <SearchResultsEmpty
        suggestions={[
          { name: "hallo123", score: 1 },
          { name: "hoihoi", score: 2 },
        ]}
      />,
    );
    screen.getByText(/meinten sie vielleicht/i);
    const link1 = screen.getByRole("link", { name: /hallo123/i });
    const link2 = screen.getByRole("link", { name: /hoihoi/i });

    expect(link1).toHaveAttribute("href", "/suche?q=hallo123");
    expect(link2).toHaveAttribute("href", "/suche?q=hoihoi");
  });

  it("should not render suggestions if none are givens", () => {
    vi.mocked(useSearchParams).mockReturnValue(withQuery);

    render(<SearchResultsEmpty suggestions={[]} />);
    const didYouMeanText = screen.queryByText(/meinten sie vielleicht/i);
    expect(didYouMeanText).toBeNull();
  });
});
