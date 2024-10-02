import { i18n } from "@/i18n";

export const TOP_FORMATS = "top_formats";
export const TOP_LICENSES = "top_licenses";
export const DISCOVERABLE = "discoverable_yes";
export const NOT_DISCOVERABLE = "discoverable_no";
export const USABLE = "usability_yes";
export const NOT_USABLE = "usability_no";
export const ALL_PUBLISHERS = "govdata";
export const COLOR_DARK = "rgb(128, 0, 75)";
export const COLOR_LIGHT = "rgb(230, 203, 218)";
export const CHART_TEXT_FONT_SIZE = 14;
export const CHART_FONT_STYLE = "bold";
export const CHART_FONT_COLOR = "#000";
export const CHART_ASPECT_RATIO_DEFAULT = 2;
export const CHART_BAR_PERCENTAGE_DEFAULT = 0.4;
export const CHART_BAR_PERCENTAGE_COMPARE_PUBLISHER = 0.8;
export const CHART_BAR_PERCENTAGE_COMPARE_GOVDATA = 0.6;
export const CHART_BAR_PERCENTAGE_BASE = 0.08;
export const CHART_TYPE_HORIZONTAL_BAR = "horizontalBar";
export const CHART_TYPE_NORMAL_BAR = "bar";

export function computeAspectRatio(list?: any[]) {
  return Array.isArray(list) && list.length < 3
    ? 2.5
    : CHART_ASPECT_RATIO_DEFAULT;
}

export function adjustFontSize(chartContext: any) {
  var chartWidth = chartContext.chart.width;
  var size = ((chartWidth / CHART_ASPECT_RATIO_DEFAULT) * 6) / 100;
  if (size > CHART_TEXT_FONT_SIZE) {
    size = CHART_TEXT_FONT_SIZE;
  }
  chartContext.legend.options.labels.fontSize = size;
  chartContext.legend.options.labels.boxWidth = 3 * size;
  chartContext.scales["y-axis-0"].options.ticks.minor.fontSize = size;
  chartContext.scales["x-axis-0"].options.ticks.minor.fontSize = size;
}

function labelSplitter(str: string, l: number) {
  var strs = [];
  while (str.length > l) {
    var pos = str.substring(0, l).lastIndexOf(" ");
    pos = pos <= 0 ? l : pos;
    strs.push(str.substring(0, pos));
    var i = str.indexOf(" ", pos) + 1;
    if (i < pos || i > pos + l) i = pos;
    str = str.substring(i);
  }
  strs.push(str);
  return strs;
}

// set font size depending on chart size
const plugins = [{ beforeUpdate: (c: any) => adjustFontSize(c) }];
const sharedOptions = {
  title: { display: false },
  legend: {
    position: "bottom",
    labels: {
      fontStyle: CHART_FONT_STYLE,
      fontColor: CHART_FONT_COLOR,
    },
  },
  tooltips: {
    callbacks: {
      label: (tooltipItem: any, data: any) => {
        return (
          data.datasets[tooltipItem.datasetIndex].label +
          ": " +
          tooltipItem.value +
          "%"
        );
      },
    },
  },
};

const chartFonts = {
  fontStyle: CHART_FONT_STYLE,
  fontColor: CHART_FONT_COLOR,
};

export function createTopChartConfig({
  chartType,
  labels = [],
  datasetLabel = "",
  data,
}: {
  chartType: string;
  labels?: string[];
  datasetLabel?: string;
  data: any;
}) {
  return {
    type: chartType,
    data: {
      labels: labels,
      datasets: [
        {
          label: datasetLabel,
          data: data,
          backgroundColor: COLOR_DARK,
          borderColor: COLOR_DARK,
          barPercentage: CHART_BAR_PERCENTAGE_BASE * (labels?.length || 1),
        },
      ],
    },
    plugins: plugins,
    options: {
      aspectRatio: computeAspectRatio(labels),
      ...sharedOptions,
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              precision: 0,
              ...chartFonts,
              callback: (value: string | number) => {
                if (typeof value === "string") {
                  return labelSplitter(value, 16);
                }
                return chartType === CHART_TYPE_HORIZONTAL_BAR
                  ? value + "%"
                  : value;
              },
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              precision: 0,
              ...chartFonts,
              callback: (value: string | number) => {
                if (typeof value === "string") {
                  return labelSplitter(value, 30);
                }
                return chartType === CHART_TYPE_NORMAL_BAR
                  ? value + "%"
                  : value;
              },
            },
          },
        ],
      },
    },
  };
}

export function createYesNoChartConfig({ labels, yesData, noData }: any) {
  return {
    type: CHART_TYPE_HORIZONTAL_BAR,
    data: {
      labels: labels,
      datasets: [
        {
          label: i18n.t("metadataquality.charts.compare.available"),
          data: yesData,
          backgroundColor: COLOR_DARK,
          borderColor: COLOR_DARK,
          barPercentage: CHART_BAR_PERCENTAGE_DEFAULT,
        },
        {
          label: i18n.t("metadataquality.charts.compare.unavailable"),
          data: noData,
          backgroundColor: COLOR_LIGHT,
          borderColor: COLOR_LIGHT,
          barPercentage: CHART_BAR_PERCENTAGE_DEFAULT,
        },
      ],
    },
    plugins: plugins,
    options: {
      aspectRatio: computeAspectRatio(labels),
      ...sharedOptions,
      scales: {
        xAxes: [
          {
            stacked: true,
            ticks: {
              beginAtZero: true,
              precision: 0,
              ...chartFonts,
              min: 0,
              max: 100,
              callback: (value: string) => value + "%",
            },
          },
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              precision: 0,
              ...chartFonts,
            },
          },
        ],
      },
    },
  };
}

export function createCompareChartConfig({
  labels,
  publisherName,
  publisherData,
  portalData,
}: any) {
  return {
    type: CHART_TYPE_HORIZONTAL_BAR,
    data: {
      labels: labels,
      datasets: [
        {
          label: publisherName,
          data: publisherData,
          backgroundColor: COLOR_DARK,
          borderColor: COLOR_DARK,
          barPercentage: CHART_BAR_PERCENTAGE_COMPARE_PUBLISHER,
        },
        {
          label: "GovData",
          data: portalData,
          backgroundColor: COLOR_LIGHT,
          borderColor: COLOR_LIGHT,
          barPercentage: CHART_BAR_PERCENTAGE_COMPARE_GOVDATA,
        },
      ],
    },
    plugins: plugins,
    options: {
      aspectRatio: computeAspectRatio(labels),
      ...sharedOptions,
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              precision: 0,
              fontStyle: CHART_FONT_STYLE,
              fontColor: CHART_FONT_COLOR,
              min: 0,
              max: 100,
              callback: (value: string) => value + "%",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              precision: 0,
              fontStyle: CHART_FONT_STYLE,
              fontColor: CHART_FONT_COLOR,
            },
          },
        ],
      },
    },
  };
}
