import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MetadataPreviewFileSuffix } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewFileFormats";
import { MetadataPreviewFileSuffixSelect } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewFileSuffixSelect";

describe("MetadataPreviewFileSuffixSelect", () => {
  const mockOnSuffixChange = vi.fn();
  const defaultProps = {
    fileSuffix: MetadataPreviewFileSuffix.TURTLE,
    onSuffixChange: mockOnSuffixChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders select with correct options", () => {
    render(<MetadataPreviewFileSuffixSelect {...defaultProps} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    // Should contain the correct options
    expect(select).toHaveTextContent("Turtle");
    expect(select).toHaveTextContent("JSON-LD");
    expect(select).toHaveTextContent("RDF/XML");
  });

  it("calls onSuffixChange when an option is selected", async () => {
    const user = userEvent.setup();

    render(
      <MetadataPreviewFileSuffixSelect
        {...defaultProps}
        onSuffixChange={mockOnSuffixChange}
      />,
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, MetadataPreviewFileSuffix.JSON_LD);

    expect(mockOnSuffixChange).toHaveBeenCalledWith(
      MetadataPreviewFileSuffix.JSON_LD,
    );
  });
  it("has the correct initial value", () => {
    render(<MetadataPreviewFileSuffixSelect {...defaultProps} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue(MetadataPreviewFileSuffix.TURTLE);
  });
  it("has the correct label", () => {
    render(<MetadataPreviewFileSuffixSelect {...defaultProps} />);

    const label = screen.getByText(/format/i);
    expect(label).toBeInTheDocument();
  });
});
