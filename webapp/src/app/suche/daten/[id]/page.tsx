import { Metadata } from "next";
import { SearchDetailsInfoboxDataSet } from "@/app/suche/_components/SearchDetailsInfobox/SearchDetailsInfoboxDataset";
import { fetchMetadata } from "@/app/_lib/getData";
import { SectionResources } from "@/app/suche/_components/SectionResources";
import { SectionDataServices } from "@/app/suche/_components/SectionDataServices";
import { PageConstructor } from "@/types/types";
import { AlertBadge } from "@/app/_components/AlertBadge/AlertBadge";
import { i18n } from "@/i18n";
import { SearchDetailsMetaInfo } from "@/app/suche/_components/SearchDetailsMetaInfo/SearchDetailsMetaInfo";
import { ContainerDiv } from "@/app/_components/Container";
import { metaDataGenerator } from "@/app/_lib/getMetaData";

export async function generateMetadata({
  params,
}: PageConstructor<{ id: string }>): Promise<Metadata> {
  const data = await fetchMetadata(params.id);
  const title = data?.title
    ? i18n.t("meta.dynamic.title", { title: data.title })
    : i18n.t("meta.search.title");

  return metaDataGenerator({ title, description: data?.notes });
}

export default async function DatasetPage({
  params,
}: PageConstructor<{ id: string }>) {
  const { t } = i18n;
  const data = await fetchMetadata(params.id);

  return (
    <ContainerDiv containerWidth="lg">
      {data ? (
        <div className="row mt-2 mt-md-5">
          <div className="col-sm-12 col-md-8">
            <SearchDetailsMetaInfo data={data} />
            <SectionResources data={data} />
            <SectionDataServices data={data} />
          </div>
          <div className="col-sm-12 col-md-4 mt-3 mt-md-0">
            <SearchDetailsInfoboxDataSet data={data} />
          </div>
        </div>
      ) : (
        <AlertBadge>
          {t("error.alert.canRetrieveDataOf", { id: params.id })}
        </AlertBadge>
      )}
    </ContainerDiv>
  );
}
