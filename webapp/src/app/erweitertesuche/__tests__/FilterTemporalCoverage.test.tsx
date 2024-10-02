import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilterTemporalCoverage } from "@/app/erweitertesuche/inputs/FilterTemporalCoverage";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("FilterTemporalCoverage", () => {
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReadonlyURLSearchParams,
    );
  });

  it("should have correct offscreen label set input names", () => {
    render(<FilterTemporalCoverage />);

    const offscreenLabel = screen.getByText(/in zeitbezug/i);
    expect(offscreenLabel.classList).toContain("offscreen");
  });

  it("should correctly set important attributes", () => {
    render(<FilterTemporalCoverage />);

    const startInput = screen.getByLabelText(/von:/i);
    expect(startInput.getAttribute("name")).toBe("start");
    expect(startInput.getAttribute("type")).toBe("date");

    const endInput = screen.getByLabelText(/bis:/i);
    expect(endInput.getAttribute("name")).toBe("end");
    expect(endInput.getAttribute("type")).toBe("date");
  });

  it("should init correctly with searchparams", () => {
    const searchParams = new URLSearchParams();
    searchParams.set("start", "2024-05-01");
    searchParams.set("end", "2024-10-19");
    vi.mocked(useSearchParams).mockReturnValue(
      searchParams as ReadonlyURLSearchParams,
    );
    render(<FilterTemporalCoverage />);
    const inputStart = screen.getByLabelText(/von:/i);
    const inputEnd = screen.getByLabelText(/bis:/i);

    expect(inputStart.getAttribute("value")).toBe("2024-05-01");
    expect(inputEnd.getAttribute("value")).toBe("2024-10-19");
  });
});
