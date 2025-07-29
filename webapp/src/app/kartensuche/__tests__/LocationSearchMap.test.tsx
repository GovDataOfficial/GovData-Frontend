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
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import { act } from "react";

import * as olUtils from "@/app/kartensuche/_lib/olUtils";
import { MappedSuggest } from "@/types/types";

import {
  LocationSearchMap,
  LocationSearchMapProps,
} from "../_components/LocationSearchMap";

describe("LocationSearchMap", () => {
  const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  const defaultProps: LocationSearchMapProps = {
    isOSMActive: false,
    tileUrl: "",
    onBoundingBoxChanged: vi.fn(),
    boundingBox: "10,20,30,40",
    mappedSuggest: {
      boundingbox: [20, 10, 40, 30],
    } as MappedSuggest,
  };

  beforeAll(() => {
    // Stub the global ResizeObserver for the map component
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  beforeEach(() => {
    vi.restoreAllMocks;
  });

  it("renders without crashing", () => {
    render(<LocationSearchMap {...defaultProps} />);
    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("calls onBoundingBoxChanged when bounding box changes", async () => {
    const polygon = new Polygon([
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ]);
    const mockFeature = new Feature(polygon);
    vi.spyOn(olUtils, "getFeatureForBoundingBox").mockReturnValue(mockFeature);
    const onBoundingBoxChanged = vi.fn();
    render(
      <LocationSearchMap
        {...defaultProps}
        onBoundingBoxChanged={onBoundingBoxChanged}
      />,
    );
    expect(onBoundingBoxChanged).not.toHaveBeenCalled();
    mockFeature.changed();
    await act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onBoundingBoxChanged).toHaveBeenCalled();
  });

  it("calls onBoundingBoxChanged when bounding box is empty", () => {
    const polygon = new Polygon([
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ]);
    const mockFeature = new Feature(polygon);
    vi.spyOn(olUtils, "getFeatureForBoundingBox").mockReturnValue(mockFeature);
    const onBoundingBoxChanged = vi.fn();
    render(
      <LocationSearchMap
        {...{ ...defaultProps, boundingBox: undefined }}
        onBoundingBoxChanged={onBoundingBoxChanged}
      />,
    );
    expect(onBoundingBoxChanged).toHaveBeenCalled();
  });

  it("updates map when mappedSuggest changes", () => {
    const { rerender } = render(<LocationSearchMap {...defaultProps} />);
    const newMappedSuggest = {
      boundingbox: [25, 15, 35, 45],
    } as MappedSuggest;

    const fitViewToBox = vi.spyOn(olUtils, "fitViewToBox");

    rerender(
      <LocationSearchMap {...defaultProps} mappedSuggest={newMappedSuggest} />,
    );
    const geometry = fitViewToBox.mock.calls[0][1].getGeometry() as Polygon;
    const coordinates = geometry.getCoordinates();
    expect(coordinates).toEqual([
      [
        [2782987.2698318395, 5621521.486192066],
        [3896182.1777645755, 5621521.486192066],
        [3896182.1777645755, 1689200.1396078935],
        [2782987.2698318395, 1689200.1396078935],
        [2782987.2698318395, 5621521.486192066],
      ],
    ]);
  });
});
