import { Metadata } from "next";

import { ContainerDiv } from "@/app/_components/Container";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { UserSurveyHeader } from "@/app/_components/UserSurveyHeader/UserSurveyHeader";
import { fetchShowcase } from "@/app/_lib/getData";
import { metaDataGenerator } from "@/app/_lib/getMetaData";
import { SearchDetailsInfoboxApplication } from "@/app/suche/_components/SearchDetailsInfobox/SearchDetailsInfoboxApplication";
import { SearchDetailsMetaInfo } from "@/app/suche/_components/SearchDetailsMetaInfo/SearchDetailsMetaInfo";
import { SectionRelatedLinks } from "@/app/suche/_components/SectionRelatedLinks";
import { i18n } from "@/i18n";
import { PageConstructor } from "@/types/types";

export async function generateMetadata({
  params,
}: PageConstructor<{ id: string }>): Promise<Metadata> {
  const data = await fetchShowcase(params.id);
  const title = data?.title
    ? i18n.t("meta.dynamic.title", { title: data.title })
    : i18n.t("meta.search.title");
  return metaDataGenerator({ title, description: data?.notes });
}

export default async function ShowcasePage({
  params,
}: PageConstructor<{ id: string }>) {
  const { t } = i18n;
  const data = await fetchShowcase(params.id);

  return (
    <>
      <ContainerDiv containerWidth="lg">
        {data ? (
          <>
            <UserSurveyHeader />
            <div className="row mt-2 mt-md-5">
              <div className="col-sm-12 col-md-8">
                <SearchDetailsMetaInfo data={data} />
                <SectionRelatedLinks data={data} />
              </div>
              <div className="col-sm-12 col-md-4 mt-3 mt-md-0">
                <SearchDetailsInfoboxApplication data={data} />
              </div>
            </div>
          </>
        ) : (
          <InfoBox
            className="mt-3"
            variant={"error"}
            title={t("error.alert.canRetrieveDataOf", { id: params.id })}
          />
        )}
      </ContainerDiv>
    </>
  );
}
