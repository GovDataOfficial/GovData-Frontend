import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CommonInputText } from "@/app/erweitertesuche/inputs/CommonInputText";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("CommonInputText", () => {
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReadonlyURLSearchParams,
    );
  });

  it("should correctly label input", () => {
    render(<CommonInputText type={"showcase_types"} />);

    const label = screen.getByText("in Anwendungstyp");
    const idFor = label.getAttribute("for");

    const input = screen.getByRole("textbox", { name: /in anwendungstyp/i });
    expect(input.getAttribute("id")).toEqual(idFor);
  });

  it("should set offscreen label", () => {
    render(<CommonInputText type={"showcase_types"} />);

    const label = screen.getByText("in Anwendungstyp");
    expect(label.classList).toContain("offscreen");
  });

  it("should have correct placeholder", () => {
    render(<CommonInputText type={"showcase_types"} />);

    const input = screen.getByRole("textbox", { name: /in anwendungstyp/i });
    const placeHolder = input.getAttribute("placeholder");
    expect(placeHolder).toEqual("Bitte geben Sie einen Suchbegriff ein");
  });

  it("should set default value from search params", () => {
    const param = "showcase_types=123";
    const params = new URLSearchParams(param) as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(params);

    render(<CommonInputText type={"showcase_types"} />);
    const input = screen.getByRole("textbox", { name: /in anwendungstyp/i });
    expect(input.getAttribute("value")).toBe("123");
  });
});
