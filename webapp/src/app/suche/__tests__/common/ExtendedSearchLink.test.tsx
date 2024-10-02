import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExtendedSearchLink } from "@/app/suche/_components/common/ExtendedSearchLink";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("ExtendedSearchLink", () => {
  const params = new URLSearchParams(
    "groups=all&foo=1&query=test&type=4",
  ) as ReadonlyURLSearchParams;

  it("should return a link with valid filters to external search page", () => {
    vi.mocked(useSearchParams).mockReturnValue(params);

    render(<ExtendedSearchLink />);
    const link = screen.getByRole("link", { name: /erweiterte suche/i });
    expect(link).toHaveAttribute("href", "/erweitertesuche?groups=all&type=4");
  });
});
