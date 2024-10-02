export type FormatType = "json" | "xml" | "csv";
export type EndpointType = "ds" | "mqa";

export type EndpointTypeOption = {
  key: EndpointType;
  label: string;
};

export type Prefix = {
  key: string;
  scheme: string;
};
