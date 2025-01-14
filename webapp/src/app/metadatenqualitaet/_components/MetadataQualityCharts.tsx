import { PropsWithChildren } from "react";

import {
  ContainerDiv,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { FilterAreaOpenMenuButton } from "@/app/_components/FilterArea/FilterAreaOpenMenuButton";
import { OffCanvasPortal } from "@/app/_components/OffCanvasMenu/OffCanvasPortal";
import { MetadataQualityFilterArea } from "@/app/metadatenqualitaet/_components/MetadataQualityFilterArea";
import { MetadataQuality, NextJSSearchParams } from "@/types/types";

export function MetadataQualityCharts({
  data,
  children,
  searchParams,
}: PropsWithChildren<{
  data: MetadataQuality[];
  searchParams: NextJSSearchParams;
}>) {
  const filterArea = (
    <MetadataQualityFilterArea data={data || []} searchParams={searchParams} />
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
