import "ol/ol.css";

import { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import { apply as applyMapboxStyle } from "ol-mapbox-style";
import { defaults as defaultControls } from "ol/control/defaults";
import Zoom from "ol/control/Zoom";
import { Extent } from "ol/extent";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import { useGeographic as olUseGeographic } from "ol/proj";
import VectorSource from "ol/source/Vector";

import { debounce } from "@/app/_lib/debounce";
import { ResourcePreviewError } from "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreviewError";
import { ResourcePreviewLoading } from "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreviewLoading";
import { styleFunction } from "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreviewMapStyles";
import { i18n } from "@/i18n";
import { ProjectionName } from "@/types/types";

const getMapId = (mobile: boolean, format: string, resourceId: string) => {
  return `map-preview-${format.toLowerCase()}-${mobile ? "mobile-" : ""}${resourceId}`;
};

export type ResourcePreviewMapProps = {
  metadataId: string;
  resourceData: any;
  resourceFormat: string;
  resourceId: string;
  mobile: boolean;
  tileUrl: string;
};

export const ResourcePreviewMap = ({
  metadataId,
  resourceData,
  resourceFormat,
  resourceId,
  mobile,
  tileUrl,
}: ResourcePreviewMapProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  // Use useRef for tracking initial load
  // state won't work because it will be reset on each render
  const initialLoadStart = useRef<boolean>(false);

  const mapRef = useRef<Map>();
  useEffect(() => {
    if (mapRef.current) {
      return;
    }

    // needed to process basemap vector tiles
    olUseGeographic();

    const map = new Map({
      target: getMapId(mobile, resourceFormat, resourceId),
      controls: defaultControls({
        rotate: false,
        attributionOptions: { collapsible: false },
      }),
      view: new View({
        center: [9, 51],
        zoom: 6,
        projection: ProjectionName.EPSG3857,
        extent: [
          -45.641800748230885, 31.371800816774297, 65.40340147262948,
          65.8826536582163,
        ],
      }),
    });

    // we need to wrap the minus sign in a span to be able to style it
    const element = document.createElement("span");
    element.innerText = "–";
    map.addControl(
      new Zoom({
        zoomOutLabel: element,
        zoomInTipLabel: i18n.t("map.zoomIn"),
        zoomOutTipLabel: i18n.t("map.zoomOut"),
      }),
    );

    try {
      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(resourceData),
      });

      const extent: Extent = vectorSource.getExtent();

      const resetIsLoading = debounce(() => {
        setIsLoading(false);
      }, 15000);

      const handleLoadStart = () => {
        if (!initialLoadStart.current) {
          setIsLoading(true);
          // mark that the first loadstart has occurred
          initialLoadStart.current = true;
          // remove loading spinner after 15 seconds
          // in case the loadend event is not triggered
          resetIsLoading();
        }
      };

      map.on("loadstart", handleLoadStart);

      map.on("loadend", function () {
        setIsLoading(false);
      });

      const layer = new VectorLayer({
        source: vectorSource,
        style: styleFunction,
      });

      vectorSource.on("featuresloadstart", () => {
        // fit view to extent of loaded features
        mapRef.current!.getView().fit(extent, {
          duration: 1000,
          padding: [20, 20, 20, 20],
        });
      });

      // needed to process basemap vector tiles
      applyMapboxStyle(map, tileUrl).then(() => {
        // our feature layer is added after the map is styled
        // so it gets rendered on top of the basemap
        // by that the featuresloadstart event is triggered
        map && map.addLayer(layer);
      });
    } catch (e) {
      setIsLoading(false);
      setHasError(true);
    }
    mapRef.current = map;
  }, [
    resourceData,
    metadataId,
    resourceFormat,
    mobile,
    tileUrl,
    resourceId,
    setIsLoading,
    initialLoadStart,
  ]);

  if (hasError) {
    return <ResourcePreviewError />;
  }

  return (
    <div className="mt-1 position-relative map-preview-container">
      <div className="sr-only">
        {i18n.t("search.details.preview.map.description")}
      </div>
      <div
        className={`map-preview`}
        id={getMapId(mobile, resourceFormat, resourceId)}
        tabIndex={0}
      ></div>
      {isLoading && (
        <ResourcePreviewLoading
          loadingText={i18n.t("search.details.preview.map.loading")}
        />
      )}
      <div className="paragraph-small">
        {i18n.t("search.details.preview.map.hint")}
      </div>
    </div>
  );
};
