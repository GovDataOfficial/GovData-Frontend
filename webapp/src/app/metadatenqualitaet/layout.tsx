import { PropsWithChildren } from "react";

import { MetadataQualityInfo } from "@/app/metadatenqualitaet/_components/MetadataQualityInfo";
import { MetadataQualitySiteNavigation } from "@/app/metadatenqualitaet/_components/MetadataQualitySiteNavigation";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <MetadataQualityInfo />
      <MetadataQualitySiteNavigation />
      {children}
    </>
  );
}
