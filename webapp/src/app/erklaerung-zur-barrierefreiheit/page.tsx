import { fetchTypo3Data } from "@/app/_lib/getData";
import { EditorialContent } from "@/app/_components/EditorialContent/EditorialContent";
import { i18n } from "@/i18n";
import { endpoints } from "@/configuration/endpoints";
import { metaDataGenerator } from "@/app/_lib/getMetaData";

export async function generateMetadata() {
  const pageData = await fetchTypo3Data(endpoints.T3.barrierefreiheit);
  return metaDataGenerator({
    title: i18n.t("meta.dynamic.title", { title: pageData?.meta.title }),
    description: pageData?.meta.description,
  });
}

export default async function Page() {
  const pageData = await fetchTypo3Data(endpoints.T3.barrierefreiheit);
  return <EditorialContent pageData={pageData} />;
}
