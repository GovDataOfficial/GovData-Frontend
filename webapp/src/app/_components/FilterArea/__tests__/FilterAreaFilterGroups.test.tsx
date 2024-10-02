import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilterAreaFilterGroups } from "@/app/_components/FilterArea";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
}));

describe("FilterAreaFilterGroups", () => {
  it("should render nothing if filtermap does not contain key", () => {
    const { container } = render(<FilterAreaFilterGroups filterMap={{}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should not render the hvd filter length is empty", () => {
    render(<FilterAreaFilterGroups filterMap={{ hvd: { facetList: [] } }} />);
    const hvdText = screen.queryByText("Hochwertige Datensätze");
    expect(hvdText).not.toBeInTheDocument();
  });

  it("should create the hvd filter", () => {
    render(
      <FilterAreaFilterGroups
        filterMap={{ hvd: { facetList: [{ name: "has_hvd", docCount: 1 }] } }}
      />,
    );
    const hvdText = screen.getByText("Hochwertige Datensätze");
    const link = screen.getByRole("link", {
      name: /nur hochwertige datensätze/i,
    });

    expect(hvdText).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });
});
