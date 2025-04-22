import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { DtResourcePreview } from "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreview";
import { useFetchPreviewData } from "@/app/suche/_components/ResourceTable/ResourcePreview/useFetchPreviewData";
import { ResourceFormatShort } from "@/types/types";

vi.mock(
  "@/app/suche/_components/ResourceTable/ResourcePreview/useFetchPreviewData",
  () => ({
    useFetchPreviewData: vi.fn(),
  }),
);

vi.mock(
  "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreviewMap",
  () => ({ ResourcePreviewMap: () => <div>ResourcePreviewMap</div> }),
);

vi.mock(
  "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreviewLoading",
  () => ({ ResourcePreviewLoading: () => <div>Loading...</div> }),
);

vi.mock(
  "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreviewError",
  () => ({ ResourcePreviewError: () => <div>Error loading preview</div> }),
);

describe("DtResourcePreview", () => {
  const defaultProps = {
    metadataId: "test-id",
    resourceFormat: ResourceFormatShort.geojson,
    resourceUrl: "http://example.com/resource",
    resourceId: "resource-id",
    mobile: false,
    tileUrl: "https://tile.url",
    previewRef: { current: null },
  };

  it("renders ResourcePreviewMap when resourceFormat is geojson", () => {
    vi.mocked(useFetchPreviewData).mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: null,
    });
    render(<DtResourcePreview {...defaultProps} />);
    expect(screen.getByText(/ResourcePreviewMap/i)).toBeDefined();
  });

  it("does not render anything when resourceFormat is not geojson", () => {
    const props = { ...defaultProps, resourceFormat: "pdf" };
    const { container } = render(<DtResourcePreview {...props} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders loading state", () => {
    vi.mocked(useFetchPreviewData).mockReturnValueOnce({
      data: null,
      isLoading: true,
      error: null,
    });
    render(<DtResourcePreview {...defaultProps} />);
    expect(screen.getByText(/Loading.../i)).toBeDefined();
  });

  it("renders error state", () => {
    vi.mocked(useFetchPreviewData).mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: "Error loading preview",
    });

    render(<DtResourcePreview {...defaultProps} />);
    expect(screen.getByText(/Error loading preview/i)).toBeDefined();
  });
});
