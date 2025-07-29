import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { icons } from "@/app/_components/SVG/SVG";
import { TeaserBoxNumber } from "@/app/_components/TeaserBox/partials/TeaserBoxNumber";

// if not mocked, next.js will optimize the SVG and convert it to a base64 string
vi.mock("@/app/_components/SVG/iconMap", () => ({
  icons: {
    hvd: "/mocked-hvd.svg",
  },
}));

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
