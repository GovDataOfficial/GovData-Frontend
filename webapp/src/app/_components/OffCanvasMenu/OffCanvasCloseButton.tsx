"use client";

import { Button } from "@/app/_components/Button/Button";
import { hideOffCanvas } from "@/app/_components/OffCanvasMenu/offCanvasHelper";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { i18n } from "@/i18n";

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
