import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { FilterMultiBox } from "@/app/erweitertesuche/inputs/FilterMultiBox";
import { defaultPlatformData } from "@/app/_lib/defaultFormData";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("FilterMultiBox", () => {
  const getCheckbox = (name: string) =>
    screen.getByRole("checkbox", { name }) as HTMLInputElement;

  it("should init with searchparams", () => {
    const searchParams = new URLSearchParams();
    searchParams.append("platforms", "android");
    searchParams.append("platforms", "linux");
    vi.mocked(useSearchParams).mockReturnValue(
      searchParams as ReadonlyURLSearchParams,
    );

    render(<FilterMultiBox type="platforms" data={defaultPlatformData} />);
    screen.getByText(/in system/i);

    expect(getCheckbox("Android").checked).toBeTruthy();
    expect(getCheckbox("iOS").checked).toBeFalsy();
    expect(getCheckbox("Web").checked).toBeFalsy();
    expect(getCheckbox("Linux").checked).toBeTruthy();
    expect(getCheckbox("Sonstige").checked).toBeFalsy();
  });
});
