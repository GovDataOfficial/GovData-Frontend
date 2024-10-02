import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { hideOffCanvas, showOffCanvas } from "@/app/_components/OffCanvasMenu";

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
