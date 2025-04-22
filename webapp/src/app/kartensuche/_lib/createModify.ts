import { Collection, MapBrowserEvent } from "ol";
import { Coordinate, equals as coordinatesEqual } from "ol/coordinate";
import { boundingExtent } from "ol/extent";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import SimpleGeometry from "ol/geom/SimpleGeometry";
import Modify from "ol/interaction/Modify";
import { Circle, Fill, Stroke, Style } from "ol/style";

/**
 * Creates a custom Modify interaction for OpenLayers with specific behavior.
 *
 * @param {Collection<Feature>} features - A collection of features to be modified.
 * @returns {Modify} - The custom Modify interaction.
 *
 * The custom Modify interaction includes:
 * - A pixel tolerance of 30 for detecting modifications.
 * - Disabling vertex insertion and deletion.
 * - Custom styling for the modification points.
 * - Overridden `handleUpEvent` to update the rBush and emit a change event for the feature.
 * - Overridden `createOrUpdateVertexFeature_` to only show allowed actions and create/update vertex features.
 * - Overridden `handleDragEvent` to maintain the box shape during dragging.
 */
export function createModify(features: Collection<Feature>) {
  const modify = new Modify({
    features: features,
    pixelTolerance: 30,
    insertVertexCondition: () => false,
    deleteCondition: () => false,
    style: new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({
          color: "#FFFFFF",
        }),
        stroke: new Stroke({
          color: "#3d3d3d",
          width: 2,
        }),
      }),
    }),
  });

  function setCursorStyle(cursorStyle: string) {
    const map = modify.getMap();
    if (!map) {
      return;
    }
    const mapTarget = map.getTargetElement();
    mapTarget.style.cursor = cursorStyle;
  }

  modify["handleUpEvent"] = function (evt: MapBrowserEvent<any>) {
    // overwrite to modify function
    let segmentData;
    for (let i = this["dragSegments_"].length - 1; i >= 0; --i) {
      segmentData = this["dragSegments_"][i][0];
      this["rBush_"].update(boundingExtent(segmentData.segment), segmentData);
    }

    // modification: tell the cache to update by emitting change-event!
    // Assuming we only have one certain feature in the collection
    this["features_"].item(0).changed();

    setCursorStyle("pointer");
    return false;
  };

  modify["createOrUpdateVertexFeature_"] = function (
    coordinates: Coordinate,
    features: Feature[],
    geometries: SimpleGeometry[],
    existing: boolean,
  ) {
    // override hover to only show allowed actions
    // check if the coordinates / vertexFeature point to a corner of our box
    const featureGeometry = this["features_"].item(0).getGeometry();
    const nodes = featureGeometry.getCoordinates()[0];
    let goodcoordinate = false;
    for (let i = 0; i < nodes.length; i++) {
      if (coordinatesEqual(nodes[i], coordinates)) {
        goodcoordinate = true;
      }
    }
    if (!goodcoordinate) {
      return this["vertexFeature_"];
    }

    // below: original function
    let vertexFeature = this["vertexFeature_"];
    if (!vertexFeature) {
      vertexFeature = new Feature(new Point(coordinates));
      this["vertexFeature_"] = vertexFeature;
      this["overlay_"].getSource().addFeature(vertexFeature);
    } else {
      let geometry = vertexFeature.getGeometry();
      geometry.setCoordinates(coordinates);
    }
    vertexFeature.set("features", features);
    vertexFeature.set("geometries", geometries);
    vertexFeature.set("existing", existing);
    return vertexFeature;
  };

  modify["handleDragEvent"] = function (evt: MapBrowserEvent<any>) {
    setCursorStyle("grabbing");

    // override dragEvent to keep box shape
    modify["ignoreNextSingleClick_"] = false;
    modify["willModifyFeatures_"](evt, this["dragSegments_"]);

    const vertex = evt.coordinate;

    for (let i = 0, ii = modify["dragSegments_"].length; i < ii; ++i) {
      const dragSegment = modify["dragSegments_"][i];
      const segmentData = dragSegment[0];
      const depth = segmentData.depth;
      const geometry = segmentData.geometry;
      const coordinates = geometry.getCoordinates();
      const segment = segmentData.segment;
      const index = dragSegment[1];

      while (vertex.length < geometry.getStride()) {
        vertex.push(0);
      }

      // modify dragged vertex
      coordinates[depth[0]][segmentData.index + index] = vertex;
      segment[index] = vertex;

      // modify connected vertices
      switch (segmentData.index + index) {
        case 4:
        case 0: // upper left corner
          coordinates[0][3][0] = vertex[0]; // x
          coordinates[0][1][1] = vertex[1]; // y
          break;

        case 1: // upper right corner
          coordinates[0][0][1] = vertex[1]; // y
          coordinates[0][4][1] = vertex[1]; // y
          coordinates[0][2][0] = vertex[0]; // x
          break;

        case 2: // lower right corner
          coordinates[0][1][0] = vertex[0]; // x
          coordinates[0][3][1] = vertex[1]; // y
          break;

        case 3: // lower left corner
          coordinates[0][2][1] = vertex[1]; // y
          coordinates[0][0][0] = vertex[0]; // x
          coordinates[0][4][0] = vertex[0]; // x
          break;
      }
      this["setGeometryCoordinates_"](geometry, coordinates);
    }
    this["createOrUpdateVertexFeature_"](vertex);
  };

  const overlaySource = modify.getOverlay().getSource();
  if (overlaySource) {
    overlaySource.on(["addfeature", "removefeature"], function (evt) {
      const cursorStyle = evt.type === "addfeature" ? "pointer" : "";
      setCursorStyle(cursorStyle);
    });
  }
  return modify;
}
