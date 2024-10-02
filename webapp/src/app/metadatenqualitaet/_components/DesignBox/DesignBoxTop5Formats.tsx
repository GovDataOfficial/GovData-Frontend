"use client";

import { InfoIcon } from "@/app/_components/InfoIcon/InfoIcon";
import { Chart } from "@/app/metadatenqualitaet/_components/Charts/Chart";
import { MetaDataQuality } from "@/types/types";
import { MetaDataQualityDesignBox } from "@/app/metadatenqualitaet/_components/DesignBox/MetaDataQualityDesignBox";
import { i18n } from "@/i18n";
import { useSearchParams } from "next/navigation";
import { createChartData } from "@/app/metadatenqualitaet/_components/Charts/createChartData";
import { Trans } from "@/app/_components/Trans/Trans";

type DesignBoxTop5Formats = {
  data: MetaDataQuality[];
};

export function DesignBoxTop5Formats({ data }: DesignBoxTop5Formats) {
  const { t } = i18n;

  const params = useSearchParams();
  const publisher = params.get("publisher") || undefined;
  const chartJsData = createChartData(data, "top_formats", publisher);

  return (
    <MetaDataQualityDesignBox
      title={t("metadataquality.charts.topformats.title")}
    >
      <p className="d-inline">
        {t("metadataquality.charts.topformats.description")}&nbsp;
        {t("metadataquality.charts.info.dataInPercent")}
      </p>

      <InfoIcon title={t("metadataquality.charts.info.icon.show")}>
        <Trans
          i18nKey="metadataquality.charts.topformats.info.description"
          params={{
            link: (
              <a
                href="https://www.govdata.de/web/guest/datenbereitsteller"
                target="_blank"
              >
                https://www.govdata.de/web/guest/datenbereitsteller
              </a>
            ),
          }}
        />
      </InfoIcon>
      <Chart
        data={chartJsData}
        ariaLabel={t("metadataquality.charts.topformats.title")}
      />
    </MetaDataQualityDesignBox>
  );
}
