"use client";

import { useSearchParams } from "next/navigation";

import { InfoIcon } from "@/app/_components/InfoIcon/InfoIcon";
import { Trans } from "@/app/_components/Trans/Trans";
import { Chart } from "@/app/metadatenqualitaet/_components/Charts/Chart";
import { createChartData } from "@/app/metadatenqualitaet/_components/Charts/createChartData";
import { MetadataQualityDesignBox } from "@/app/metadatenqualitaet/_components/DesignBox/MetadataQualityDesignBox";
import { i18n } from "@/i18n";
import { MetadataQuality } from "@/types/types";

type MetadataQualityBoxTop5License = {
  data: MetadataQuality[];
};

export function DesignBoxTop5License({ data }: MetadataQualityBoxTop5License) {
  const { t } = i18n;

  const params = useSearchParams();
  const publisher = params.get("publisher") || undefined;
  const chartJsData = createChartData(data, "top_licenses", publisher);

  chartJsData.data.labels = chartJsData.data.labels.map((licenseId) => {
    return t("licenses::" + licenseId);
  });

  return (
    <MetadataQualityDesignBox title={t("metadataquality.charts.license.title")}>
      <p className="d-inline">
        {t("metadataquality.charts.license.description")}&nbsp;
        {t("metadataquality.charts.info.dataInPercent")}
      </p>
      <InfoIcon title={t("metadataquality.charts.info.icon.show")}>
        <Trans
          i18nKey={"metadataquality.charts.license.info.description"}
          params={{
            link: (
              <a href="https://www.govdata.de/lizenzen" target="_blank">
                https://www.govdata.de/lizenzen
              </a>
            ),
          }}
        />
      </InfoIcon>
      <Chart data={chartJsData} ariaLabel="TOP 5 Lizenzen" />
    </MetadataQualityDesignBox>
  );
}
