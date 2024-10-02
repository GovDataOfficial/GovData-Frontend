"use client";

import { InfoIcon } from "@/app/_components/InfoIcon/InfoIcon";
import { Chart } from "@/app/metadatenqualitaet/_components/Charts/Chart";
import { MetaDataQuality } from "@/types/types";
import { MetaDataQualityDesignBox } from "@/app/metadatenqualitaet/_components/DesignBox/MetaDataQualityDesignBox";
import { i18n } from "@/i18n";
import { useSearchParams } from "next/navigation";
import { createChartData } from "@/app/metadatenqualitaet/_components/Charts/createChartData";
import { Trans } from "@/app/_components/Trans/Trans";
import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";

type DesignBoxUsability = {
  data: MetaDataQuality[];
};

export function DesignBoxUsability({ data }: DesignBoxUsability) {
  const { t } = i18n;

  const params = useSearchParams();
  const publisher = params.get("publisher") || undefined;
  const chartJsData = createChartData(data, "usability", publisher);

  const licenseLink = (
    <ExternalLink
      title={"https://www.dcat-ap.de/def/licenses/"}
      href="https://www.dcat-ap.de/def/licenses/"
    />
  );

  return (
    <MetaDataQualityDesignBox
      title={t("metadataquality.charts.usability.title")}
    >
      <p className="d-inline">
        {t("metadataquality.charts.usability.description")}&nbsp;
        {t("metadataquality.charts.info.dataInPercent")}
      </p>
      <InfoIcon title={t("metadataquality.charts.info.icon.show")}>
        <h3>{t("metadataquality.charts.usability.info.license.term")}</h3>
        {t("metadataquality.charts.usability.info.license.description")}
        <h3>{t("metadataquality.charts.usability.info.licenseUri.term")}</h3>
        <Trans
          i18nKey={
            "metadataquality.charts.usability.info.licenseUri.description"
          }
          params={{ link: licenseLink }}
        />
        <h3>
          {t("metadataquality.charts.usability.info.openLicenseUri.term")}
        </h3>
        <Trans
          i18nKey={
            "metadataquality.charts.usability.info.openLicenseUri.description"
          }
          params={{ link: licenseLink }}
        />
        <h3>{t("metadataquality.charts.usability.info.publisher.term")}</h3>
        {t("metadataquality.charts.usability.info.publisher.description")}
      </InfoIcon>
      <Chart
        data={chartJsData}
        ariaLabel={t("metadataquality.charts.usability.chart.title")}
      />
    </MetaDataQualityDesignBox>
  );
}
