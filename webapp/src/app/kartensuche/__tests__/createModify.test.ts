import { describe, expect, it, vi } from "vitest";
import { Collection } from "ol";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";

import { createModify } from "../_lib/createModify";

describe("createModify", () => {
  const box = new Polygon([
    [
      [7.234, 50.913],
      [11.931, 50.913],
      [11.931, 48.879],
      [7.234, 48.879],
      [7.234, 50.913],
    ],
  ]);
  it("should create a Modify interaction with the given features", () => {
    const features = new Collection<Feature>([new Feature(box)]);
    const modify = createModify(features);

    expect(modify).toBeDefined();
    expect(modify["features_"]).toEqual(features.getArray());
  });

  it("should handle up event and update the feature", () => {
    const features = new Collection<Feature>([new Feature(box)]);
    const modify = createModify(features);
    const mockEvent = { coordinate: [1, 1] } as any;

    modify["dragSegments_"] = [
      [
        {
          feature: features.item(0),
          segment: [
            [1405705.9953378818, 7012918.977019658],
            [1421085.4582037204, 7015946.004177967],
          ],
          depth: [0],
          geometry: features.item(0).getGeometry(),
        },
        ,
        1,
      ],
      [
        {
          feature: features.item(0),
          segment: [
            [1421085.4582037204, 7015946.004177967],
            [1418555.0140741442, 7006596.443990704],
          ],
          depth: [0],
          geometry: features.item(0).getGeometry(),
        },
        ,
        0,
      ],
    ];
    const update = vi.fn();
    modify["rBush_"].update = update;
    modify["handleUpEvent"](mockEvent);

    expect(modify["rBush_"].update).toHaveBeenCalled();
    const geometry = features.item(0).getGeometry() as Polygon;
    expect(geometry.getCoordinates()).toEqual([
      [
        [7.234, 50.913],
        [11.931, 50.913],
        [11.931, 48.879],
        [7.234, 48.879],
        [7.234, 50.913],
      ],
    ]);
  });

  it("should create or update vertex feature only if coordinates match", () => {
    const polygon = new Polygon([
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ]);
    const features = new Collection<Feature>([new Feature(polygon)]);
    const modify = createModify(features);
    const coordinates = [0, 0];
    const mockFeatures = [new Feature()];
    const mockGeometries = [polygon];

    const vertexFeature = modify["createOrUpdateVertexFeature_"](
      coordinates,
      mockFeatures,
      mockGeometries,
      true,
    );

    expect(vertexFeature).toBeDefined();
    expect(vertexFeature.getGeometry().getCoordinates()).toEqual(coordinates);
  });

  it("should handle drag event and update the geometry coordinates", () => {
    const features = new Collection<Feature>([new Feature(box)]);
    const modify = createModify(features);
    const mockEvent = {
      coordinate: [1436238.3849985118, 6874185.63082167],
    } as any;

    modify["dragSegments_"] = [
      [
        {
          feature: features.item(0),
          segment: [
            [672401.2504190382, 6768052.817047703],
            [1436238.3849985118, 6874185.63082167],
          ],
          index: 0,
          depth: [0],
          geometry: features.item(0).getGeometry(),
        },
        1,
      ],
      [
        {
          feature: features.item(0),
          segment: [
            [1436238.3849985118, 6874185.63082167],
            [1331349.5838598856, 6474534.628432627],
          ],
          depth: [0],
          index: 1,
          geometry: features.item(0).getGeometry(),
        },
        0,
      ],
    ];
    const setGeometryCoordinates = vi.fn();
    modify["setGeometryCoordinates_"] = setGeometryCoordinates;
    modify["handleDragEvent"](mockEvent);

    expect(setGeometryCoordinates.mock.calls[0][1]).toEqual([
      [
        [7.234, 6874185.63082167],
        [1436238.3849985118, 6874185.63082167],
        [1436238.3849985118, 48.879],
        [7.234, 48.879],
        [7.234, 6874185.63082167],
      ],
    ]);
  });
});
