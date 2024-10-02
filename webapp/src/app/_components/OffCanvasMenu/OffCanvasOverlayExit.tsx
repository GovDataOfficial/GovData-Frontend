"use client";

import React from "react";
import { hideOffCanvas } from "@/app/_components/OffCanvasMenu/offCanvasHelper";

export function OffCanvasOverlayExit() {
  return <div className="gd-exit-off-canvas" onClick={hideOffCanvas} />;
}
