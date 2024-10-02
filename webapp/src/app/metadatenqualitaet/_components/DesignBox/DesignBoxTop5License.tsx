"use client";

import { InfoIcon } from "@/app/_components/InfoIcon/InfoIcon";
import { Chart } from "@/app/metadatenqualitaet/_components/Charts/Chart";
import { MetaDataQuality } from "@/types/types";
import { MetaDataQualityDesignBox } from "@/app/metadatenqualitaet/_components/DesignBox/MetaDataQualityDesignBox";
import { createChartData } from "@/app/metadatenqualitaet/_components/Charts/createChartData";
import { i18n } from "@/i18n";
import { useSearchParams } from "next/navigation";
import { Trans } from "@/app/_components/Trans/Trans";

type MetaDataQualityBoxTop5License = {
  data: MetaDataQuality[];
};

export function DesignBoxTop5License({ data }: MetaDataQualityBoxTop5License) {
  const { t } = i18n;

  const params = useSearchParams();
  const publisher = params.get("publisher") || undefined;
  const chartJsData = createChartData(data, "top_licenses", publisher);

  chartJsData.data.labels = chartJsData.data.labels.map((licenseId) => {
    return t("licenses::" + licenseId);
  });

  return (
    <MetaDataQualityDesignBox title={t("metadataquality.charts.license.title")}>
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
    </MetaDataQualityDesignBox>
  );
}
