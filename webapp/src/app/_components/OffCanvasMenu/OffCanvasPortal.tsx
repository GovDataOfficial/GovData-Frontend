"use client";

import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

// Progressive enhancement: render inline on the server/non-DOM environments,
// and portalize only when the target node exists in the browser.
export function OffCanvasPortal({ children }: PropsWithChildren) {
  const canUseDOM = typeof document !== "undefined";
  const target = canUseDOM
    ? document.getElementById("off-canvas-filter")
    : null;

  if (!canUseDOM || !target) {
    return <>{children}</>;
  }

  return createPortal(children, target);
}
