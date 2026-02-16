import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { HeaderNavigation } from "@/app/_components/Header/HeaderNavigation";

// Create a shared mock function that both mocks can access
const mockIsFeatureEnabled = vi.fn();

// Mock the features module before importing anything else
vi.mock("@/app/_lib/features", () => ({
  isFeatureEnabled: mockIsFeatureEnabled,
}));

// Mock menuSettings to return dynamic content based on our mocks
vi.mock("@/configuration/menuSettings", () => ({
  get menuSettings() {
    const baseItems = [
      {
        href: "/daten",
        name: "Daten",
        color: "data-green",
      },
    ];

    // Add metadata quality dashboard if environment variable is set
    if (process.env.metadata_quality_dashboard_active === "1") {
      baseItems.push({
        href: "/metadatenqualitaet",
        name: "Metadatenqualität",
        color: "magenta",
      });
    }

    // Add SPARQL menu item if feature is enabled
    if (mockIsFeatureEnabled()) {
      baseItems.push({
        href: "/sparql-assistent",
        name: "SPARQL",
        color: "devcorner-green",
      });
    }

    // Always add information menu item
    baseItems.push({
      href: "/informationen",
      name: "Informationen",
      color: "black",
    });

    return baseItems;
  },
}));

describe("HeaderNavigation", () => {
  vi.mock("next/navigation", () => ({
    usePathname: vi.fn().mockReturnValue(""),
  }));

  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    mockIsFeatureEnabled.mockReturnValue(true);
  });

  it("should render correct markup ", () => {
    render(<HeaderNavigation />);
    const navigation = screen.getByRole("navigation", {
      name: "Seiten der Seite",
    });

    within(navigation).getByRole("img", { name: /zur startseite/i });
    const menubar = within(navigation).getByRole("menubar");

    const menuLinks = within(menubar).getAllByRole("menuitem");
    expect(menuLinks).toHaveLength(3);
    expect(menuLinks[0]).toHaveTextContent("Daten");
    // expect(menuLinks[1]).toHaveTextContent("Metadatenqualität");
    expect(menuLinks[1]).toHaveTextContent("SPARQL");
    expect(menuLinks[2]).toHaveTextContent("Informationen");
  });

  it("should include metadataquality menu item when environment variable is set", () => {
    vi.stubEnv("metadata_quality_dashboard_active", "1");
    render(<HeaderNavigation />);
    const navigation = screen.getByRole("navigation", {
      name: "Seiten der Seite",
    });

    const menubar = within(navigation).getByRole("menubar");
    const menuLinks = within(menubar).getAllByRole("menuitem");
    expect(menuLinks).toHaveLength(4);
    expect(menuLinks[1]).toHaveTextContent("Metadatenqualität");
  });

  it("should not include metadataquality menu item when environment variable is not set", () => {
    vi.stubEnv("metadata_quality_dashboard_active", "0");
    render(<HeaderNavigation />);
    const navigation = screen.getByRole("navigation", {
      name: "Seiten der Seite",
    });

    const menubar = within(navigation).getByRole("menubar");
    const menuLinks = within(menubar).getAllByRole("menuitem");
    expect(menuLinks).toHaveLength(3);
    expect(
      menuLinks.find((link) => within(link).queryByText("Metadatenqualität")),
    ).toBeUndefined();
  });

  it("should include Sparql menu item when feature is enabled", () => {
    render(<HeaderNavigation />);
    const navigation = screen.getByRole("navigation", {
      name: "Seiten der Seite",
    });

    const menubar = within(navigation).getByRole("menubar");
    const menuLinks = within(menubar).getAllByRole("menuitem");
    expect(menuLinks).toHaveLength(3);
    expect(menuLinks[1]).toHaveTextContent("SPARQL");
  });

  it("should not include Sparql menu item when feature is disabled", () => {
    mockIsFeatureEnabled.mockReturnValue(false);
    render(<HeaderNavigation />);
    const navigation = screen.getByRole("navigation", {
      name: "Seiten der Seite",
    });

    const menubar = within(navigation).getByRole("menubar");
    const menuLinks = within(menubar).getAllByRole("menuitem");
    expect(menuLinks).toHaveLength(2);
    expect(
      menuLinks.find((link) => within(link).queryByText("SPARQL")),
    ).toBeUndefined();
  });

  it("should render a button to open side navigation", () => {
    render(<HeaderNavigation />);
    const button = screen.getByRole("button", {
      name: /seitennavigation ausklappen/i,
    });

    expect(button).toHaveAttribute("aria-controls", "off-canvas");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
