import { Metadata } from "next";
import { i18n } from "@/i18n";
import { QualitaetsmerkmaleInfo } from "@/app/metadatenqualitaet/_components/QualitaetsmerkmaleInfo";
import { MetaDataQualityCharts } from "@/app/metadatenqualitaet/_components/MetaDataQualityCharts";
import { DesignBoxDiscoverability } from "@/app/metadatenqualitaet/_components/DesignBox/DesignBoxDiscoverability";
import { DesignBoxUsability } from "@/app/metadatenqualitaet/_components/DesignBox/DesignBoxUsability";
import { fetchMetaDataQuality } from "@/app/_lib/getData";
import { PageConstructor } from "@/types/types";
import { ContainerDiv } from "@/app/_components/Container";
import { notFound } from "next/navigation";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import React from "react";

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
          <InfoBox
            className="mt-3"
            title={i18n.t("error.alert.common")}
            variant="error"
          />
        </ContainerDiv>
      )}
    </>
  );
}
