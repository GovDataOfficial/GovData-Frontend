import { describe, expect, it } from "vitest";
import { RegionSearch } from "@/app/_components/RegionSearch/RegionSearch";
import { render, screen } from "@testing-library/react";
import { SVGGermany } from "@/app/_components/RegionSearch/SVGGermany";
import { stateListMap } from "@/app/_lib/stateList";

describe("SVGGermany", () => {
  it("should create link for every state", () => {
    render(<SVGGermany />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(16);

    expect(links[0]).toHaveAttribute("href", "/suche?state=16");
    expect(links[1]).toHaveAttribute("href", "/suche?state=01");
    expect(links[2]).toHaveAttribute("href", "/suche?state=15");
    expect(links[3]).toHaveAttribute("href", "/suche?state=14");
    expect(links[4]).toHaveAttribute("href", "/suche?state=10");
    expect(links[5]).toHaveAttribute("href", "/suche?state=07");
    expect(links[6]).toHaveAttribute("href", "/suche?state=05");
    expect(links[7]).toHaveAttribute("href", "/suche?state=03");
    expect(links[8]).toHaveAttribute("href", "/suche?state=13");
    expect(links[9]).toHaveAttribute("href", "/suche?state=06");
    expect(links[10]).toHaveAttribute("href", "/suche?state=02");
    expect(links[11]).toHaveAttribute("href", "/suche?state=04");
    expect(links[12]).toHaveAttribute("href", "/suche?state=12");
    expect(links[13]).toHaveAttribute("href", "/suche?state=11");
    expect(links[14]).toHaveAttribute("href", "/suche?state=09");
    expect(links[15]).toHaveAttribute("href", "/suche?state=08");
  });

  it("should set correct attributes on link", () => {
    render(<SVGGermany />);
    const links = screen.getAllByRole("link");

    expect(links[0]).toHaveAttribute("title");
    expect(links[0]).toHaveAttribute("tabindex", "-1");
  });

  it("path elements should have correct id", () => {
    const { container } = render(<SVGGermany />);

    const paths = container.querySelectorAll("path");
    paths.forEach((path) => {
      expect(path.getAttribute("id")).toContain("svg-germany-");
    });
  });
});
