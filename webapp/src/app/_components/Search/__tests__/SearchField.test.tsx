import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { SearchField } from "@/app/_components/Search/SearchField";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("SearchField", () => {
  const params = "publisher=12&type=dataset";

  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(params) as ReadonlyURLSearchParams,
    );
  });

  it("should not keep params as hidden inputs", () => {
    const { container } = render(<SearchField />);
    const hiddenInputs = container.querySelectorAll("input[type='hidden']");
    expect(hiddenInputs).toHaveLength(0);
  });

  // for when navigation on the same search page with filters
  it("should keep params as hidden inputs", () => {
    const { container } = render(<SearchField keepFiltersForSearch />);
    const hiddenInputs = container.querySelectorAll("input[type='hidden']");
    expect(hiddenInputs).toHaveLength(2);
  });
});
