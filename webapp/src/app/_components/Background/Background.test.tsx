import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Background } from "@/app/_components/Background/Background";

describe("Background", () => {
  it("should set default background image as inline style of component", () => {
    const { container } = render(<Background />);
    const gdSearchDiv = container.querySelector(".gd-search");
    expect(gdSearchDiv?.getAttribute("style")).toContain(
      "background-image: url(",
    );
  });
});
