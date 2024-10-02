import { i18n } from "@/i18n";

// see https://op.europa.eu/de/web/eu-vocabularies/concept-scheme/-/resource?uri=http://data.europa.eu/bna/asd487ae75
const HVD_CATEGORY_NAME = [
  { key: "c_164e0bf5", label: i18n.t("category.label.met") },
  { key: "c_a9135398", label: i18n.t("category.label.cco") },
  { key: "c_ac64a52d", label: i18n.t("category.label.geo") },
  { key: "c_dd313021", label: i18n.t("category.label.eoe") },
  { key: "c_b79e35eb", label: i18n.t("category.label.mob") },
  { key: "c_e1da4e07", label: i18n.t("category.label.sta") },
];

export function findHvdCategory(key: string) {
  return HVD_CATEGORY_NAME.find((hvdCat) => key.includes(hvdCat.key));
}
