import { beforeEach, describe, vi, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilterTags } from "@/app/erweitertesuche/inputs/FilterTags";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("Filtertags", () => {
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReadonlyURLSearchParams,
    );
  });

  it("should init with correct placeholder", () => {
    render(<FilterTags />);
    const input = screen.getByRole("textbox", { name: /in schlagwörter/i });

    expect(input.getAttribute("placeholder")).toBe(
      "Format: Schlagwort, Schlagwort, Schlagwort",
    );
  });

  it("should from searchparams", () => {
    const searchParams = new URLSearchParams();
    searchParams.append("tags", "Hallo");
    searchParams.append("tags", "wie");
    searchParams.append("tags", "gehts");

    vi.mocked(useSearchParams).mockReturnValue(
      searchParams as ReadonlyURLSearchParams,
    );

    render(<FilterTags />);
    // checking all inputs
    const inputs = screen.getAllByRole("textbox", { hidden: true });

    expect(inputs[0].getAttribute("hidden")).toBeNull();

    expect(inputs[1].getAttribute("hidden")).toBe("");
    expect(inputs[1].getAttribute("value")).toBe("hallo");

    expect(inputs[2].getAttribute("hidden")).toBe("");
    expect(inputs[2].getAttribute("value")).toBe("wie");

    expect(inputs[3].getAttribute("hidden")).toBe("");
    expect(inputs[3].getAttribute("value")).toBe("gehts");
  });
});
