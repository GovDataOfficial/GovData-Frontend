"use client";

import { i18n } from "@/i18n";
import { hideOffCanvas } from "@/app/_components/OffCanvasMenu/offCanvasHelper";
import { SVG, icons } from "@/app/_components/SVG/SVG";
import { Button } from "@/app/_components/Button/Button";

export function OffCanvasCloseButton() {
  return (
    <Button
      id="off-canvas-close-toggle"
      onClick={hideOffCanvas}
      aria-controls="off-canvas"
      className="off-canvas-close"
      variant="icon"
    >
      <SVG icon={icons.remove} size="small" />
      <span className="offscreen">{i18n.t("header.offcanvas.close")}</span>
    </Button>
  );
}
