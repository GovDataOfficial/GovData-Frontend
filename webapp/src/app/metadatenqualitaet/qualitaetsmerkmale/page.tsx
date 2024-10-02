import { Metadata } from "next";
import { i18n } from "@/i18n";
import { QualitaetsmerkmaleInfo } from "@/app/metadatenqualitaet/_components/QualitaetsmerkmaleInfo";
import { MetaDataQualityCharts } from "@/app/metadatenqualitaet/_components/MetaDataQualityCharts";
import { DesignBoxDiscoverability } from "@/app/metadatenqualitaet/_components/DesignBox/DesignBoxDiscoverability";
import { DesignBoxUsability } from "@/app/metadatenqualitaet/_components/DesignBox/DesignBoxUsability";
import { fetchMetaDataQuality } from "@/app/_lib/getData";
import { AlertBadge } from "@/app/_components/AlertBadge/AlertBadge";
import { PageConstructor } from "@/types/types";
import { ContainerDiv } from "@/app/_components/Container";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: i18n.t("meta.qualitaetsmerkmale.title"),
};

export default async function Page({ searchParams }: PageConstructor) {
  if (process.env.metadata_quality_dashboard_active !== "1") {
    notFound();
  }
  const data = await fetchMetaDataQuality();

  return (
    <>
      <QualitaetsmerkmaleInfo />
      {data ? (
        <MetaDataQualityCharts data={data} searchParams={searchParams}>
          <DesignBoxDiscoverability data={data} />
          <DesignBoxUsability data={data} />
        </MetaDataQualityCharts>
      ) : (
        <ContainerDiv containerWidth="md">
          <AlertBadge>{i18n.t("error.alert.common")}</AlertBadge>
        </ContainerDiv>
      )}
    </>
  );
}
