import { Map, View } from "ol";
import { getCenter, getSize } from "ol/extent";
import Feature from "ol/Feature";
import { SimpleGeometry } from "ol/geom";
import MultiPoint from "ol/geom/MultiPoint";
import Polygon from "ol/geom/Polygon";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import TileWMS from "ol/source/TileWMS";
import { Circle, Fill, Stroke, Style } from "ol/style";

import {
  boundingBoxNumberCoordinates,
  MappedSuggest,
  ProjectionName,
} from "@/types/types";

export const styles = [
  new Style({
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.3)",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 0, 0.1)",
    }),
  }),
  new Style({
    image: new Circle({
      radius: 8,
      fill: new Fill({
        color: "#3d3d3d",
      }),
    }),
    geometry: function (feature) {
      // return the coordinates of the first ring of the polygon
      const geometry = feature.getGeometry() as Polygon;
      const coordinates = geometry.getCoordinates()![0];
      return new MultiPoint(coordinates);
    },
  }),
];

/**
 * Creates a new OpenLayers view.
 *
 * @param {boolean} isOSMActive - Indicates whether OSM is used.
 * @returns {View} - The created OpenLayers view.
 */
export function createView(isOSMActive: boolean): View {
  return new View(
    isOSMActive
      ? // set center to Stuttgart since OSM is currently only used for BW
        {
          center: fromLonLat([9, 48.66]),
          zoom: 8,
          minZoom: 6,
          maxZoom: 20,
        }
      : {
          center: fromLonLat([9, 51]),
          zoom: 6,
          minZoom: 5,
          maxZoom: 20,
          // prevent panning outside of the map extent
          extent: [
            -1485382.3492853835, 5242175.946452834, 4073459.67079747,
            8025039.157897306,
          ],
        },
  );
}

/**
 * Creates a new OpenLayers tile layer.
 *
 * @param {boolean} isOSMActive - Indicates whether OSM is used.
 * @param {string} tileUrl - The URL of the tile server; only relevant if OSM is not used.
 * @returns {TileLayer} - The created OpenLayers tile layer.
 */
export function createTileLayer(isOSMActive: boolean, tileUrl: string) {
  if (isOSMActive) {
    return new TileLayer({
      source: new OSM(),
    });
  } else {
    return new TileLayer({
      source: new TileWMS({
        url: tileUrl,
        params: {
          layers: "de_basemapde_web_raster_farbe",
        },
        serverType: "geoserver",
      }),
    });
  }
}

/**
 * Validates the bounding box value. If the value is invalid, the default bounding box is used.
 *
 * @param {string} [bbox] - The bounding box value as a string.
 * @returns {boolean} - True if the bounding box value is valid, false otherwise.
 */
export function validateBoundingBoxValue(bbox?: string) {
  let bboxValid = false;
  if (bbox && bbox.length > 0) {
    // there is already a boundingbox, parse it and use it
    const bboxcoords = bbox.split(",");
    if (bboxcoords.length === 4) {
      bboxValid = true;
    }
  }
  return bboxValid;
}

/**
 * Creates a feature for a bounding box string.
 *
 * @param {string} [boundingboxfield] - The bounding box value as a string.
 * @returns {Feature} - The created OpenLayers feature.
 */
export function getFeatureForBoundingBox(boundingboxfield?: string) {
  // default box
  let box = new Polygon([
    [
      [5.582, 52.088], // left upper corner 52.088/5.582
      [12.417, 52.088], // right upper corner 52.088 12.417
      [12.417, 49.885], // right lower corner 49.885/12.417
      [5.582, 49.885], // left lower corner 49.885 5.582
      [5.582, 52.088], // left upper corner 52.088/5.582
    ],
  ]);
  if (boundingboxfield && boundingboxfield.length > 0) {
    // there is already a boundingbox, parse it and use it
    const bboxcoords = boundingboxfield.split(",");
    if (bboxcoords.length === 4) {
      const minX = parseFloat(bboxcoords[0]);
      const minY = parseFloat(bboxcoords[1]);
      const maxX = parseFloat(bboxcoords[2]);
      const maxY = parseFloat(bboxcoords[3]);

      box = new Polygon([
        [
          [minX, maxY], // left upper corner
          [maxX, maxY], // right upper corner
          [maxX, minY], // right lower corner
          [minX, minY], // left lower corner
          [minX, maxY], // left upper corner
        ],
      ]);
    }
  }

  box.transform(ProjectionName.EPSG4326, ProjectionName.EPSG3857); // WGS 84 -> Mercator
  return new Feature(box);
}

