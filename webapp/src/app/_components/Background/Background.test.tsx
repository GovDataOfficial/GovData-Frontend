import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { Background } from "@/app/_components/Background/Background";
import { isFeatureEnabled } from "@/app/_lib/features";

vi.mock("@/app/_lib/features", () => ({
  isFeatureEnabled: vi.fn(),
}));

describe("Background", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should set default background image as inline style of component", () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(true);
    const { container } = render(<Background />);
    const gdSearchDiv = container.querySelector(".gd-search");
    expect(gdSearchDiv?.getAttribute("style")).toContain(
      "background-image: url(",
    );
  });

  it("should not set a background image if disabled", () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(false);
    const { container } = render(<Background />);
    const gdSearchDiv = container.querySelector(".gd-search");
    const styleAttribute = gdSearchDiv?.getAttribute("style");
    expect(styleAttribute || "").not.toContain("background-image: url(");
  });
});
