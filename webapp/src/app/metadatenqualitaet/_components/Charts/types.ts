export type ChartTypes =
  | "discoverability"
  | "usability"
  | "top_licenses"
  | "top_formats";

export type ChartJsData = { data: { labels: string[]; datasets: any[] } };
