import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { MetaInfoHeadlineIcon } from "@/app/suche/_components/common/MetaInfoHeadlineIcon";
import { HitType } from "@/types/types";

// if not mocked, next.js will optimize the SVG and convert it to a base64 string
vi.mock("@/app/_components/SVG/iconMap", () => ({
  icons: {
    mediatype_dataset: "/mocked-mediatype_dataset.svg",
    mediatype_showcase: "/mocked-mediatype_showcase.svg",
  },
}));

describe("MetaInfoHeadlineIcon", () => {
  it("should render dataset", () => {
    render(<MetaInfoHeadlineIcon type={HitType.dataset} />);

    screen.getByText("Datensatz");
    const image = screen.getByRole("presentation");
    expect(image.getAttribute("src")).toContain("dataset");
  });

  it("should render text inside a strong element", () => {
    render(<MetaInfoHeadlineIcon type={HitType.dataset} />);

    const text = screen.getByText("Datensatz");
    expect(text.tagName).toEqual("SPAN");
  });
});
