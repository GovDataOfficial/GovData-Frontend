"use client";

import { ButtonIcon } from "@/app/_components/Button/ButtonIcon";
import { hideOffCanvas } from "@/app/_components/OffCanvasMenu/offCanvasHelper";
import { icons } from "@/app/_components/SVG/SVG";

export function OffCanvasCloseButton() {
  return (
    <ButtonIcon
      id="off-canvas-close-toggle"
      onClick={hideOffCanvas}
      aria-controls="off-canvas"
      className="off-canvas-close"
      icon={icons.remove}
    />
  );
}
