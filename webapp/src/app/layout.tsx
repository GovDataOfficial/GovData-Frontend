import type { Metadata, Viewport } from "next";
import "@/css/main.scss";
import { HeaderNavigation } from "@/app/_components/Header/HeaderNavigation";
import React, { PropsWithChildren } from "react";
import { Footer } from "@/app/_components/Footer/Footer";
import { OffCanvasMenu } from "@/app/_components/OffCanvasMenu/OffCanvasMenu";
import { OffCanvasOverlayExit } from "@/app/_components/OffCanvasMenu/OffCanvasOverlayExit";
import { QuickAccessNavigation } from "@/app/_components/QuickAccesNavigation/QuickAccessNavigation";
import { SearchHeaderSwitcher } from "@/app/_components/Search/SearchHeaderSwitcher";
import { GlobalIds } from "@/app/_lib/globalIds";
import { MatomoTracking } from "@/app/_components/MatomoTracking/MatomoTracking";

// this meta data will be used for every page if no override happens.
export const metadata: Metadata = {
  manifest: "manifest.json",
  applicationName: "GovData",
  openGraph: {
    locale: "de_DE",
    siteName: "GovData",
    type: "website",
  },
  icons: {
    icon: ["/favicon.ico", "/images/favicons/favicon.svg"],
    apple: [
      { url: "/images/favicons/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/images/favicons/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/images/favicons/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/images/favicons/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/images/favicons/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/images/favicons/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/images/favicons/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/images/favicons/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/images/favicons/apple-icon-180x180.png", sizes: "180x180" },
    ],
  },
};
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="de">
      <body>
        <div className="off-canvas-wrap d-flex flex-column min-vh-100">
          <header role="banner" className="bg-white">
            <QuickAccessNavigation />
            <HeaderNavigation />
            <SearchHeaderSwitcher />
          </header>
          <main id={GlobalIds.mainContent}>{children}</main>
          <Footer />
        </div>
        <OffCanvasMenu />
        <OffCanvasOverlayExit />
        <MatomoTracking />
      </body>
    </html>
  );
}
