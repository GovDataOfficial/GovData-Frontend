import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetaInfoHeadlineIcon } from "@/app/suche/_components/common/MetaInfoHeadlineIcon";

describe("MetaInfoHeadlineIcon", () => {
  it("should render other as default if no type matches", () => {
    render(<MetaInfoHeadlineIcon type={"test"} />);

    screen.getByText("Sonstiges");
    const image = screen.getByRole("presentation");
    expect(image.getAttribute("src")).toContain("typ_other_inverted");
  });

  it("should render dataset", () => {
    render(<MetaInfoHeadlineIcon type={"dataset"} />);

    screen.getByText("Datensatz");
    const image = screen.getByRole("presentation");
    expect(image.getAttribute("src")).toContain("typ_dataset_inverted");
  });

  it("should render text inside a strong element", () => {
    render(<MetaInfoHeadlineIcon type={"dataset"} />);

    const text = screen.getByText("Datensatz");
    expect(text.tagName).toEqual("SPAN");
  });
});
