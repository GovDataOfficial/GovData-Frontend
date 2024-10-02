import { MetaDataQualityInfo } from "@/app/metadatenqualitaet/_components/MetaDataQualityInfo";
import { MetaDataQualitySiteNavigation } from "@/app/metadatenqualitaet/_components/MetaDataQualitySiteNavigation";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <MetaDataQualityInfo />
      <MetaDataQualitySiteNavigation />
      {children}
    </>
  );
}
