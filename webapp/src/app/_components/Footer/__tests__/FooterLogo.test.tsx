import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

describe("FooterLogo", () => {
  let Component: any;

  beforeAll(async () => {
    vi.stubEnv("footer_logo_link", "https://example.com");
    vi.stubEnv("footer_logo_link_alt", "Example Logo");

    // need to import Component after we stub env here
    const Module = await import("../partials/FooterLogo");
    const { FooterLogo } = Module;
    Component = FooterLogo();
  });

  it("should render footer logo with custom environment variables", async () => {
    render(Component);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");

    const image = screen.getByAltText("Example Logo");
    expect(image).toHaveAttribute("alt", "Example Logo");
    expect(image).toHaveAttribute("src", "/images/footer_logo.svg");
  });

  it("should have correct CSS classes", async () => {
    const { container } = render(Component);

    const footerLogoDiv = container.querySelector(".footer-logo");
    expect(footerLogoDiv).toBeInTheDocument();
    expect(footerLogoDiv).toHaveClass("footer-logo");
  });
});

describe("FooterLogo with default values", () => {
  let Component: any;

  beforeAll(async () => {
    // Clear any existing env stubs and don't set new ones to test defaults
    vi.unstubAllEnvs();

    // need to import Component after we clear env here
    const Module = await import("../partials/FooterLogo");
    const { FooterLogo } = Module;
    Component = FooterLogo();
  });

  it("should render with default values when environment variables are not set", async () => {
    render(Component);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");

    const image = screen.getByAltText("");
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("src", "/images/footer_logo.svg");
  });
});

describe("FooterLogo with partial environment variables", () => {
  let Component: any;

  beforeAll(async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("footer_logo_link", "https://custom-link.com");
    // Intentionally not setting footer_logo_link_alt to test default

    // need to import Component after we stub env here
    const Module = await import("../partials/FooterLogo");
    const { FooterLogo } = Module;
    Component = FooterLogo();
  });

  it("should use custom link but default alt text", async () => {
    render(Component);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://custom-link.com");

    const image = screen.getByAltText("");
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("src", "/images/footer_logo.svg");
  });
});
