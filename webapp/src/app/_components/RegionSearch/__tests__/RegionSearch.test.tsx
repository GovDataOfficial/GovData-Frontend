import { describe, expect, it } from "vitest";
import { RegionSearch } from "@/app/_components/RegionSearch/RegionSearch";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("RegionSearch", () => {
  it("should render correct h2", () => {
    render(<RegionSearch />);

    screen.getByRole("heading", {
      name: "Offene Daten nach Bundesland",
      level: 2,
    });
  });

  it("should set data active on hover", async () => {
    const user = userEvent.setup();

    const { container } = render(<RegionSearch />);

    const linksBerlin = screen.getAllByRole("link", { name: "Berlin" });
    await user.hover(linksBerlin[0]); // the first one is in the searchbox

    const pathBerlin = container.querySelector('path[id="svg-germany-11"]');
    expect(pathBerlin).toHaveAttribute("data-active", "true");

    const linksBayern = screen.getAllByRole("link", { name: "Bayern" });

    await user.hover(linksBayern[1]!); // second link is in svg
    expect(linksBayern[0]).toHaveAttribute("data-active", "true");
    expect(pathBerlin).not.toHaveAttribute("data-active", "true");
  });
});
