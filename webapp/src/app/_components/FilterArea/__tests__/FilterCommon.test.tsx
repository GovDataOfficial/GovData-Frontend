import { describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import { FilterCommon } from "@/app/_components/FilterArea/filters/FilterCommon";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
}));

describe("FilterCommon", () => {
  it("should open details accordion and show correct filters with name", async () => {
    const testFacetList = [
      { name: "testItem1", docCount: 123 },
      { name: "testitem2", docCount: 110, displayName: "Mein Item 2" },
    ];
    const user = userEvent.setup();
    render(<FilterCommon name="test" facetList={testFacetList} />);

    const detailsSummaryGroup = screen.getByRole("group");
    const summary = within(detailsSummaryGroup).getByText("filter.test.title");

    // open accordion
    expect(detailsSummaryGroup).not.toHaveAttribute("open");
    await act(() => user.click(summary));
    expect(detailsSummaryGroup).toHaveAttribute("open");

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);

    // text is mangled together here because of toHaveTextContent
    // but result count and title text are in seperate html elements.
    // it is oke for screen reader !
    expect(listItems[0]).toHaveTextContent("testItem1123 Treffer");
    expect(listItems[1]).toHaveTextContent("Mein Item 2110 Treffer");
  });

  it("should sort list items by doccount", async () => {
    const testFacetList = [
      { name: "item1-", docCount: 123 },
      { name: "item2-", docCount: 1102 },
      { name: "item3-", docCount: 2003 },
      { name: "item4-", docCount: 202 },
    ];

    render(<FilterCommon name="test" facetList={testFacetList} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(4);
    expect(listItems[0]).toHaveTextContent("item3-2.003 Treffer");
    expect(listItems[1]).toHaveTextContent("item2-1.102 Treffer");
    expect(listItems[2]).toHaveTextContent("item4-202 Treffer");
    expect(listItems[3]).toHaveTextContent("item1-123 Treffer");
  });

  it("should sort list items by name for groups", async () => {
    const testFacetList = [
      { name: "item1-", docCount: 123, displayName: "Dede-" },
      { name: "item2-", docCount: 1102, displayName: "Coco-" },
      { name: "item3-", docCount: 2003, displayName: "Borg-" },
      { name: "item4-", docCount: 202, displayName: "Arg-" },
    ];

    render(<FilterCommon name="groups" facetList={testFacetList} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(4);
    expect(listItems[0]).toHaveTextContent("Arg-202 Treffer");
    expect(listItems[1]).toHaveTextContent("Borg-2.003 Treffer");
    expect(listItems[2]).toHaveTextContent("Coco-1.102 Treffer");
    expect(listItems[3]).toHaveTextContent("Dede-123 Treffer");
  });
});
