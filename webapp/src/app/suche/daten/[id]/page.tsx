import { Metadata } from "next";

import { ContainerDiv } from "@/app/_components/Container";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { UserSurveyHeader } from "@/app/_components/UserSurveyHeader/UserSurveyHeader";
import { fetchHvdCategoryMap, fetchMetadata } from "@/app/_lib/getData";
import { metaDataGenerator } from "@/app/_lib/getMetaData";
import { SearchDetailsInfoboxDataSet } from "@/app/suche/_components/SearchDetailsInfobox/SearchDetailsInfoboxDataset";
import { SearchDetailsMetaInfo } from "@/app/suche/_components/SearchDetailsMetaInfo/SearchDetailsMetaInfo";
import { SectionDataServices } from "@/app/suche/_components/SectionDataServices";
import { SectionResources } from "@/app/suche/_components/SectionResources";
import { i18n } from "@/i18n";
import { PageConstructor } from "@/types/types";

export async function generateMetadata(
  props: PageConstructor<{ id: string }>,
): Promise<Metadata> {
  const params = await props.params;
  const data = await fetchMetadata(params.id);
  const title = data?.title
    ? i18n.t("meta.dynamic.title", { title: data.title })
    : i18n.t("meta.search.title");

  return metaDataGenerator({ title, description: data?.notes });
}

export default async function DatasetPage(
  props: PageConstructor<{ id: string }>,
) {
  const params = await props.params;
  const { t } = i18n;
  const [data, hvdMap] = await Promise.all([
    fetchMetadata(params.id),
    fetchHvdCategoryMap(),
  ]);

  return (
    <ContainerDiv containerWidth="lg">
      {data ? (
        <>
          <UserSurveyHeader />
          <div className="row mt-2 mt-md-5">
            <div className="col-sm-12 col-md-8">
              <SearchDetailsMetaInfo data={data} />
              <SectionResources
                data={data}
                tileUrl={process.env.BE_GD_DATA_MAP_PREVIEW_TILE_URL || ""}
              />
              <SectionDataServices data={data} />
            </div>
            <div className="col-sm-12 col-md-4 mt-3 mt-md-0">
              <SearchDetailsInfoboxDataSet data={data} hvdMap={hvdMap} />
            </div>
          </div>
        </>
      ) : (
        <InfoBox
          className="mt-3"
          variant="error"
          title={t("error.alert.canRetrieveDataOf", { id: params.id })}
        />
      )}
    </ContainerDiv>
  );
}
