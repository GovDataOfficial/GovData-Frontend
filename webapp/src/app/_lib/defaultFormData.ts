import { i18n } from "@/i18n";

type DefaultFormData = { key: string; label: string }[] | undefined;

export function normalizeData<T extends Array<any>>(
  data?: T,
  covert?: (item: T[number]) => { key: string; label: string },
): DefaultFormData {
  if (!data || !covert) {
    return undefined;
  }

  return data.map((item) => covert(item));
}

export const defaultPlatformData = [
  { label: "Android", key: "android" },
  { label: "iOS", key: "ios" },
  { label: "Web", key: "web" },
  { label: "Linux", key: "linux" },
  { label: "Sonstige", key: "other" },
];

export const defaultShowcaseTypeData = [
  { label: "Konzept", key: "concept" },
  { label: "Wissenschaftliche Publikation", key: "publication" },
  { label: "Visualisierung", key: "visualization" },
  { label: "Webseite", key: "website" },
  { label: "Tool", key: "tool" },
  { label: "Mobile App", key: "mobile_app" },
  { label: "Sonstiges", key: "other" },
];

export const defaultHvdData = [
  { label: "Nur hochwertige Datensätze", key: "has_hvd" },
];

export const defaultDataserviceData = [
  { label: "Nur Datensätze mit Datenservices", key: "has_data_service" },
];

export const defaultTypeData = [
  { label: "Daten", key: "dataset" },
  { label: "Anwendungen", key: "showcase" },
  { label: "Informationen", key: "article" },
  { label: "Blog-Beiträge", key: "blog" },
];

export const defaultOpennessData = [
  { label: "Freie Nutzung", key: "has_open" },
  { label: "Eingeschränkte Nutzung", key: "has_closed" },
];

//TODO need route from backend to fetch this data.
export const defaultAvailability = [
  {
    key: "http://publications.europa.eu/resource/authority/planned-availability/STABLE",
    label: i18n.t("availability.stable"),
  },
  {
    key: "http://publications.europa.eu/resource/authority/planned-availability/AVAILABLE",
    label: i18n.t("availability.available"),
  },
  {
    key: "http://publications.europa.eu/resource/authority/planned-availability/TEMPORARY",
    label: i18n.t("availability.temporary"),
  },
  {
    key: "http://publications.europa.eu/resource/authority/planned-availability/EXPERIMENTAL",
    label: i18n.t("availability.experimental"),
  },
  {
    key: "http://publications.europa.eu/resource/authority/planned-availability/OP_DATPRO",
    label: i18n.t("availability.op_datpro"),
  },
];

//TODO need route from backend to fetch this data.
export const defaultPoliciticalGeocodingLevel = [
  {
    key: "http://dcat-ap.de/def/politicalGeocoding/Level/international",
    label: i18n.t("policiticalGeocodingLevel.international"),
  },
  {
    key: "http://dcat-ap.de/def/politicalGeocoding/Level/european",
    label: i18n.t("policiticalGeocodingLevel.european"),
  },
  {
    key: "http://dcat-ap.de/def/politicalGeocoding/Level/federal",
    label: i18n.t("policiticalGeocodingLevel.federal"),
  },
  {
    key: "http://dcat-ap.de/def/politicalGeocoding/Level/state",
    label: i18n.t("policiticalGeocodingLevel.state"),
  },
  {
    key: "http://dcat-ap.de/def/politicalGeocoding/Level/administrativeDistrict",
    label: i18n.t("policiticalGeocodingLevel.administrativeDistrict"),
  },
  {
    key: "http://dcat-ap.de/def/politicalGeocoding/Level/municipality",
    label: i18n.t("policiticalGeocodingLevel.municipality"),
  },
];
