import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContainerDiv } from "@/app/_components/Container";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { fetchMetadataQuality } from "@/app/_lib/getData";
import { DesignBoxDiscoverability } from "@/app/metadatenqualitaet/_components/DesignBox/DesignBoxDiscoverability";
import { DesignBoxUsability } from "@/app/metadatenqualitaet/_components/DesignBox/DesignBoxUsability";
import { MetadataQualityCharts } from "@/app/metadatenqualitaet/_components/MetadataQualityCharts";
import { QualitaetsmerkmaleInfo } from "@/app/metadatenqualitaet/_components/QualitaetsmerkmaleInfo";
import { i18n } from "@/i18n";
import { PageConstructor } from "@/types/types";

export const metadata: Metadata = {
  title: i18n.t("meta.qualitaetsmerkmale.title"),
};

export default async function Page({ searchParams }: PageConstructor) {
  if (process.env.metadata_quality_dashboard_active !== "1") {
    notFound();
  }
  const data = await fetchMetadataQuality();

  return (
    <>
      <QualitaetsmerkmaleInfo />
      {data ? (
        <MetadataQualityCharts data={data} searchParams={searchParams}>
          <DesignBoxDiscoverability data={data} />
          <DesignBoxUsability data={data} />
        </MetadataQualityCharts>
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
