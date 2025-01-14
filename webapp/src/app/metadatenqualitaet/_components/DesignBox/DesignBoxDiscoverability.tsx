"use client";

import { useSearchParams } from "next/navigation";

import { InfoIcon } from "@/app/_components/InfoIcon/InfoIcon";
import { Chart } from "@/app/metadatenqualitaet/_components/Charts/Chart";
import { createChartData } from "@/app/metadatenqualitaet/_components/Charts/createChartData";
import { MetadataQualityDesignBox } from "@/app/metadatenqualitaet/_components/DesignBox/MetadataQualityDesignBox";
import { i18n } from "@/i18n";
import { MetadataQuality } from "@/types/types";

type DesignBoxDiscoverability = {
  data: MetadataQuality[];
};

export function DesignBoxDiscoverability({ data }: DesignBoxDiscoverability) {
  const { t } = i18n;

  const params = useSearchParams();
  const publisher = params.get("publisher") || undefined;
  const chartJsData = createChartData(data, "discoverability", publisher);

  return (
    <MetadataQualityDesignBox
      title={t("metadataquality.charts.discoverability.title")}
    >
      <p className="d-inline">
        {t("metadataquality.charts.discoverability.description")}&nbsp;
        {t("metadataquality.charts.info.dataInPercent")}
      </p>

      <InfoIcon title={t("metadataquality.charts.info.icon.show")}>
        {t("metadataquality.charts.discoverability.infoText")}
      </InfoIcon>
      <Chart
        data={chartJsData}
        ariaLabel={t("metadataquality.charts.discoverability.chart.title")}
      />
    </MetadataQualityDesignBox>
  );
}
