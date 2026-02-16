import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { UmbrellaBrandHeader } from "@/app/_components/UmbrellaBrandHeader/UmbrellaBrandHeader";
import { isFeatureEnabled } from "@/app/_lib/features";

describe("UmbrellaBrandHeader", () => {
  vi.mock("@/app/_lib/features");

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should show header", () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(true);
    render(<UmbrellaBrandHeader />);
    screen.getByText("Offizielle Website – Bundesrepublik Deutschland");
    vi.unstubAllEnvs();
  });

  it("should show header (camel-case)", () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(true);
    render(<UmbrellaBrandHeader />);
    screen.getByText("Offizielle Website – Bundesrepublik Deutschland");
    vi.unstubAllEnvs();
  });

  it("should not show header", () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(false);
    const { container } = render(<UmbrellaBrandHeader />);
    expect(container).toBeEmptyDOMElement();
    vi.unstubAllEnvs();
  });
});
