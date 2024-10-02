import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { InfoIcon } from "@/app/_components/InfoIcon/InfoIcon";
import userEvent from "@testing-library/user-event";

describe("InfoIcon", () => {
  it("should correctly set attributes on opening and closing", async () => {
    const user = userEvent.setup();
    render(<InfoIcon title={"TEST"}>hallo123</InfoIcon>);

    const button = screen.getByRole("button", { name: /test/i });
    const text = screen.getByText("hallo123");

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(text.getAttribute("aria-hidden")).toBe("true");
    const buttonControls = button.getAttribute("aria-controls");
    expect(text.getAttribute("id")).toEqual(buttonControls);

    await act(() => user.click(button));
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(text.getAttribute("aria-hidden")).toBe("false");

    await act(() => user.click(button));
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(text.getAttribute("aria-hidden")).toBe("true");
  });
});
