import { FeatureLike } from "ol/Feature";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

const strokeColor = "#0073a8";
const fillColor = "#0073A899";
const strokeWidth = 2;

const image = new CircleStyle({
  radius: 6,
  fill: new Fill({
    color: fillColor,
  }),
  stroke: new Stroke({ color: strokeColor, width: 1 }),
});

const styles = {
  Point: new Style({
    image: image,
  }),
  LineString: new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: strokeWidth,
    }),
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: strokeWidth,
    }),
  }),
  MultiPoint: new Style({
    image: image,
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: strokeWidth,
    }),
    fill: new Fill({
      color: fillColor,
    }),
  }),
  Polygon: new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: strokeWidth,
    }),
    fill: new Fill({
      color: fillColor,
    }),
  }),
  GeometryCollection: new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: strokeWidth,
    }),
    fill: new Fill({
      color: strokeColor,
    }),
    image: new CircleStyle({
      radius: 10,
      fill: undefined,
      stroke: new Stroke({
        color: strokeColor,
      }),
    }),
  }),
  Circle: new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: strokeWidth,
    }),
    fill: new Fill({
      color: fillColor,
    }),
  }),
  LinearRing: new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: strokeWidth,
    }),
    fill: new Fill({
      color: fillColor,
    }),
  }),
};

export const styleFunction = function (feature: FeatureLike) {
  const geometry = feature.getGeometry();

  return geometry ? styles[geometry.getType()] : undefined;
};
