import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";
import React from "react";

import { useCodeContentFetch } from "@/app/_lib/hooks/useCodeContentFetch";
import { useDownloadClick } from "@/app/_lib/hooks/useDownloadClick";
import { MetadataPreviewFileSuffix } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewFileFormats";
import { MetadataPreviewModalContent } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewModalContent";

// Mock the hooks
vi.mock("@/app/_lib/hooks/useCodeContentFetch");
vi.mock("@/app/_lib/hooks/useDownloadClick");

vi.mock(
  "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewCodeblock",
  () => ({
    MetadataPreviewCodeblock: ({
      codeContent,
      suffix,
    }: {
      codeContent: string;
      suffix: string;
    }) => (
      <div data-testid="metadata-codeblock" data-suffix={suffix}>
        {codeContent}
      </div>
    ),
  }),
);

describe("MetadataPreviewModalContent", () => {
  const defaultProps = {
    metadataName: "test-metadata",
  };

  const mockHandleDownload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useDownloadClick).mockReturnValue({
      handleDownload: mockHandleDownload,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Loading state", () => {
    it("renders loading component when isLoading is true", async () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: true,
        hasError: false,
        liveRegionMessage: "",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      expect(
        screen.getByText("Metadaten-Vorschau lädt..."),
      ).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("does not render codeblock during loading", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: true,
        hasError: false,
        liveRegionMessage: "",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      expect(
        screen.queryByTestId("metadata-codeblock"),
      ).not.toBeInTheDocument();
    });

    it("does not render error box during loading", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: true,
        hasError: false,
        liveRegionMessage: "",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Error state", () => {
    it("renders error info box when hasError is true", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: false,
        hasError: true,
        liveRegionMessage: "",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      const errorBox = screen.getByRole("alert");
      expect(errorBox).toBeInTheDocument();
      expect(errorBox).toHaveTextContent(
        "Die Metadaten konnten nicht geladen werden.",
      );
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("does not render codeblock when there is an error", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: false,
        hasError: true,
        liveRegionMessage: "",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      expect(
        screen.queryByTestId("metadata-codeblock"),
      ).not.toBeInTheDocument();
    });

    it("does not render loading component in error state", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: false,
        hasError: true,
        liveRegionMessage: "",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      expect(
        screen.queryByText("Metadaten-Vorschau lädt..."),
      ).not.toBeInTheDocument();
    });
  });

  describe("Success state", () => {
    it("renders code content and download button when data is loaded successfully", () => {
      const codeContent = "@prefix ex: <http://example.org/> .";
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent,
        isLoading: false,
        hasError: false,
        liveRegionMessage: "Successfully loaded",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      const codeblock = screen.getByTestId("metadata-codeblock");
      expect(codeblock).toBeInTheDocument();
      expect(codeblock).toHaveTextContent(codeContent);

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Successfully loaded")).toBeInTheDocument();

      const select = screen.getByRole("combobox");
      expect(select).toHaveValue(MetadataPreviewFileSuffix.TURTLE);
    });

    it("does not render download button when codeContent is empty", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: false,
        hasError: false,
        liveRegionMessage: "",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.getByTestId("metadata-codeblock")).toBeInTheDocument();
    });

    it("does not render loading or error components in success state", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "test content",
        isLoading: false,
        hasError: false,
        liveRegionMessage: "",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      expect(
        screen.queryByText("Metadaten-Vorschau lädt..."),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("rerenders code content when file suffix changes", async () => {
      const user = userEvent.setup();
      const codeContent = "@prefix ex: <http://example.org/> .";
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent,
        isLoading: false,
        hasError: false,
        liveRegionMessage: "Successfully loaded",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      const codeblock = screen.getByTestId("metadata-codeblock");
      expect(codeblock).toHaveAttribute("data-suffix", "ttl");

      const select = screen.getByRole("combobox");
      expect(select).toHaveValue(MetadataPreviewFileSuffix.TURTLE);

      await user.selectOptions(select, MetadataPreviewFileSuffix.JSON_LD);

      expect(vi.mocked(useCodeContentFetch)).toHaveBeenCalledWith(
        "test-metadata",
        "jsonld",
      );
      expect(codeblock).toHaveAttribute("data-suffix", "jsonld");
    });
  });

  describe("Hook integration", () => {
    it("calls useCodeContentFetch with correct parameters", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "test content",
        isLoading: false,
        hasError: false,
        liveRegionMessage: "",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      expect(vi.mocked(useCodeContentFetch)).toHaveBeenCalledWith(
        "test-metadata",
        "ttl",
      );
      expect(vi.mocked(useCodeContentFetch)).toHaveBeenCalledTimes(1);
    });

    it("calls useDownloadClick with correct parameters", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "test content",
        isLoading: false,
        hasError: false,
        liveRegionMessage: "",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      expect(vi.mocked(useDownloadClick)).toHaveBeenCalledWith(
        "test-metadata",
        "ttl",
      );
      expect(vi.mocked(useDownloadClick)).toHaveBeenCalledTimes(1);
    });

    it("passes codeContent to handleDownload when download button is clicked", () => {
      const codeContent = "test content for download";
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent,
        isLoading: false,
        hasError: false,
        liveRegionMessage: "",
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      const downloadButton = screen.getByRole("button");
      downloadButton.click();

      expect(mockHandleDownload).toHaveBeenCalledWith(codeContent);
      expect(mockHandleDownload).toHaveBeenCalledTimes(1);
    });

    it("uses hook results consistently across renders", () => {
      const codeContent = "persistent content";
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent,
        isLoading: false,
        hasError: false,
        liveRegionMessage: "Content ready",
      });

      const { rerender } = render(
        <MetadataPreviewModalContent {...defaultProps} />,
      );

      expect(screen.getByText(codeContent)).toBeInTheDocument();
      expect(screen.getByText("Content ready")).toBeInTheDocument();

      rerender(<MetadataPreviewModalContent {...defaultProps} />);

      expect(screen.getByText(codeContent)).toBeInTheDocument();
      expect(screen.getByText("Content ready")).toBeInTheDocument();
    });
  });

  describe("Accessibility - Live region", () => {
    it("renders live region with correct attributes", () => {
      const liveRegionMessage = "Content loaded successfully";
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "test content",
        isLoading: false,
        hasError: false,
        liveRegionMessage,
      });

      render(<MetadataPreviewModalContent {...defaultProps} />);

      const liveRegion = screen.getByText(liveRegionMessage);
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
      expect(liveRegion).toHaveClass("sr-only");
    });

    it("updates live region message when it changes", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "test content",
        isLoading: false,
        hasError: false,
        liveRegionMessage: "Initial message",
      });

      const { rerender } = render(
        <MetadataPreviewModalContent {...defaultProps} />,
      );

      expect(screen.getByText("Initial message")).toBeInTheDocument();

      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "test content",
        isLoading: false,
        hasError: false,
        liveRegionMessage: "Updated message",
      });

      rerender(<MetadataPreviewModalContent {...defaultProps} />);
      expect(screen.getByText("Updated message")).toBeInTheDocument();
      expect(screen.queryByText("Initial message")).not.toBeInTheDocument();
    });

    it("renders empty live region when no message is provided", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "test content",
        isLoading: false,
        hasError: false,
        liveRegionMessage: "",
      });

      const { container } = render(
        <MetadataPreviewModalContent {...defaultProps} />,
      );

      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveTextContent("");
    });
  });

  describe("State transitions", () => {
    it("transitions from loading to success state", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: true,
        hasError: false,
        liveRegionMessage: "Loading...",
      });

      const { rerender } = render(
        <MetadataPreviewModalContent {...defaultProps} />,
      );
      expect(
        screen.getByText("Metadaten-Vorschau lädt..."),
      ).toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("metadata-codeblock"),
      ).not.toBeInTheDocument();

      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "loaded content",
        isLoading: false,
        hasError: false,
        liveRegionMessage: "Content loaded",
      });

      rerender(<MetadataPreviewModalContent {...defaultProps} />);
      expect(
        screen.queryByText("Metadaten-Vorschau lädt..."),
      ).not.toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByTestId("metadata-codeblock")).toBeInTheDocument();
      expect(screen.getByText("Content loaded")).toBeInTheDocument();
    });

    it("transitions from loading to error state", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: true,
        hasError: false,
        liveRegionMessage: "Loading...",
      });

      const { rerender } = render(
        <MetadataPreviewModalContent {...defaultProps} />,
      );

      expect(
        screen.getByText("Metadaten-Vorschau lädt..."),
      ).toBeInTheDocument();

      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: false,
        hasError: true,
        liveRegionMessage: "Error loading content",
      });

      rerender(<MetadataPreviewModalContent {...defaultProps} />);
      expect(
        screen.queryByText("Metadaten-Vorschau lädt..."),
      ).not.toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.queryByText("Download")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("metadata-codeblock"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Error loading content"),
      ).not.toBeInTheDocument();
    });

    it("transitions from error back to loading state", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: false,
        hasError: true,
        liveRegionMessage: "Error occurred",
      });
      const { rerender } = render(
        <MetadataPreviewModalContent {...defaultProps} />,
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();

      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: true,
        hasError: false,
        liveRegionMessage: "Retrying...",
      });

      rerender(<MetadataPreviewModalContent {...defaultProps} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(
        screen.getByText("Metadaten-Vorschau lädt..."),
      ).toBeInTheDocument();
      expect(screen.queryByText("Retrying...")).not.toBeInTheDocument();
    });

    it("transitions from success state with content to success state without content", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "initial content",
        isLoading: false,
        hasError: false,
        liveRegionMessage: "Content loaded",
      });
      const { rerender } = render(
        <MetadataPreviewModalContent {...defaultProps} />,
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("initial content")).toBeInTheDocument();

      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: "",
        isLoading: false,
        hasError: false,
        liveRegionMessage: "No content available",
      });

      rerender(<MetadataPreviewModalContent {...defaultProps} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.getByTestId("metadata-codeblock")).toBeInTheDocument();
      expect(screen.getByText("No content available")).toBeInTheDocument();
    });
  });

  describe("Edge cases and error handling", () => {
    it("handles null and undefined values in hook responses", () => {
      vi.mocked(useCodeContentFetch).mockReturnValue({
        codeContent: null as any,
        isLoading: false,
        hasError: false,
        liveRegionMessage: undefined as any,
      });

      expect(() => {
        render(<MetadataPreviewModalContent {...defaultProps} />);
      }).not.toThrow();
    });

    it("handles invalid prop combinations", () => {
      const testCases = [
        {
          metadataName: "",
        },
        {
          metadataName: "   ",
        },
        {
          metadataName: "test",
        },
      ];

      testCases.forEach((props) => {
        vi.mocked(useCodeContentFetch).mockReturnValue({
          codeContent: "test content",
          isLoading: false,
          hasError: false,
          liveRegionMessage: "",
        });

        const { unmount } = render(<MetadataPreviewModalContent {...props} />);

        expect(vi.mocked(useCodeContentFetch)).toHaveBeenCalledWith(
          props.metadataName,
          MetadataPreviewFileSuffix.TURTLE,
        );
        expect(vi.mocked(useDownloadClick)).toHaveBeenCalledWith(
          props.metadataName,
          MetadataPreviewFileSuffix.TURTLE,
        );

        unmount();
      });
    });
  });
});
