import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { defaultHvdCategoriesData } from "@/app/_lib/defaultFormData";
import { FILTERS } from "@/app/_lib/URLHelper";
import { TermCategories } from "@/app/suche/_components/SearchDetailsInfobox/partials/TermCategories";

describe("TermCategories", () => {
  it("renders null when categories are not provided", () => {
    const { container } = render(<TermCategories title="Test Title" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders null when categories are an empty array", () => {
    const { container } = render(
      <TermCategories title="Test Title" categories={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the title and category correctly", () => {
    const categories = ["ener"];
    render(<TermCategories title="Test Title" categories={categories} />);

    screen.getByText("Test Title");
    screen.getByText(/Energie/i);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining(FILTERS.GROUPS),
    );
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining(categories[0]),
    );
  });

  it("renders HVD category correctly", () => {
    const categories = [defaultHvdCategoriesData[0].shortkey];
    render(
      <TermCategories
        title="Test Title"
        categories={categories}
        isHVD={true}
      />,
    );
    screen.getByText(defaultHvdCategoriesData[0].label);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining(FILTERS.HVD_CATEGORIES),
    );
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining(
        encodeURIComponent(defaultHvdCategoriesData[0].key),
      ),
    );
  });

  it("does not render category if hvd category is not knwon", () => {
    const categories = ["invalidCategory"];
    render(
      <TermCategories
        title="Test Title"
        categories={categories}
        isHVD={true}
      />,
    );

    expect(screen.queryByText("invalidCategory")).not.toBeInTheDocument();
  });
});
