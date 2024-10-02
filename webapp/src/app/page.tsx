import React from "react";
import { RegionSearch } from "@/app/_components/RegionSearch/RegionSearch";
import { fetchTypo3Data } from "@/app/_lib/getData";
import { endpoints } from "@/configuration/endpoints";
import { EditorialContentMainPage } from "@/app/_components/EditorialContent/EditorialContentMainPage";
import { TeaserBoxes } from "@/app/_components/TeaserBox/TeaserBoxes";
import { metaDataGenerator } from "@/app/_lib/getMetaData";
import { i18n } from "@/i18n";

export const metadata = metaDataGenerator({
  title: i18n.t("meta.home.title"),
  description: i18n.t("meta.home.description"),
});

export default async function Home() {
  const pageData = await fetchTypo3Data(endpoints.T3.startseite);

  return (
    <>
      <TeaserBoxes />
      <EditorialContentMainPage pageData={pageData} />
      <RegionSearch />
    </>
  );
}
