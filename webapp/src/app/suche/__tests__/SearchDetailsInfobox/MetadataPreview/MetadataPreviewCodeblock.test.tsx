import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Prism from "prismjs";

import { MetadataPreviewCodeblock } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewCodeblock";
import { MetadataPreviewFileSuffix } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewFileFormats";

// Mock Prism.js
vi.mock("prismjs", () => ({
  default: {
    highlightElement: vi.fn(),
  },
}));

// // Mock Prism.js CSS imports
vi.mock("prismjs/components/prism-turtle", () => ({}));
vi.mock("prismjs/components/prism-markup", () => ({}));
vi.mock("prismjs/components/prism-json", () => ({}));
vi.mock("prismjs/themes/prism-okaidia.css", () => ({}));
vi.mock("prismjs/plugins/line-numbers/prism-line-numbers.js", () => ({}));
vi.mock("prismjs/plugins/line-numbers/prism-line-numbers.css", () => ({}));

describe("MetadataPreviewCodeblock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders code content with correct language class for ttl suffix", () => {
    const codeContent = "@prefix ex: <http://example.org/> .";
    const suffix = MetadataPreviewFileSuffix.TURTLE;

    render(
      <MetadataPreviewCodeblock codeContent={codeContent} suffix={suffix} />,
    );

    const codeElement = screen.getByText(codeContent);
    expect(codeElement).toBeInTheDocument();
    expect(codeElement).toHaveClass("language-turtle");
  });

  it("renders code content with correct language class for rdf suffix", () => {
    const codeContent = "<rdf:RDF>...</rdf:RDF>";
    const suffix = MetadataPreviewFileSuffix.RDF_XML;

    render(
      <MetadataPreviewCodeblock codeContent={codeContent} suffix={suffix} />,
    );

    const codeElement = screen.getByText(codeContent);
    expect(codeElement).toBeInTheDocument();
    expect(codeElement).toHaveClass("language-markup");
  });

  it("renders code content with correct language class for jsonld suffix", () => {
    const codeContent = '{"@context": "http://schema.org/"}';
    const suffix = MetadataPreviewFileSuffix.JSON_LD;

    render(
      <MetadataPreviewCodeblock codeContent={codeContent} suffix={suffix} />,
    );

    const codeElement = screen.getByText(codeContent);
    expect(codeElement).toBeInTheDocument();
    expect(codeElement).toHaveClass("language-json");
  });

  it("defaults to markup language for unknown suffix", () => {
    const codeContent = "<unknown>content</unknown>";
    const suffix = "unknown" as MetadataPreviewFileSuffix;

    render(
      <MetadataPreviewCodeblock codeContent={codeContent} suffix={suffix} />,
    );

    const codeElement = screen.getByText(codeContent);
    expect(codeElement).toBeInTheDocument();
    expect(codeElement).toHaveClass("language-markup");
  });

  it("handles case-insensitive suffix matching", () => {
    const codeContent = "@prefix ex: <http://example.org/> .";
    const suffix = MetadataPreviewFileSuffix.TURTLE;

    render(
      <MetadataPreviewCodeblock codeContent={codeContent} suffix={suffix} />,
    );

    const codeElement = screen.getByText(codeContent);
    expect(codeElement).toHaveClass("language-turtle");
  });

  it("displays no content message when codeContent is empty", () => {
    const codeContent = "";
    const suffix = MetadataPreviewFileSuffix.TURTLE;

    render(
      <MetadataPreviewCodeblock codeContent={codeContent} suffix={suffix} />,
    );

    const noContentMessage = screen.getByText("Kein Inhalt verfügbar");
    expect(noContentMessage).toBeInTheDocument();
  });

  it("displays no content message when codeContent is null", () => {
    const codeContent = null as any;
    const suffix = MetadataPreviewFileSuffix.TURTLE;

    render(
      <MetadataPreviewCodeblock codeContent={codeContent} suffix={suffix} />,
    );

    const noContentMessage = screen.getByText("Kein Inhalt verfügbar");
    expect(noContentMessage).toBeInTheDocument();
  });

  it("displays no content message when codeContent is undefined", () => {
    const codeContent = undefined as any;
    const suffix = MetadataPreviewFileSuffix.TURTLE;

    render(
      <MetadataPreviewCodeblock codeContent={codeContent} suffix={suffix} />,
    );

    const noContentMessage = screen.getByText("Kein Inhalt verfügbar");
    expect(noContentMessage).toBeInTheDocument();
  });

  it("calls Prism.highlightElement", () => {
    const codeContent = "@prefix ex: <http://example.org/> .";
    const suffix = MetadataPreviewFileSuffix.TURTLE;

    render(
      <MetadataPreviewCodeblock codeContent={codeContent} suffix={suffix} />,
    );

    expect(Prism.highlightElement).toHaveBeenCalledTimes(1);
    expect(Prism.highlightElement).toHaveBeenCalledWith(
      expect.any(HTMLElement),
    );
  });

  it("re-runs Prism highlighting when codeContent changes", () => {
    const initialContent = "initial content";
    const updatedContent = "updated content";
    const suffix = MetadataPreviewFileSuffix.TURTLE;

    const { rerender } = render(
      <MetadataPreviewCodeblock codeContent={initialContent} suffix={suffix} />,
    );

    expect(Prism.highlightElement).toHaveBeenCalledTimes(1);

    rerender(
      <MetadataPreviewCodeblock codeContent={updatedContent} suffix={suffix} />,
    );

    expect(Prism.highlightElement).toHaveBeenCalledTimes(2);
  });

  it("does not re-run Prism highlighting when suffix changes but content stays the same", () => {
    const codeContent = "same content";
    const initialSuffix = MetadataPreviewFileSuffix.TURTLE;
    const updatedSuffix = MetadataPreviewFileSuffix.RDF_XML;

    const { rerender } = render(
      <MetadataPreviewCodeblock
        codeContent={codeContent}
        suffix={initialSuffix}
      />,
    );

    expect(Prism.highlightElement).toHaveBeenCalledTimes(1);

    rerender(
      <MetadataPreviewCodeblock
        codeContent={codeContent}
        suffix={updatedSuffix}
      />,
    );

    // Should still be 1 because useEffect dependency is only on codeContent
    expect(Prism.highlightElement).toHaveBeenCalledTimes(1);
  });

  it("renders proper HTML structure", () => {
    const codeContent = "@prefix ex: <http://example.org/> .";
    const suffix = MetadataPreviewFileSuffix.TURTLE;

    render(
      <MetadataPreviewCodeblock codeContent={codeContent} suffix={suffix} />,
    );

    const preElement = screen.getByText(codeContent).closest("pre");
    const codeElement = screen.getByText(codeContent);

    expect(preElement).toBeInTheDocument();
    expect(codeElement.tagName).toBe("CODE");
    expect(preElement?.contains(codeElement)).toBe(true);
  });

  it("handles whitespace and special characters in code content", () => {
    const codeContent = `@prefix ex: <http://example.org/> .
ex:subject ex:predicate "object with spaces and symbols: !@#$%^&*()" .`;
    const suffix = MetadataPreviewFileSuffix.TURTLE;

    render(
      <MetadataPreviewCodeblock codeContent={codeContent} suffix={suffix} />,
    );

    // Find the code element by its tag name and check its content
    const codeElement = document.querySelector("code");
    expect(codeElement).toBeInTheDocument();
    // Check that the content includes the expected parts (whitespace normalization may occur)
    expect(codeElement?.textContent).toContain("@prefix ex:");
    expect(codeElement?.textContent).toContain("ex:subject ex:predicate");
    expect(codeElement?.textContent).toContain("!@#$%^&*()");
    expect(Prism.highlightElement).toHaveBeenCalledWith(codeElement);
  });

  it("handles very long code content", () => {
    const longContent = "x".repeat(10000);
    const suffix = MetadataPreviewFileSuffix.TURTLE;

    render(
      <MetadataPreviewCodeblock codeContent={longContent} suffix={suffix} />,
    );

    const codeElement = screen.getByText(longContent);
    expect(codeElement).toBeInTheDocument();
    expect(Prism.highlightElement).toHaveBeenCalledWith(codeElement);
  });
});
