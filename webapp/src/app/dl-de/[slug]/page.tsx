import { Metadata } from "next";

import { EditorialContent } from "@/app/_components/EditorialContent/EditorialContent";
import { fetchTypo3Data } from "@/app/_lib/getData";
import { metaDataGenerator } from "@/app/_lib/getMetaData";
import { endpoints } from "@/configuration/endpoints";
import { i18n } from "@/i18n";
import { PageConstructor } from "@/types/types";

async function getPageData(params: PageConstructor["params"]) {
  return fetchTypo3Data(endpoints.T3.dl_de + `/${params.slug}`);
}

export async function generateMetadata({
  params,
}: PageConstructor): Promise<Metadata> {
  const pageData = await getPageData(params);
  return metaDataGenerator({
    title: i18n.t("meta.dynamic.title", { title: pageData?.meta.title }),
    description: pageData?.meta.description,
  });
}

export default async function DeDLSlugPage({ params }: PageConstructor) {
  const pageData = await getPageData(params);

  return <EditorialContent pageData={pageData} />;
}
