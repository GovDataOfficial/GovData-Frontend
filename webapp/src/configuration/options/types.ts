import { Coordinate } from "ol/coordinate";
import { ViewOptions } from "ol/View";

export type ConfigurationOptions = {
  locationsearch: {
    view: ViewOptions;
    defaultBoundingBox: Coordinate[][];
  };
  resourcePreviewMap: {
    strokeColor: string;
    fillColor: string;
  };
};
