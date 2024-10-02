"use client";

import { PropsWithChildren, ReactPortal, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function OffCanvasPortal({ children }: PropsWithChildren) {
  const [portal, setPortal] = useState<ReactPortal | null>(null);

  useEffect(() => {
    const filter = document.getElementById("off-canvas-filter");

    filter && setPortal(createPortal(children, filter));
  }, [children]);

  return portal;
}
