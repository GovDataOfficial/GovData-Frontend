import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Time } from "@/app/_components/Time/Time";

describe("Time", () => {
  it("should correctly render a time tag with formatted text", () => {
    render(<Time date="2016-01-01T00:00:00" />);

    const text = screen.getByText("01.01.2016");
    expect(text.tagName).toBe("TIME");
    expect(text.getAttribute("datetime")).toBe("2016-01-01T00:00:00");
  });

  it("should correctly render a time tag with custom format opts", () => {
    render(
      <Time
        date="2016-01-01T00:00:00"
        format={{ month: "long", year: "numeric" }}
      />,
    );

    const text = screen.getByText("Januar 2016");
    expect(text.tagName).toBe("TIME");
    expect(text.getAttribute("datetime")).toBe("2016-01-01T00:00:00");
  });
});
