import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { QuickAccessNavigation } from "@/app/_components/QuickAccesNavigation/QuickAccessNavigation";
import { usePathname } from "next/navigation";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("QuickAccessNavigation", () => {
  const getAllLinks = (): HTMLElement[] => {
    const nav = screen.getByRole("navigation", { name: "Schnell-Links" });
    return within(nav).getAllByRole("link");
  };

  it("should render skip link navigation", async () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<QuickAccessNavigation />);

    const links = getAllLinks();
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveTextContent("Zur Navigation");
    expect(links[1]).toHaveTextContent("Zur Schnellsuche");
    expect(links[2]).toHaveTextContent("Zum Hauptinhalt");
  });

  it("should render correct skiplinks for intern pages", async () => {
    vi.mocked(usePathname).mockReturnValue(PAGES_AUTH.manage_data);
    render(<QuickAccessNavigation />);

    const links = getAllLinks();
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent("Zur Navigation");
    expect(links[1]).toHaveTextContent("Zum Hauptinhalt");
  });
});
