import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { SearchResultsContainer } from "@/app/suche/_components/SearchResults/SearchResultsContainer";
import { SearchResults } from "@/types/types";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import { SearchResultsEmpty } from "@/app/suche/_components/SearchResults/SearchResultsEmpty";

describe("SearchResultsContainer", () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: () => ({
        hits: [
          {
            id: "my-loaded-hit",
            name: "loadedhit",
            type: "dataset",
            content: "",
          },
        ],
      }),
    });
  });

  const mockSearchResults = {
    scrollId: "aaabbb",
    filterMap: {},
    cleanedActiveFilters: {},
    hits: [{ id: "123", name: "test", type: "dataset", content: "" }],
    hitsTotal: 1,
    moreNextHitsAvailable: false,
    pageSize: 10,
  } as SearchResults;

  const withMoreNextHits = {
    ...mockSearchResults,
    hitsTotal: 5,
  };

  it("should render a result hit with correct id for focus handling", () => {
    render(<SearchResultsContainer data={mockSearchResults} />);
    const listItem = screen.getByRole("listitem");
    expect(listItem).toHaveAttribute("id", "search-result-hit-123");
  });

  it("should render an offsreen live aria element", () => {
    render(<SearchResultsContainer data={mockSearchResults} />);
    const status = screen.getByRole("status");
    expect(status).toHaveClass("offscreen");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("");
  });

  it("should not show load more button if no more hits available", () => {
    render(<SearchResultsContainer data={mockSearchResults} />);
    const button = screen.queryByRole("button", {
      name: /.* weitere anzeigen/i,
    });
    expect(button).not.toBeInTheDocument();
  });

  it("should show load more button if no more hits are available", async () => {
    const user = userEvent.setup();

    render(<SearchResultsContainer data={withMoreNextHits} />);
    const loadMoreButton = screen.getByRole("button", {
      name: /4 weitere anzeigen/i,
    });

    await act(() => user.click(loadMoreButton));
    expect(global.fetch).toHaveBeenCalledWith("/api/scroll?scrollId=aaabbb");

    const listitemsAfterload = screen.getAllByRole("listitem");
    expect(listitemsAfterload).toHaveLength(2);
    expect(listitemsAfterload[1]).toHaveFocus();
    screen.getByRole("button", {
      name: /3 weitere anzeigen/i,
    });
  });

  it("should show alert badge on fetch error", async () => {
    global.fetch = vi.fn().mockRejectedValue({});
    const user = userEvent.setup();
    render(<SearchResultsContainer data={withMoreNextHits} />);
    const loadMoreButton = screen.getByRole("button", {
      name: /.* weitere anzeigen/i,
    });

    await act(() => user.click(loadMoreButton));
    expect(global.fetch).toHaveBeenCalledWith("/api/scroll?scrollId=aaabbb");

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(
      "Die Daten können momentan nicht abgerufen werden. Bitte laden Sie die Seite neu.",
    );
  });

  it("should set load more button amount according to page size", async () => {
    const withPageSize20 = {
      ...mockSearchResults,
      pageSize: 16,
      hitsTotal: 200,
    };
    render(<SearchResultsContainer data={withPageSize20} />);
    screen.getByRole("button", { name: "16 weitere anzeigen" });
  });
});
