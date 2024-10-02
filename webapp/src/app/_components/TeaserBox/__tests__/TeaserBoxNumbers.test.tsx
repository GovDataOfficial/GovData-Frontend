import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeaserBoxNumber } from "@/app/_components/TeaserBox/partials/TeaserBoxNumber";
import { icons } from "@/app/_components/SVG/SVG";

describe("TeaserBoxNumbers", () => {
  const testProps = {
    href: "www.testboxnumbers.test",
    icon: icons.hvd,
    name: "Meine Box",
    docCount: 246500,
  };

  it("should render a dark teaser box", () => {
    const { container } = render(<TeaserBoxNumber {...testProps} />);
    const teaserBoxDark = container.querySelector(".gd-teaser-box-dark");
    expect(teaserBoxDark).toBeInTheDocument();
  });

  it("should render correct dataset svg", () => {
    render(<TeaserBoxNumber {...testProps} />);
    const img = screen.getByRole("presentation");
    expect(img.getAttribute("src")).toContain("hvd.svg");
  });

  it("should render correct count and Text", () => {
    render(<TeaserBoxNumber {...testProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveTextContent("246.500Meine Box");
  });

  it("should have correct anchor", () => {
    render(<TeaserBoxNumber {...testProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "www.testboxnumbers.test");
    expect(link).not.toHaveAttribute("target");
  });
});
