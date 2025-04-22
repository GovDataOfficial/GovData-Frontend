import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { MetaInfoHeadlineIcon } from "@/app/suche/_components/common/MetaInfoHeadlineIcon";
import { HitType } from "@/types/types";

describe("MetaInfoHeadlineIcon", () => {
  it("should render dataset", () => {
    render(<MetaInfoHeadlineIcon type={HitType.dataset} />);

    screen.getByText("Datensatz");
    const image = screen.getByRole("presentation");
    expect(image.getAttribute("src")).toContain("typ_dataset_inverted");
  });

  it("should render text inside a strong element", () => {
    render(<MetaInfoHeadlineIcon type={HitType.dataset} />);

    const text = screen.getByText("Datensatz");
    expect(text.tagName).toEqual("SPAN");
  });
});
