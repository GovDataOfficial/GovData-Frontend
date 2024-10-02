import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SiteNavigationT3 } from "@/app/_components/SiteNavBar/SiteNavigationT3";
import { T3MenuSubPages } from "@/types/types.typo3";
import { usePathname } from "next/navigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("SiteNavigation", () => {
  beforeEach(() => {
    vi.resetAllMocks;
  });

  const subPagesWithContent: T3MenuSubPages = {
    id: 1,
    type: "menu_subpages",
    content: {
      menu: [
        { title: "item-1", link: "/to-1" },
        { title: "item-2", link: "/to-2" },
        { title: "item-3", link: "/to-3" },
      ],
    },
  };

  const subPagesWithEmpty: T3MenuSubPages = {
    id: 1,
    type: "menu_subpages",
    content: { menu: [] },
  };

  it("should render a menubar with navigation items", () => {
    render(<SiteNavigationT3 subPages={subPagesWithContent} />);

    const menuBar = screen.getByRole("menubar", { name: "Seiten der Seite" });
    const menuItems = within(menuBar).getAllByRole("menuitem");

    expect(menuItems).toHaveLength(3);
  });

  it("should render a menuitems with correct attributes with navigation items", () => {
    render(<SiteNavigationT3 subPages={subPagesWithContent} />);

    const menuBar = screen.getByRole("menubar", { name: "Seiten der Seite" });

    const item1 = within(menuBar).getByRole("menuitem", { name: "item-1" });
    const item2 = within(menuBar).getByRole("menuitem", { name: "item-2" });
    const item3 = within(menuBar).getByRole("menuitem", { name: "item-3" });
    expect(item1.getAttribute("href")).toBe("/to-1");
    expect(item2.getAttribute("href")).toBe("/to-2");
    expect(item3.getAttribute("href")).toBe("/to-3");
  });

  it("should set correct text-truncate class on item", () => {
    render(<SiteNavigationT3 subPages={subPagesWithContent} />);

    const item = screen.getByText("item-1");
    expect(item.className).toContain("text-truncate");
  });

  it("should set items to active if it matches the url", () => {
    vi.mocked(usePathname).mockReturnValue("/to-2");
    render(<SiteNavigationT3 subPages={subPagesWithContent} />);

    const allListItems = screen.getAllByRole("menuitem");
    expect(allListItems).toHaveLength(3);

    expect(allListItems[0].className).not.toContain("selected");
    expect(allListItems[1].className).toContain("selected");
    expect(allListItems[2].className).not.toContain("selected");
  });

  it("should render nothing if no subpages are given", () => {
    render(<SiteNavigationT3 subPages={subPagesWithEmpty} />);
    expect(screen.queryByRole("menubar")).toBeNull();
  });
});
