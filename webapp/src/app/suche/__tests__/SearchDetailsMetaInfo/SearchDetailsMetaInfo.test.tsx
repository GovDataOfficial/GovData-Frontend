import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import {
  metaDataTestProps,
  showCaseTestData,
} from "@/app/suche/__tests__/props";
import { SearchDetailsMetaInfo } from "@/app/suche/_components/SearchDetailsMetaInfo/SearchDetailsMetaInfo";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: vi.fn(({ src, alt, fill, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  )),
}));

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
    expect(mediaTypeIconDiv).toHaveClass("mediatype-showcase");
  });

  it("should render correct headline for showcase data", () => {
    render(<SearchDetailsMetaInfo data={showCaseTestData} />);

    screen.getByRole("heading", {
      name: "Mein Test Showcase",
      level: 1,
    });

    const notes = screen.getByText(/test notes/i);
    expect(notes.closest(".paragraph")).toBeInTheDocument();
  });

  it("should show images", () => {
    const dataWithImage = {
      ...showCaseTestData,
      images: [
        {
          id: 123,
          imageOrderId: 1,
          image: "testbase64img",
          url: "",
        },
      ],
    };

    const { container } = render(
      <SearchDetailsMetaInfo data={dataWithImage} />,
    );

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

  it("should show default image", () => {
    const { container } = render(
      <SearchDetailsMetaInfo data={showCaseTestData} />,
    );

    const imgContainer = container.querySelector(
      ".search-details-showcase-images-box",
    );

    expect(imgContainer).toBeInTheDocument();
    const showCaseImg = within(imgContainer as HTMLElement).getByRole(
      "presentation",
    );
    expect(showCaseImg).toHaveAttribute("src", "/images/showcase-default.png");
    expect(showCaseImg).toHaveAttribute("alt", "");
  });

  it("should render sanitized notes", () => {
    const propsWithDirtyHtml = {
      ...metaDataTestProps,
      notes: "<span>test</span>",
    };
    const { container } = render(
      <SearchDetailsMetaInfo data={propsWithDirtyHtml} />,
    );
    const html = container.querySelector(".paragraph")?.innerHTML;
    expect(html).toBe("<p>test</p>\n");
  });

  it("should render markdown notes", () => {
    const propsWithMarkdown = {
      ...metaDataTestProps,
      notes:
        "**Aktualisierungszyklus:**\n\n- keine Aktualisierung\n\n" +
        "## Hinweise\n\n[Portal](https://example.org)",
    };
    const { container } = render(
      <SearchDetailsMetaInfo data={propsWithMarkdown} />,
    );

    const notes = container.querySelector(".gd-prose");
    expect(notes).toBeInTheDocument();

    expect(
      within(notes as HTMLElement).getByText("Aktualisierungszyklus:").tagName,
    ).toBe("STRONG");
    expect(
      within(notes as HTMLElement).getByRole("listitem"),
    ).toHaveTextContent("keine Aktualisierung");

    // the h1 of the page is the title, so a markdown "##" ends up as h3
    within(notes as HTMLElement).getByRole("heading", {
      name: "Hinweise",
      level: 3,
    });

    const link = within(notes as HTMLElement).getByRole("link", {
      name: "Portal",
    });
    expect(link).toHaveAttribute("href", "https://example.org");
    expect(link).toHaveAttribute("rel", "nofollow noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("should not show default image for datasets", () => {
    const { container } = render(
      <SearchDetailsMetaInfo data={metaDataTestProps} />,
    );

    const imgContainer = container.querySelector(
      ".search-details-showcase-images-box",
    );

    expect(imgContainer).not.toBeInTheDocument();
  });
});
