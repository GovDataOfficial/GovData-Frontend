import "ol/ol.css";

import { useEffect, useRef } from "react";
import { Collection, Map } from "ol";
import { Attribution, defaults as defaultControls } from "ol/control";
import Feature from "ol/Feature";
import Geolocation from "ol/Geolocation";
import Polygon from "ol/geom/Polygon";
import VectorLayer from "ol/layer/Vector";
import { transformExtent } from "ol/proj";
import VectorSource from "ol/source/Vector";

import { debounce } from "@/app/_lib/debounce";
import { CenterSelectionControl } from "@/app/kartensuche/_lib/CenterSelectionControl";
import { createModify } from "@/app/kartensuche/_lib/createModify";
import {
  createTileLayer,
  createView,
  fitBoxToView,
  fitViewToBox,
  getFeatureForBoundingBox,
  getPolygonFromMappedSuggest,
  styles,
  validateBoundingBoxValue,
} from "@/app/kartensuche/_lib/olUtils";
import { i18n } from "@/i18n";
import { MappedSuggest, ProjectionName } from "@/types/types";

const mapId = "map";

export type LocationSearchMapProps = {
  isOSMActive: boolean;
  tileUrl: string;
  onBoundingBoxChanged: (boundingBox: string) => void;
  boundingBox?: string;
  mappedSuggest?: MappedSuggest;
};

export function LocationSearchMap({
  isOSMActive,
  tileUrl,
  onBoundingBoxChanged,
  boundingBox,
  mappedSuggest,
}: LocationSearchMapProps) {
  const mapRef = useRef<Map | null>(null);

  // called when a search polygons vertex is dragged
  const boundingBoxChange = debounce((feature: Feature) => {
    const geometry = feature.getGeometry();
    if (geometry) {
      // extent can be used as parameter for the bounding box as we have a rectangle
      const extent = geometry.getExtent();
      const boundingbox = transformExtent(
        extent,
        ProjectionName.EPSG3857,
        ProjectionName.EPSG4326,
      );
      onBoundingBoxChanged(boundingbox.toString());
    }
  }, 300);

  useEffect(() => {
    if (mapRef.current) {
      return;
    }

    const feature = getFeatureForBoundingBox(boundingBox);
    feature.on("change", function () {
      boundingBoxChange(feature);
    });
    const features = new Collection([feature]);

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features,
      }),
      style: styles,
    });

    // dependeing on whether OSM is active different coordinates are used
    const map = new Map({
      target: mapId,
      layers: [createTileLayer(isOSMActive, tileUrl), vectorLayer],
      view: createView(isOSMActive),
      controls: defaultControls({
        rotate: false,
        attributionOptions: { collapsible: false },
        zoomOptions: {
          zoomInTipLabel: i18n.t("map.zoomIn"),
          zoomOutTipLabel: i18n.t("map.zoomOut"),
        },
      }),
    });

    map.addControl(
      new CenterSelectionControl(() => fitBoxToView(map, feature)),
    );
    if (!isOSMActive) {
      map.addControl(
        new Attribution({
          collapsible: false,
          attributions: `© 2024 basemap.de / BKG`,
        }),
      );
    }

    // makes the search polygon editable
    map.addInteraction(createModify(features));

    map.once("postrender", function () {
      if (validateBoundingBoxValue(boundingBox)) {
        // we fit the map's view to the predefined bounding box
        fitViewToBox(map, feature);
      } else {
        // we try to get the users geolocation and center the map on it
        const geolocation = new Geolocation({
          projection: map.getView().getProjection(),
          tracking: true,
        });
        geolocation.once("change", function () {
          map.getView().setCenter(geolocation.getPosition());
          map.getView().setZoom(11);
          fitBoxToView(map, feature);
        });
      }
    });
    mapRef.current = map;
  }, [isOSMActive, tileUrl, boundingBox, boundingBoxChange]);

  // handle mappedSuggest change - update search polygon and center map
  useEffect(() => {
    if (!mapRef.current || !mappedSuggest) {
      return;
    }
    const newSearchPolygon = getPolygonFromMappedSuggest(
      mappedSuggest,
      isOSMActive,
    );
    const vectorLayer = mapRef.current.getLayers().getArray()[1] as VectorLayer;
    const vectorSource = vectorLayer.getSource() as VectorSource;
    const searchPolygonFeature = vectorSource.getFeatures()[0];

    if (!searchPolygonFeature) {
      return;
    }

    const geometry = searchPolygonFeature.getGeometry() as Polygon;
    geometry.setCoordinates(newSearchPolygon.getCoordinates());
    searchPolygonFeature.changed();
    fitViewToBox(mapRef.current, searchPolygonFeature);
  }, [mappedSuggest, isOSMActive]);

  return <div id={mapId} className="location-search-map" tabIndex={0} />;
}
