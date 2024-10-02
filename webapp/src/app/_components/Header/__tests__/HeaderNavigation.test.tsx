import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { HeaderNavigation } from "@/app/_components/Header/HeaderNavigation";

describe("HeaderNavigation", () => {
  vi.mock("next/navigation", () => ({
    usePathname: vi.fn().mockReturnValue(""),
  }));

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

  it("should render a button to open side navigation", () => {
    render(<HeaderNavigation />);
    const button = screen.getByRole("button", {
      name: /seitennavigation ausklappen/i,
    });

    expect(button).toHaveAttribute("aria-controls", "off-canvas");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
