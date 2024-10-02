"use client";
import { showOffCanvas } from "@/app/_components/OffCanvasMenu";
import { Button } from "@/app/_components/Button/Button";
import { SVG, icons } from "@/app/_components/SVG/SVG";
import { i18n } from "@/i18n";

type FilterAreaOpenMenuButton = {
  showForMediumDown?: boolean;
};

export function FilterAreaOpenMenuButton({
  showForMediumDown,
}: FilterAreaOpenMenuButton) {
  const classes = [
    "d-block",
    "gd-filter-area-open-menu-button",
    "right-off-canvas-toggle",
  ];

  if (showForMediumDown) {
    classes.push("d-md-none");
  }

  return (
    <Button
      id="off-canvas-filter-toggle"
      onClick={() => showOffCanvas("filter")}
      className={classes.join(" ")}
      variant="secondary"
      aria-expanded="false"
      aria-controls="off-canvas"
    >
      <SVG icon={icons.filter} />
      <span className="gd-filter-area-open-menu-button-text">
        {i18n.t("filter.title")}
      </span>
    </Button>
  );
}
