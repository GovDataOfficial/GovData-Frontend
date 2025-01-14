"use client";

import { useSearchParams } from "next/navigation";

import { InfoIcon } from "@/app/_components/InfoIcon/InfoIcon";
import { Trans } from "@/app/_components/Trans/Trans";
import { Chart } from "@/app/metadatenqualitaet/_components/Charts/Chart";
import { createChartData } from "@/app/metadatenqualitaet/_components/Charts/createChartData";
import { MetadataQualityDesignBox } from "@/app/metadatenqualitaet/_components/DesignBox/MetadataQualityDesignBox";
import { i18n } from "@/i18n";
import { MetadataQuality } from "@/types/types";

type DesignBoxTop5Formats = {
  data: MetadataQuality[];
};

export function DesignBoxTop5Formats({ data }: DesignBoxTop5Formats) {
  const { t } = i18n;

  const params = useSearchParams();
  const publisher = params.get("publisher") || undefined;
  const chartJsData = createChartData(data, "top_formats", publisher);

  return (
    <MetadataQualityDesignBox
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
    </MetadataQualityDesignBox>
  );
}
