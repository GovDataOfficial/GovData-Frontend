import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MetadataPreviewDownloadButton } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewDownloadButton";

describe("MetadataPreviewDownloadButton", () => {
  const defaultProps = {
    onDownload: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders button with correct text content", () => {
    render(<MetadataPreviewDownloadButton {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Should contain the download text with format
    expect(button).toHaveTextContent("Download");
  });

  it("calls onDownload when clicked", async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    render(
      <MetadataPreviewDownloadButton
        {...defaultProps}
        onDownload={onDownload}
      />,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };

    render(<MetadataPreviewDownloadButton {...defaultProps} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("can be triggered with keyboard", async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    render(
      <MetadataPreviewDownloadButton
        {...defaultProps}
        onDownload={onDownload}
      />,
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");

    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it("can be triggered with spacebar", async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    render(
      <MetadataPreviewDownloadButton
        {...defaultProps}
        onDownload={onDownload}
      />,
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard(" ");

    expect(onDownload).toHaveBeenCalledTimes(1);
  });
});
