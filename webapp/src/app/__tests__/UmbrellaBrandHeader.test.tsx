import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { UmbrellaBrandHeader } from "@/app/_components/UmbrellaBrandHeader/UmbrellaBrandHeader";

describe("UmbrellaBrandHeader", () => {
  it("should show header", () => {
    vi.stubEnv("show_umbrella_brand_header", "true");
    render(<UmbrellaBrandHeader />);
    screen.getByText("Offizielle Website – Bundesrepublik Deutschland");
    vi.unstubAllEnvs();
  });

  it("should show header (camel-case)", () => {
    vi.stubEnv("show_umbrella_brand_header", "True");
    render(<UmbrellaBrandHeader />);
    screen.getByText("Offizielle Website – Bundesrepublik Deutschland");
    vi.unstubAllEnvs();
  });

  it("should not show header", () => {
    vi.stubEnv("show_umbrella_brand_header", "false");
    const { container } = render(<UmbrellaBrandHeader />);
    expect(container).toBeEmptyDOMElement();
    vi.unstubAllEnvs();
  });

  it("should not show header (config param not exists)", () => {
    const { container } = render(<UmbrellaBrandHeader />);
    expect(container).toBeEmptyDOMElement();
    vi.unstubAllEnvs();
  });
});
