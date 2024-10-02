import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MenuItem } from "@/app/_components/MenuItem/MenuItem";
import { MenuItemMobile } from "@/app/_components/MenuItem/MenuItemMobile";

vi.mock("next/navigation", () => ({
  usePathname() {
    return "/mockpathtest";
  },
}));

describe("MenuItem", () => {
  const mockData = {
    href: "/test",
    name: "Test",
    color: "data-green",
  };

  it("should render", () => {
    const { name, color, href } = mockData;
    render(<MenuItem {...mockData} />);

    const menuItem = screen.getByRole("menuitem");

    expect(menuItem).toHaveTextContent(name);
    expect(menuItem).toHaveAttribute("title", name);
    expect(menuItem).toHaveClass("bg-" + color);
    expect(menuItem).not.toHaveClass("active");
  });

  it("should render active state", () => {
    const { name, color, href } = mockData;
    render(<MenuItem href={"/mockpathtest"} name={name} color={color} />);

    const menuItem = screen.getByRole("menuitem");

    expect(menuItem).toHaveClass("active");
  });
});

describe("MenuItemMobile", () => {
  const mockData = [
    {
      href: "/",
      name: "Home",
    },
    {
      href: "/any",
      name: "Any",
    },
    {
      href: "/test",
      name: "Test",
      subMenu: [{ name: "TestA", href: "/testA" }],
    },
    {
      href: "/test",
      name: "Home",
      subMenu: [
        { name: "TestA", href: "/" },
        { name: "TestB", href: "/testA" },
      ],
    },
  ];

  it("should render without children", () => {
    const { name, href } = mockData[1];

    const { getByRole } = render(<MenuItemMobile href={href} name={name} />);

    const menuItem = getByRole("menuitem");

    expect(menuItem.textContent).toBe(name);
    expect(menuItem.getAttribute("title")).toBe(name);
    expect(menuItem.getAttribute("class")).not.toContain("selected");
  });

  it("should render active without children", () => {
    const { name, href } = mockData[0];

    const { getByRole } = render(<MenuItemMobile href={href} name={name} />);

    const menuItem = getByRole("menuitem");

    expect(menuItem.textContent).toBe(name);
    expect(menuItem.getAttribute("title")).toBe(name);
    expect(menuItem.getAttribute("class")).toContain("selected");
  });

  it("should render with children", () => {
    const { name, href, subMenu } = mockData[2];

    render(<MenuItemMobile href={href} name={name} subMenu={subMenu} />);

    const button = screen.getByTitle(name);
    const menu = screen.getByRole("menu");
    const menuItem = screen.getAllByRole("menuitem");

    expect(button.getAttribute("class")).toBe("dropdown-toggle");
    expect(menu.children).toHaveLength(1);
    expect(menuItem).toHaveLength(2);
  });

  it("should render active with children", () => {
    const { name, href, subMenu } = mockData[3];

    const { getByTitle, getByRole, getAllByRole } = render(
      <MenuItemMobile href={href} name={name} subMenu={subMenu} />,
    );

    const button = getByTitle(name);
    const menu = getByRole("menu");
    const menuItem = getAllByRole("menuitem");
    const selected = screen.getByText(/testa/i);

    expect(button.getAttribute("class")).toBe("dropdown-toggle");
    expect(menu.children).toHaveLength(2);
    expect(menuItem).toHaveLength(3);
    expect(selected?.getAttribute("class")).toBe("selected");
  });
});
