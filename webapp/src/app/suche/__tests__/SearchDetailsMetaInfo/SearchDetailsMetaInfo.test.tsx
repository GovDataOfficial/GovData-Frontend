import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import {
  metaDataTestProps,
  showCaseTestData,
} from "@/app/suche/__tests__/props";
import { SearchDetailsMetaInfo } from "@/app/suche/_components/SearchDetailsMetaInfo/SearchDetailsMetaInfo";

describe("SearchDetailsMetaInfo", () => {
  it("should render correct icon and headline for datasets", () => {
    const { container } = render(
      <SearchDetailsMetaInfo data={metaDataTestProps} />,
    );

    const mediaTypeIconDiv = container.querySelector(".mediatype-icon");
    expect(mediaTypeIconDiv).toBeInTheDocument();
    expect(mediaTypeIconDiv).toHaveClass("mediatype-dataset");

    screen.getByRole("heading", {
      name: "Naturräume Geest und Marsch",
      level: 1,
    });
    screen.getByText("test-notes");
  });

  it("should retrieve the icon from the primary showcase", () => {
    const { container } = render(
      <SearchDetailsMetaInfo data={showCaseTestData} />,
    );

    const mediaTypeIconDiv = container.querySelector(".mediatype-icon");

    expect(mediaTypeIconDiv).toBeInTheDocument();
    expect(mediaTypeIconDiv).toHaveClass("mediatype-concept");
  });

  it("should render correct headline for showcase data", () => {
    render(<SearchDetailsMetaInfo data={showCaseTestData} />);

    screen.getByRole("heading", {
      name: "Mein Test Showcase",
      level: 1,
    });

    const notes = screen.getByText(/test notes/i);
    expect(notes).toHaveClass("paragraph");
  });

  it("should show images", () => {
    const dataWithImg = Object.assign(showCaseTestData, {
      images: [
        {
          id: 123,
          imageOrderId: 12333,
          image: "testbase64img",
          url: "",
        },
      ],
    });

    const { container } = render(<SearchDetailsMetaInfo data={dataWithImg} />);

    const imgContainer = container.querySelector(
      ".search-details-showcase-images-box",
    );

    expect(imgContainer).toBeInTheDocument();
    const showCaseImg = within(imgContainer as HTMLElement).getByRole(
      "presentation",
    );
    expect(showCaseImg).toHaveAttribute(
      "src",
      "data:image/png;base64,testbase64img",
    );
    expect(showCaseImg).toHaveAttribute("alt", "");
  });

  it("should render sanitized notes", () => {
    const propsWithDirtyHtml = {
      ...metaDataTestProps,
      notes: "<blo>test</blo>",
    };
    const { container } = render(
      <SearchDetailsMetaInfo data={propsWithDirtyHtml} />,
    );
    const html = container.querySelector(".paragraph")?.innerHTML;
    expect(html).toBe("test");
  });
});
