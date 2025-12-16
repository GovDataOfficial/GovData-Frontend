import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { apply } from "ol-mapbox-style";

import { ResourcePreviewMap } from "../../_components/ResourceTable/ResourcePreview/ResourcePreviewMap";

vi.mock("ol/View", () => ({
  default: class {
    setCenter() {}
    setZoom() {}
  },
}));

vi.mock("ol/layer/Tile", () => ({
  default: class {},
}));

vi.mock("ol/source/Vector", () => ({
  default: class {
    on() {}
    getExtent() {
      return [0, 0, 0, 0];
    }
  },
}));

vi.mock("ol/layer/Vector", () => ({
  default: class {
    addEventListener() {}
    getLayerStatesArray() {}
  },
}));

vi.mock("ol/format/GeoJSON", () => ({
  default: class {
    readFeatures() {}
  },
}));

vi.mock("ol-mapbox-style", () => ({
  apply: vi.fn().mockResolvedValue({}),
}));

describe("ResourcePreviewMap", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
    });
  });

  class ResizeObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  beforeAll(() => {
    // Stub the global ResizeObserver for the map component
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it("renders the map without crashing", () => {
    const { container } = render(
      <ResourcePreviewMap
        metadataId="new-test-id"
        resourceData={{}}
        resourceId="resource-id"
        resourceFormat="GeoJSON"
        tileUrl="https://tile.url"
        mobile={false}
      />,
    );
    expect(screen.getAllByRole("button")).toHaveLength(5);
    expect(
      container.querySelector("#map-preview-geojson-resource-id"),
    ).toBeInTheDocument();
  });

  it("calls the applyMapboxStyle function with the correct arguments", () => {
    render(
      <ResourcePreviewMap
        metadataId="new-test-id"
        resourceData={{}}
        resourceId="resource-id"
        resourceFormat="GeoJSON"
        tileUrl="https://tile.url"
        mobile={false}
      />,
    );
    expect(vi.mocked(apply)).toHaveBeenCalledWith(
      expect.any(Object),
      "https://tile.url",
    );
  });
});
