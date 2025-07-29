import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { render, screen } from "@testing-library/react";

import { MetadataPreviewDownloadAnchor } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewDownloadAnchor";

describe("MetadataPreviewDownloadAnchor", () => {
  const defaultProps = {
    metadataName: "metadata_max",
    backendUrl: "http://test/ckan",
  };

  it("renders anchor with correct href", () => {
    render(<MetadataPreviewDownloadAnchor {...defaultProps} />);

    const anchor = screen.getByRole("link");
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("href", "http://test/ckan/metadata_max.ttl");
  });
});