/**
 * Centers the map's view on a given feature's bounding box.
 *
 * @param {Map} map - The OpenLayers map instance.
 * @param {Feature} feature - The feature to center on.
 */
export function fitViewToBox(map: Map, feature: Feature) {
  const geometry = feature.getGeometry() as SimpleGeometry;
  if (geometry) {
    // fit the view with 100px padding around the selection box
    map.getView().fit(geometry, {
      size: map.getSize(),
      padding: [100, 100, 100, 100],
    });
  }
}

/**
 * Centers and resizes the selection polygon to fit the current view.
 *
 * @param {Map} map - The OpenLayers map instance.
 * @param {Feature} feature - The feature to center and resize.
 */
export function fitBoxToView(map: Map, feature: Feature) {
  // center and resize select-polygon fitting the current view
  const factorX = 0.3;
  const factorY = 0.3;

  const extent = map.getView().calculateExtent(map.getSize());
  const center = getCenter(extent);
  const size = getSize(extent);
  const scaledSize = [(size[0] / 2) * factorX, (size[1] / 2) * factorY];

  const topleft = [center[0] - scaledSize[0], center[1] - scaledSize[1]];
  const bottomright = [center[0] + scaledSize[0], center[1] + scaledSize[1]];

  const geometry = feature.getGeometry() as Polygon;
  if (geometry) {
    geometry.setCoordinates([
      [
        [topleft[0], bottomright[1]],
        bottomright,
        [bottomright[0], topleft[1]],
        topleft,
        [topleft[0], bottomright[1]],
      ],
    ]);
  }

  feature.changed();
}

/**
 * Transforms a bounding box from EPSG:4326 to EPSG:3857.
 *
 * @param {number[]} bbox - The bounding box coordinates.
 * @returns {Polygon} - The transformed bounding box as a polygon.
 */
export function transformBBox(bbox: number[]) {
  let newbox = new Polygon([
    [
      [bbox[0], bbox[3]],
      [bbox[2], bbox[3]],
      [bbox[2], bbox[1]],
      [bbox[0], bbox[1]],
      [bbox[0], bbox[3]],
    ],
  ]);
  newbox.transform(ProjectionName.EPSG4326, ProjectionName.EPSG3857); // WGS 84 -> Mercator

  // if the bbox is too tiny, enlarge it
  if (newbox.getArea() < 10000) {
    const r = 0.0003;
    const minX = bbox[0] - r;
    const minY = bbox[1] - r;
    const maxX = bbox[2] + r;
    const maxY = bbox[3] + r;
    newbox = new Polygon([
      [
        [minX, maxY],
        [maxX, maxY],
        [maxX, minY],
        [minX, minY],
        [minX, maxY],
      ],
    ]);
    newbox.transform(ProjectionName.EPSG4326, ProjectionName.EPSG3857); // WGS 84 -> Mercator
  }

  return newbox;
}

/**
 * Generates a polygon from a mapped suggestion.
 * OSM returns string coordinates, while other services return number coordinates.
 *
 * @param {MappedSuggest} mappedSuggest - The mapped suggestion containing bounding box information.
 * @param {boolean} isOSMActive - Flag indicating if OpenStreetMap (OSM) is active.
 * @returns {Polygon} The transformed bounding box as a polygon.
 */
export function getPolygonFromMappedSuggest(
  mappedSuggest: MappedSuggest,
  isOSMActive: boolean,
) {
  let bbox;
  if (mappedSuggest && isOSMActive) {
    // string coordinates
    bbox = [
      parseFloat(mappedSuggest.boundingbox[2]),
      parseFloat(mappedSuggest.boundingbox[0]),
      parseFloat(mappedSuggest.boundingbox[3]),
      parseFloat(mappedSuggest.boundingbox[1]),
    ];
  } else {
    // number coordinates
    bbox = mappedSuggest.boundingbox as boundingBoxNumberCoordinates;
  }
  return transformBBox(bbox);
}
