"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    // Matomo config var
    _paq: any;
  }
}

type Matomo = { url: string; siteId: string; options: string[][] };

export function Matomo({ url, siteId, options }: Readonly<Matomo>) {
  const trackerUrl = url + "/matomo.php";
  useEffect(() => {
    const config = [];
    for (const option of options) {
      config.push(option);
    }
    config.push(["setTrackerUrl", trackerUrl], ["setSiteId", siteId]);
    window._paq = config;
  }, [siteId, trackerUrl, options]);

  return (
    <>
      <Script strategy="afterInteractive" src={url + "/matomo.js"} />
      <noscript>
        {/*eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${trackerUrl}?idsite=${siteId}`}
          alt=""
          className="d-none"
          loading={"lazy"}
        />
      </noscript>
    </>
  );
}
