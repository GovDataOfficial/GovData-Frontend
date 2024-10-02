import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { CommonSelect } from "@/app/erweitertesuche/inputs/CommonSelect";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("CommonSelect", () => {
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReadonlyURLSearchParams,
    );
  });

  const mockData = [
    { key: "123", label: "first" },
    { key: "345", label: "second" },
    { key: "678", label: "third" },
  ];

  it("should correctly label input", () => {
    render(<CommonSelect data={mockData} type={"licence"} />);
    const label = screen.getByText("in Lizenz");
    const idFor = label.getAttribute("for");

    const select = screen.getByRole("combobox", { name: "in Lizenz" });
    expect(select.getAttribute("id")).toEqual(idFor);
  });

  it("should set offscreen label", () => {
    render(<CommonSelect data={mockData} type={"licence"} />);

    const label = screen.getByText("in Lizenz");
    expect(label.classList).toContain("offscreen");
  });

  it("should set default value from search params", () => {
    const param = "licence=345";
    const params = new URLSearchParams(param) as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(params);

    render(<CommonSelect data={mockData} type={"licence"} />);

    const select = screen.getByRole("combobox", { name: "in Lizenz" });
    within(select).getByRole("option", { name: "second", selected: true });
  });
});
