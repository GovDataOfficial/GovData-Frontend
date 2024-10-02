import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryImage } from "@/app/_components/Categories/CategoryImage";

describe("CategoryImage", () => {
  it("should render an img with an empty alt tag", () => {
    render(<CategoryImage type="soci" />);

    const img = screen.getByRole("presentation");
    expect(img.getAttribute("alt")).toBe("");
  });
});
