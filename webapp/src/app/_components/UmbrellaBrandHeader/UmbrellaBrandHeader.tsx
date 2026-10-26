"use client";

import { useEffect } from "react";

import { isFeatureEnabled } from "@/app/_lib/features";
import { Feature } from "@/configuration/featureFlags/types";

export function UmbrellaBrandHeader() {
  const showHeader = isFeatureEnabled(Feature.showUmbrellaBrandHeader);

  useEffect(() => {
    if (!showHeader) {
      return;
    }
    import("@kern-ux/native/dist/js/kern-kopfzeile.js").then(async () => {
      await customElements.whenDefined("kern-kopfzeile");
      // Linkes Padding steckt im Shadow DOM, daher dort überschreiben
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(
        ".kern-container, .kern-container-fluid { padding-left: 0 !important; }",
      );
      const shadow = document.querySelector("kern-kopfzeile")?.shadowRoot;
      if (shadow) {
        shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, sheet];
      }
    });
  }, [showHeader]);

  return showHeader ? (
    <div className="gd-umbrella-brand-header-container">
      <div className="container-lg">
        <kern-kopfzeile theme="light"></kern-kopfzeile>
      </div>
    </div>
  ) : null;
}
