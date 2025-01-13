import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import { MenuItemMobile } from "@/app/_components/MenuItem/MenuItemMobile";

vi.mock("next/navigation");

describe("MenuItemMobile", () => {
  it("should render without children", () => {
    vi.mocked(usePathname).mockReturnValue("notroot");

    render(<MenuItemMobile href="/" name="Home" />);

    const menuItem = screen.getByRole("menuitem");

    expect(menuItem.textContent).toBe("Home");
    expect(menuItem.getAttribute("title")).toBe("Home");
    expect(menuItem.getAttribute("class")).not.toContain("selected");
  });

  it("should render active without children", () => {
    vi.mocked(usePathname).mockReturnValue("/");

    render(<MenuItemMobile href="/" name="Home" />);

    const menuItem = screen.getByRole("menuitem");

    expect(menuItem.textContent).toBe("Home");
    expect(menuItem.getAttribute("title")).toBe("Home");
    expect(menuItem.getAttribute("class")).toContain("selected");
  });

  it("should render with children", () => {
    vi.mocked(usePathname).mockReturnValue("/notTest");

    render(
      <MenuItemMobile
        href="/test"
        name="Test"
        subMenu={[{ name: "TestA", href: "/testA" }]}
      />,
    );

    const button = screen.getByTitle("Test");
    const menu = screen.getByRole("menu");
    const menuItem = screen.getAllByRole("menuitem");

    expect(button.getAttribute("class")).toBe("dropdown-toggle");
    expect(menu.children).toHaveLength(1);
    expect(menuItem).toHaveLength(2);
  });

  it("should render active with children", () => {
    vi.mocked(usePathname).mockReturnValue("/info/info-a");

    render(
      <MenuItemMobile
        href="/info"
        name="info"
        subMenu={[
          { name: "info-a", href: "/info/info-a" },
          { name: "info-b", href: "/info/info-b" },
        ]}
      />,
    );

    const button = screen.getByTitle("info");
    const menu = screen.getByRole("menu");
    const menuItem = screen.getAllByRole("menuitem");
    const selected = screen.getByText("info-a");
    expect(button).toHaveClass("selected dropdown-toggle");
    expect(menu.children).toHaveLength(2);
    expect(menuItem).toHaveLength(3);
    expect(selected?.getAttribute("class")).toBe("selected");
  });

  it("should not be active for pages that contain the name", () => {
    vi.mocked(usePathname).mockReturnValue("/datenpflege");

    render(<MenuItemMobile href={"/daten"} name={"daten"} color={"green"} />);
    const menuItem = screen.getByRole("menuitem", { name: "daten" });
    expect(menuItem).not.toHaveClass("selected");
  });
});
