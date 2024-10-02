import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimeRange } from "@/app/_components/Time/TimeRange";

describe("TimeRange", () => {
  it("should render an accessible time range", () => {
    render(<TimeRange from="2016-01-01T00:00:00" to="2018-01-01T00:00:00" />);

    const fromText = screen.getByText("von");
    expect(fromText.classList).toContain("sr-only");

    screen.getByText("01.01.2016");

    const dash = screen.getByText("-");
    expect(dash.getAttribute("aria-hidden")).toBe("true");

    const toText = screen.getByText("bis");
    expect(toText.classList).toContain("sr-only");

    screen.getByText("01.01.2018");
  });
});
