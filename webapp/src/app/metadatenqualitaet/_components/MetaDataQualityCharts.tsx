import { MetaDataQuality, NextJSSearchParams } from "@/types/types";
import { MetaDataQualityFilterArea } from "@/app/metadatenqualitaet/_components/MetaDataQualityFilterArea";
import { FilterAreaOpenMenuButton } from "@/app/_components/FilterArea/FilterAreaOpenMenuButton";
import { PropsWithChildren } from "react";
import { OffCanvasPortal } from "@/app/_components/OffCanvasMenu/OffCanvasPortal";
import {
  ContainerDiv,
  ContainerWrapperModifier,
} from "@/app/_components/Container";

export function MetaDataQualityCharts({
  data,
  children,
  searchParams,
}: PropsWithChildren<{
  data: MetaDataQuality[];
  searchParams: NextJSSearchParams;
}>) {
  const filterArea = (
    <MetaDataQualityFilterArea data={data || []} searchParams={searchParams} />
  );

  return (
    <ContainerDiv
      containerWidth="lg"
      modifier={[ContainerWrapperModifier.MARGIN_TOP]}
    >
      <div className="row">
        <div className="col d-md-none mb-3">
          <FilterAreaOpenMenuButton />
          <OffCanvasPortal>{filterArea}</OffCanvasPortal>
        </div>
        <div className="col-4 d-none d-md-block">{filterArea}</div>
        <div id="searchresult-container" className="col-12 col-md-8">
          {children}
        </div>
      </div>
    </ContainerDiv>
  );
}
