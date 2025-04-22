import { Metadata } from "next";

import { isOSMActive } from "@/app/_lib/environment";
import { fetchSearchMapSessionId } from "@/app/_lib/getData";
import { metaDataGenerator } from "@/app/_lib/getMetaData";
import { HelpArea } from "@/app/kartensuche/_components/HelpArea";
import LocationSearch from "@/app/kartensuche/_components/LocationSearch";
import { i18n } from "@/i18n";
import { PageConstructor } from "@/types/types";

export const metadata: Metadata = metaDataGenerator({
  title: i18n.t("meta.kartensuche.title"),
  description: i18n.t("meta.kartensuche.description"),
});

export default async function Home({ searchParams }: PageConstructor) {
  const sessionId = await fetchSearchMapSessionId();
  return (
    <>
      <h1 className="sr-only">{i18n.t("searchmap.title")}</h1>
      <div className="searchmap-container">
        <LocationSearch
          isOSMActive={isOSMActive()}
          searchParams={searchParams}
          tileUrl={process.env.BE_GD_DATA_SEARCHMAP_TILE_URL || ""}
          sessionId={sessionId}
        />
        <HelpArea />
      </div>
    </>
  );
}
