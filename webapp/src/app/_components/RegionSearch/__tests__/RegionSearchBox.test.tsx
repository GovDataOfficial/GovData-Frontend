import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RegionSearchBox } from "@/app/_components/RegionSearch/RegionSearchBox";

describe("RegionSearchBox", () => {
  it("should render all state links", () => {
    render(<RegionSearchBox />);
    const allLinks = screen.getAllByRole("link");
    // global 'Bundesgebiet' + all states
    expect(allLinks).toHaveLength(17);
  });
});
