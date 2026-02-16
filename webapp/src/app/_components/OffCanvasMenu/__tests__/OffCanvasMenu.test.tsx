import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { hideOffCanvas, showOffCanvas } from "@/app/_components/OffCanvasMenu";

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
    vi.stubEnv("metadata_quality_dashboard_active", "1");
    // Set mock to return true for SPARQL feature
    mockIsFeatureEnabled.mockReturnValue(true);
    const defaultImport = await import("../OffCanvasMenu.js");
    OffCanvasMenu = defaultImport.OffCanvasMenu;
  });

  it("should render correct text", async () => {
    const Result = await OffCanvasMenu();
    render(Result);
    screen.getByText("Seitenmenü");
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
    // 8 as blogs are deactivated for now
    expect(menuItems).toHaveLength(8);
    expect(menuItems[0]).toHaveTextContent("Daten");
    expect(menuItems[1]).toHaveTextContent("Metadatenqualität");
    expect(menuItems[2]).toHaveTextContent("Qualitätsmerkmale");
    expect(menuItems[3]).toHaveTextContent("TOP 5");
    expect(menuItems[4]).toHaveTextContent("SPARQL");
    expect(menuItems[5]).toHaveTextContent("Informationen");
    expect(menuItems[6]).toHaveTextContent("infos");
    expect(menuItems[7]).toHaveTextContent("mehr infos");
  });

  it("should render behave correct on show/hide", async () => {
    const Result = await OffCanvasMenu();
    render(Result);

    showOffCanvas("mainmenu");

    const wrapper = document.querySelector(".gd-offcanvas");
    const containerMenu = document.getElementById("off-canvas-mainmenu");
    const containerFilter = document.getElementById("off-canvas-filter");
    const toggle = document.getElementById("off-canvas-close-toggle");

    expect(wrapper).toHaveAttribute("aria-hidden", "false");
    expect(containerMenu).toBeVisible();
    expect(containerFilter).toHaveClass("d-none");
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    hideOffCanvas();

    expect(wrapper).toHaveAttribute("aria-hidden", "true");
    expect(containerFilter).toHaveClass("d-none");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  // menu items in "information" are currently not hidden when button is closed
  // this might be an a11y issue
  it.todo("should correctly open the hidden information items");
});
