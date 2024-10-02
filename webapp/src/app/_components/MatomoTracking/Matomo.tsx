"use client";
import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    // Matomo config var
    _paq: any;
  }
}

type Matomo = { url: string; siteId: string };

export function Matomo({ url, siteId }: Matomo) {
  const trackerUrl = url + "/matomo.php";
  useEffect(() => {
    const config = [];
    config.push(["trackPageView"]);
    config.push(["enableLinkTracking"]);
    config.push(["setTrackerUrl", trackerUrl]);
    config.push(["setSiteId", siteId]);
    window._paq = config;
  }, [siteId, trackerUrl]);

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
