import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilterArea } from "@/app/_components/FilterArea";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
}));

describe("FilterArea", () => {
  it("should show filter area container with no children", () => {
    render(<FilterArea />);

    screen.getByRole("heading", { name: "Filtermöglichkeiten", level: 2 });

    const resetButton = screen.getAllByRole("link", {
      name: "Filter zurücksetzen",
    });
    expect(resetButton).toHaveLength(2);
  });

  it("should show only one reset button", () => {
    render(<FilterArea showResetBottomButton={false} />);

    screen.getByRole("heading", { name: "Filtermöglichkeiten", level: 2 });

    const resetButton = screen.getAllByRole("link", {
      name: "Filter zurücksetzen",
    });
    expect(resetButton).toHaveLength(1);
  });

  it("should render children", () => {
    render(
      <FilterArea>
        <div>i will be a child</div>
      </FilterArea>,
    );

    screen.getByText("i will be a child");
  });
});
