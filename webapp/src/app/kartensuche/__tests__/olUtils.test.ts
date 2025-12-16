import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { Map, View } from "ol";
import { getCenter } from "ol/extent";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import TileWMS from "ol/source/TileWMS";

import {
  createTileLayer,
  createView,
  fitBoxToView,
  fitViewToBox,
  getFeatureForBoundingBox,
  transformBBox,
  validateBoundingBoxValue,
} from "../_lib/olUtils";

describe("olUtils", () => {
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
  });

  it("should create a view with OSM active", () => {
    const view = createView(true);
    expect(view).toBeInstanceOf(View);
    expect(view.getCenter()).toEqual(fromLonLat([9, 48.66]));
    expect(view.getZoom()).toBe(8);
  });

  it("should create a view with OSM inactive", () => {
    const view = createView(false);
    expect(view).toBeInstanceOf(View);
    expect(view.getCenter()).toEqual(fromLonLat([9, 51]));
    expect(view.getZoom()).toBe(6);
  });

  it("should create a tile layer with OSM active", () => {
    const layer = createTileLayer(true, "");
    expect(layer).toBeInstanceOf(TileLayer);
    expect(layer.getSource()).toBeInstanceOf(OSM);
  });

  it("should create a tile layer with OSM inactive", () => {
    const tileUrl = "http://example.com/wms";
    const layer = createTileLayer(false, tileUrl);
    expect(layer).toBeInstanceOf(TileLayer);
    expect(layer.getSource()).toBeInstanceOf(TileWMS);
  });

  it("should validate bounding box value correctly", () => {
    expect(validateBoundingBoxValue("7.234,50.913,11.931,48.879")).toBe(true);
    expect(validateBoundingBoxValue("")).toBe(false);
    expect(validateBoundingBoxValue("7.234,50.913")).toBe(false);
  });

  it("should get feature from bounding box", () => {
    const feature = getFeatureForBoundingBox("");
    expect(feature).toBeInstanceOf(Feature);
    const geometry = feature.getGeometry() as Polygon;
    expect(geometry.getCoordinates()[0]).toHaveLength(5);
  });

  it("should center map on box", () => {
    const map = new Map({
      view: new View({
        center: fromLonLat([1, 1]),
        zoom: 8,
        minZoom: 5,
        maxZoom: 20,
      }),
    });
    const feature = getFeatureForBoundingBox("");
    fitViewToBox(map, feature);
    const view = map.getView();
    const viewExtent = view.calculateExtent();
    const geometry = feature.getGeometry() as Polygon;
    const featureExtent = geometry.getExtent();
    expect(viewExtent[0]).toBeGreaterThanOrEqual(featureExtent[0]);
    expect(viewExtent[1]).toBeGreaterThanOrEqual(featureExtent[1]);
    expect(viewExtent[2]).toBeLessThanOrEqual(featureExtent[2]);
    expect(viewExtent[3]).toBeLessThanOrEqual(featureExtent[3]);
  });

  it("should center selection", () => {
    const map = new Map({
      view: new View({
        center: fromLonLat([9, 51]),
        zoom: 6,
        minZoom: 5,
        maxZoom: 20,
      }),
    });
    const feature = getFeatureForBoundingBox("1,0,0,1");
    const geometryBefore = feature.getGeometry() as Polygon;
    const coordinatesBefore = geometryBefore.getCoordinates()[0];
    expect(coordinatesBefore[0][0]).toEqual(111319.49079327358);
    fitBoxToView(map, feature);
    const geometry = feature.getGeometry() as Polygon;
    expect(geometry.getCoordinates()[0]).toHaveLength(5);
    const coordinates = geometry.getCoordinates()[0];
    expect(coordinates[0][0]).toEqual(965185.6435625774);
  });

  it("should transform bounding box", () => {
    const bbox = [7.234, 48.879, 11.931, 50.913];
    const transformedBox = transformBBox(bbox);
    expect(transformedBox).toBeInstanceOf(Polygon);
    expect(transformedBox.getCoordinates()[0]).toHaveLength(5);
    expect(transformedBox.getCoordinates()[0][0]).toEqual([
      805285.196398541, 6605918.834460859,
    ]);
  });

  it("should enlarge bounding box", () => {
    const bbox = [1, 1, 1, 1];
    const transformedBox = transformBBox(bbox);
    expect(transformedBox).toBeInstanceOf(Polygon);
    expect(transformedBox.getCoordinates()[0]).toHaveLength(5);
    expect(transformedBox.getCoordinates()[0][0]).toEqual([
      111286.09494603559, 111358.54380227273,
    ]);
  });
});
