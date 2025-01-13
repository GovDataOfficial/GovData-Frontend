import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import { MenuItem } from "@/app/_components/MenuItem/MenuItem";

vi.mock("next/navigation");

describe("MenuItem", () => {
  const mockData = {
    href: "/test",
    name: "Test",
    color: "data-green",
  };

  it("should render", () => {
    vi.mocked(usePathname).mockReturnValue("/mockpathtest");

    const { name, color } = mockData;
    render(<MenuItem {...mockData} />);

    const menuItem = screen.getByRole("menuitem");

    expect(menuItem).toHaveTextContent(name);
    expect(menuItem).toHaveAttribute("title", name);
    expect(menuItem).toHaveClass("bg-" + color);
    expect(menuItem).not.toHaveClass("active");
  });

  it("should render active state", () => {
    vi.mocked(usePathname).mockReturnValue("/mockpathtest");
    render(<MenuItem {...mockData} href={"/mockpathtest"} />);

    const menuItem = screen.getByRole("menuitem");

    expect(menuItem).toHaveClass("active");
  });

  it("should not be active for pages that contain the name", () => {
    vi.mocked(usePathname).mockReturnValue("/datenpflege");

    render(<MenuItem href={"/daten"} name={"daten"} color={"green"} />);
    const menuItem = screen.getByRole("menuitem", { name: "daten" });
    expect(menuItem).not.toHaveClass("active");
  });

  it("should be active for sub pages", () => {
    vi.mocked(usePathname).mockReturnValue("/daten/test/foo");

    render(<MenuItem href={"/daten"} name={"daten"} color={"green"} />);
    const menuItem = screen.getByRole("menuitem", { name: "daten" });
    expect(menuItem).toHaveClass("active");
  });
});
