import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Footer } from "@/app/_components/Footer/Footer";

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
              { title: "Impressum", link: "/imp" },
              { title: "Datenschutz", link: "/schutz" },
            ],
          },
        },
      ],
    },
  }),
}));

describe("Footer", () => {
  it("should render provided links", async () => {
    const Component = await Footer();
    render(Component);

    const lists = screen.getAllByRole("list");
    const items = within(lists[0]).getAllByRole("listitem");

    const contactLink = within(items[0]).getByRole("link", {
      name: "Kontakt",
    });
    expect(contactLink.getAttribute("href")).toBe("/kontakt");

    const link2 = within(items[1]).getByRole("link", { name: "Impressum" });
    expect(link2.getAttribute("href")).toBe("/imp");

    const link3 = within(items[2]).getByRole("link", { name: "Datenschutz" });
    expect(link3.getAttribute("href")).toBe("/schutz");
  });

  it("should render no social media", async () => {
    const Component = await Footer();
    render(Component);

    const socialMediaLinksHeading = screen.queryByRole("heading", {
      name: "Besuchen Sie unsere Social-Media-Kanäle",
      level: 2,
    });

    expect(socialMediaLinksHeading).toBeNull();
  });
});
