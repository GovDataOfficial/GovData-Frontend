import Script from "next/script";
import { Metadata } from "next";
import { i18n } from "@/i18n";
import { fetchSearchMapSessionId } from "@/app/_lib/getData";
import { HelpArea } from "@/app/kartensuche/_components/HelpArea";
import { LocationSearch } from "@/app/kartensuche/_components/LocationSearch";
import "../../../public/vendor/ol/ol.css";
import { isOSMActive } from "@/app/_lib/environment";
import { PageConstructor } from "@/types/types";
import { SPECIAL_FILTERS, URLHelper } from "@/app/_lib/URLHelper";
import { ContainerDiv } from "@/app/_components/Container";
import { metaDataGenerator } from "@/app/_lib/getMetaData";

export const metadata: Metadata = metaDataGenerator({
  title: i18n.t("meta.kartensuche.title"),
  description: i18n.t("meta.kartensuche.description"),
});

const mapData = isOSMActive()
  ? {
      "data-use-osm": "true",
    }
  : {
      "data-use-osm": "false",
      "data-tile-url": process.env.BE_GD_DATA_SEARCHMAP_TILE_URL,
      "data-credits": "© basemap.de / BKG (2024)",
      "data-layers": "de_basemapde_web_raster_farbe",
    };

export default async function Home({ searchParams }: PageConstructor) {
  const sessionId = await fetchSearchMapSessionId();
  const {
    getActiveFiltersForHiddenInput,
    getBoundingBoxValueFromCurrentParams,
  } = URLHelper(searchParams);

  const hiddenInputs = getActiveFiltersForHiddenInput(
    SPECIAL_FILTERS.BOUNDING_BOX,
  ).map((input) => <input {...input} key={input.key} />);

  return (
    <>
      <Script strategy="beforeInteractive" src="/vendor/ol/ol-debug.js" />
      <Script strategy="afterInteractive" src="/js/ol-govdata.js" />
      <h1 className="sr-only">{i18n.t("searchmap.title")}</h1>
      <div className="searchmap-container">
        <form action="/suche" method="get">
          {hiddenInputs}
          <input
            type="hidden"
            name="boundingbox"
            id="boundingbox"
            defaultValue={getBoundingBoxValueFromCurrentParams()}
          />
          <div id="map" className="map" {...mapData} />
          <ContainerDiv containerWidth="lg">
            <div className="row searchmap-input-row align-items-center ">
              <div className="d-block mb-1 col-sm-6 mb-sm-0">
                <LocationSearch sessionId={sessionId} />
              </div>
              <div className="d-block col-sm-6 text-right">
                <button type="submit" className="button-search">
                  {i18n.t("searchmap.form.send")}
                </button>
              </div>
            </div>
          </ContainerDiv>
        </form>
        <HelpArea />
      </div>
    </>
  );
}
