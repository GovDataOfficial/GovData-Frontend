import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { FilterAreaResetButton } from "../FilterAreaResetButton";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("FilterAreaResetButton", () => {
  const searchParamsWithQuery = new URLSearchParams(
    "groups=all&foo=1&q=test&type=4",
  ) as ReadonlyURLSearchParams;

  const searchParamsWithoutQuery = new URLSearchParams(
    "groups=all&foo=1&type=4",
  ) as ReadonlyURLSearchParams;

  it("should remove all filters and create a link empty query", () => {
    vi.mocked(useSearchParams).mockReturnValue(searchParamsWithoutQuery);

    render(<FilterAreaResetButton />);
    const link = screen.getByRole("link", { name: /filter zurücksetzen/i });
    expect(link).toHaveAttribute("href", "?");
  });

  it("should keep query param", () => {
    vi.mocked(useSearchParams).mockReturnValue(searchParamsWithQuery);

    render(<FilterAreaResetButton />);
    const link = screen.getByRole("link", { name: /filter zurücksetzen/i });
    expect(link).toHaveAttribute("href", "?q=test");
  });
});
