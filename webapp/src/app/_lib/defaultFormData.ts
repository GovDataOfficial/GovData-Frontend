import { i18n } from "@/i18n";
import exp from "node:constants";

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

export const defaultHvdCategoriesData = [
  { label: "Meteorologie", key: "http://data.europa.eu/bna/c_164e0bf5" },
  {
    label: "Unternehmen und Eigentümerschaft von Unternehmen",
    key: "http://data.europa.eu/bna/c_a9135398",
  },
  { label: "Georaum", key: "http://data.europa.eu/bna/c_ac64a52d" },
  { label: "Mobilität", key: "http://data.europa.eu/bna/c_b79e35eb" },
  {
    label: "Erdbeobachtung und Umwelt",
    key: "http://data.europa.eu/bna/c_dd313021",
  },
  { label: "Statistik", key: "http://data.europa.eu/bna/c_e1da4e07" },
];

export const defaultAvailability = [
  { key: "STABLE", label: i18n.t("availability.stable") },
  { key: "AVAILABLE", label: i18n.t("availability.available") },
  { key: "TEMPORARY", label: i18n.t("availability.temporary") },
  { key: "EXPERIMENTAL", label: i18n.t("availability.experimental") },
  { key: "OP_DATPRO", label: i18n.t("availability.op_datpro") },
];

export const defaultPoliciticalGeocodingLevel = [
  {
    key: "international",
    label: i18n.t("policiticalGeocodingLevel.international"),
  },
  { key: "european", label: i18n.t("policiticalGeocodingLevel.european") },
  { key: "federal", label: i18n.t("policiticalGeocodingLevel.federal") },
  { key: "state", label: i18n.t("policiticalGeocodingLevel.state") },
  {
    key: "administrativeDistrict",
    label: i18n.t("policiticalGeocodingLevel.administrativeDistrict"),
  },
  {
    key: "municipality",
    label: i18n.t("policiticalGeocodingLevel.municipality"),
  },
];
