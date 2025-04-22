import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { icons } from "@/app/_components/SVG/iconMap";
import { ResourceFormatShort } from "@/types/types";

import { ResourcePreviewIcon } from "../../_components/ResourceTable/ResourcePreview/ResourcePreviewIcon";

describe("ResourcePreviewIcon", () => {
  const onClick = vi.fn();

  it("renders the correct icon for geojson format", () => {
    const { container } = render(
      <ResourcePreviewIcon
        formatShort={ResourceFormatShort.geojson}
        onClick={onClick}
      />,
    );
    const imgElement = container.querySelector("img");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", icons.mapMarker);
  });

  it("renders nothing for an unsupported format", () => {
    const { container } = render(
      <ResourcePreviewIcon formatShort="unsupported" onClick={onClick} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing for an empty format", () => {
    const { container } = render(
      <ResourcePreviewIcon formatShort="" onClick={onClick} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders the correct icon for geojson format case insensitive", () => {
    const { container } = render(
      <ResourcePreviewIcon formatShort="GeoJson" onClick={onClick} />,
    );
    const imgElement = container.querySelector("img");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", icons.mapMarker);
  });

  it("should call onClick listener", async () => {
    render(<ResourcePreviewIcon formatShort="GeoJson" onClick={onClick} />);
    const user = userEvent.setup();
    const button = screen.getByRole("button");
    await user.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
