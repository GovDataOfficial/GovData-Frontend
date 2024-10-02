import { i18n } from "@/i18n";
import { icons, SVG } from "@/app/_components/SVG/SVG";

const getIcon = (type: string) => {
  switch (type) {
    case "soci":
      return icons.icon_kat_soci;
    case "educ":
      return icons.icon_kat_educ;
    case "ener":
      return icons.icon_kat_ener;
    case "heal":
      return icons.icon_kat_heal;
    case "intr":
      return icons.icon_kat_intr;
    case "just":
      return icons.icon_kat_just;
    case "agri":
      return icons.icon_kat_agri;
    case "gove":
      return icons.icon_kat_gove;
    case "regi":
      return icons.icon_kat_regi;
    case "envi":
      return icons.icon_kat_envi;
    case "tran":
      return icons.icon_kat_tran;
    case "econ":
      return icons.icon_kat_econ;
    case "tech":
      return icons.icon_kat_tech;
    case "cco":
      return icons.icon_hvdkat_cco;
    case "eoe":
      return icons.icon_hvdkat_eoe;
    case "geo":
      return icons.icon_hvdkat_geo;
    case "met":
      return icons.icon_hvdkat_met;
    case "mob":
      return icons.icon_hvdkat_mob;
    case "sta":
      return icons.icon_hvdkat_sta;
    default:
      return "";
  }
};

export function CategoryImage({ type }: { type: string }) {
  const typeLowered = type.toLowerCase();
  return (
    <div className="d-flex">
      <SVG icon={getIcon(typeLowered)} />
      <span className="ms-1">{i18n.t("category.label." + typeLowered)}</span>
    </div>
  );
}
