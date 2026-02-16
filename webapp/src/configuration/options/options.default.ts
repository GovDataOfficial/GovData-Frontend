import Polygon from "ol/geom/Polygon";
import { fromLonLat } from "ol/proj";

import { ConfigurationOptions } from "@/configuration/options/types";

export const defaultConfigurationOptions: ConfigurationOptions = {
  locationsearch: {
    view: {
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
    defaultBoundingBox: [
      [
        [5.582, 52.088], // left upper corner 52.088/5.582
        [12.417, 52.088], // right upper corner 52.088 12.417
        [12.417, 49.885], // right lower corner 49.885/12.417
        [5.582, 49.885], // left lower corner 49.885 5.582
        [5.582, 52.088], // left upper corner 52.088/5.582
      ],
    ],
  },
  resourcePreviewMap: {
    strokeColor: "#0073a8",
    fillColor: "#0073A899",
  },
};
