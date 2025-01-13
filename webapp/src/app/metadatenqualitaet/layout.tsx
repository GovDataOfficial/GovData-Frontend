import { PropsWithChildren } from "react";

import { MetaDataQualityInfo } from "@/app/metadatenqualitaet/_components/MetaDataQualityInfo";
import { MetaDataQualitySiteNavigation } from "@/app/metadatenqualitaet/_components/MetaDataQualitySiteNavigation";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <MetaDataQualityInfo />
      <MetaDataQualitySiteNavigation />
      {children}
    </>
  );
}
