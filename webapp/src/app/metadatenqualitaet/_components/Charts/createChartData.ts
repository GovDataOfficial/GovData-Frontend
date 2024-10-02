import { MetaDataQuality } from "@/types/types";
import {
  ALL_PUBLISHERS,
  CHART_TYPE_HORIZONTAL_BAR,
  CHART_TYPE_NORMAL_BAR,
  createCompareChartConfig,
  createTopChartConfig,
  createYesNoChartConfig,
  DISCOVERABLE,
  NOT_DISCOVERABLE,
  NOT_USABLE,
  TOP_FORMATS,
  TOP_LICENSES,
  USABLE,
} from "@/app/metadatenqualitaet/_components/Charts/common";
import {
  ChartJsData,
  ChartTypes,
} from "@/app/metadatenqualitaet/_components/Charts/types";

export function createChartData(
  data: MetaDataQuality[],
  type?: ChartTypes,
  filterByPublisher?: string,
): ChartJsData {
  switch (type) {
    case "top_formats":
      return createTop5FormatsConfig(data, filterByPublisher);
    case "top_licenses":
      return createTop5LicenseConfig(data, filterByPublisher);
    case "usability":
      return createUsabilityConfig(data, filterByPublisher);
    case "discoverability":
    default:
      return createDiscoverabilityConfig(data, filterByPublisher);
  }
}

const byNameAndPublisher =
  (name: string, publisher: string) => (d: MetaDataQuality) =>
    d.name === name && d.publisher === publisher;

const getPublisherDisplayName = (publisher: string, data?: MetaDataQuality) => {
  const name = publisher === ALL_PUBLISHERS ? "GovData" : null;

  if (data) {
    return name || data.publisherDisplayName;
  }
  return name || publisher;
};

function createDiscoverabilityConfig(
  data: MetaDataQuality[],
  publisher: string = ALL_PUBLISHERS,
) {
  if (publisher === ALL_PUBLISHERS) {
    const discoverableData = data.find(
      byNameAndPublisher(DISCOVERABLE, publisher),
    );
    const nonDiscoverableData = data.find(
      byNameAndPublisher(NOT_DISCOVERABLE, publisher),
    );

    return createYesNoChartConfig({
      labels: discoverableData?.labels,
      yesData: discoverableData?.data_percent,
      noData: nonDiscoverableData?.data_percent,
    });
  }

  const portalData = data.find(
    byNameAndPublisher(DISCOVERABLE, ALL_PUBLISHERS),
  );
  const publisherData = data.find(byNameAndPublisher(DISCOVERABLE, publisher));

  return createCompareChartConfig({
    labels: portalData?.labels,
    publisherName: publisherData?.publisherDisplayName,
    publisherData: publisherData?.data_percent,
    portalData: portalData?.data_percent,
  });
}

function createUsabilityConfig(
  data: MetaDataQuality[],
  publisher: string = ALL_PUBLISHERS,
) {
  if (publisher === ALL_PUBLISHERS) {
    const usableData = data.find(byNameAndPublisher(USABLE, publisher));
    const nonUsableData = data.find(byNameAndPublisher(NOT_USABLE, publisher));

    return createYesNoChartConfig({
      labels: usableData?.labels,
      yesData: usableData?.data_percent,
      noData: nonUsableData?.data_percent,
    });
  }

  const portalData = data.find(byNameAndPublisher(USABLE, ALL_PUBLISHERS));
  const publisherData = data.find(byNameAndPublisher(USABLE, publisher));

  return createCompareChartConfig({
    labels: portalData?.labels,
    publisherName: publisherData?.publisherDisplayName,
    publisherData: publisherData?.data_percent,
    portalData: portalData?.data_percent,
  });
}

function createTop5LicenseConfig(
  data: MetaDataQuality[],
  publisher: string = ALL_PUBLISHERS,
) {
  const topData = data.find(byNameAndPublisher(TOP_LICENSES, publisher));

  return createTopChartConfig({
    chartType: CHART_TYPE_HORIZONTAL_BAR,
    labels: topData?.labels,
    data: topData?.data_percent,
    datasetLabel: getPublisherDisplayName(publisher, topData),
  });
}

function createTop5FormatsConfig(
  data: MetaDataQuality[],
  publisher: string = ALL_PUBLISHERS,
) {
  const topData = data.find(byNameAndPublisher(TOP_FORMATS, publisher));

  return createTopChartConfig({
    chartType: CHART_TYPE_NORMAL_BAR,
    labels: topData?.labels,
    data: topData?.data_percent,
    datasetLabel: getPublisherDisplayName(publisher, topData),
  });
}
