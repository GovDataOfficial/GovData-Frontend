import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { hideOffCanvas, showOffCanvas } from "@/app/_components/OffCanvasMenu";

// Create a shared mock function for isFeatureEnabled
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
        subMenu: [
          {
            href: "/metadatenqualitaet/qualitaetsmerkmale",
            name: "Qualitätsmerkmale",
            color: "magenta",
          },
          {
            href: "/metadatenqualitaet/top5",
            name: "TOP 5",
            color: "magenta",
          },
        ],
      } as any);
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

vi.mock("@/app/_lib/getData", () => ({
  fetchTypo3Data: vi.fn().mockResolvedValue({
    id: 1,
    meta: { title: "test" },
    content: {
      colPos0: [
        {
          type: "menu_subpages",
          id: 1,
          content: {
            menu: [
              { title: "infos", href: "/info/1" },
              { title: "mehr infos", href: "/info/mehr" },
            ],
          },
        },
      ],
    },
  }),
}));

vi.mock("next/navigation", () => ({
  usePathname() {
    return "/";
  },
}));

describe("OffCanvasMenu", () => {
  let OffCanvasMenu: any;

  beforeAll(async () => {
    vi.stubEnv("metadata_quality_dashboard_active", "");
    // Set mock to return true for SPARQL feature
    mockIsFeatureEnabled.mockReturnValue(true);
    const defaultImport = await import("../OffCanvasMenu.js");
    OffCanvasMenu = defaultImport.OffCanvasMenu;
  });

  it("should render a menubar with correct items", async () => {
    const Result = await OffCanvasMenu();
    render(Result);
    const menubar = screen.getByRole("menubar", {
      name: "Seiten der Seite",
      hidden: true,
    });
    const menuItems = within(menubar).getAllByRole("menuitem", {
      hidden: true,
    });

    expect(menuItems).toHaveLength(5);
    expect(menuItems[0]).toHaveTextContent("Daten");
    expect(menuItems[1]).toHaveTextContent("SPARQL");
    expect(menuItems[2]).toHaveTextContent("Informationen");
    expect(menuItems[3]).toHaveTextContent("infos");
    expect(menuItems[4]).toHaveTextContent("mehr infos");
  });
});
