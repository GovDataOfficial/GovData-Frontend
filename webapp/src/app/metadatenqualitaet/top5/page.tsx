import { Metadata } from "next";
import { i18n } from "@/i18n";
import { fetchMetaDataQuality } from "@/app/_lib/getData";
import { MetaDataQualityCharts } from "@/app/metadatenqualitaet/_components/MetaDataQualityCharts";
import { Top5Info } from "@/app/metadatenqualitaet/_components/Top5Info";
import { DesignBoxTop5License } from "@/app/metadatenqualitaet/_components/DesignBox/DesignBoxTop5License";
import { DesignBoxTop5Formats } from "@/app/metadatenqualitaet/_components/DesignBox/DesignBoxTop5Formats";
import { PageConstructor } from "@/types/types";
import { ContainerDiv } from "@/app/_components/Container";
import { notFound } from "next/navigation";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import React from "react";

export const metadata: Metadata = {
  title: i18n.t("meta.top5.title"),
};

export default async function Page({ searchParams }: PageConstructor) {
  if (process.env.metadata_quality_dashboard_active !== "1") {
    notFound();
  }

  const data = await fetchMetaDataQuality();
  return (
    <>
      <Top5Info />
      {data ? (
        <MetaDataQualityCharts data={data} searchParams={searchParams}>
          <DesignBoxTop5License data={data} />
          <DesignBoxTop5Formats data={data} />
        </MetaDataQualityCharts>
      ) : (
        <ContainerDiv containerWidth="lg">
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
