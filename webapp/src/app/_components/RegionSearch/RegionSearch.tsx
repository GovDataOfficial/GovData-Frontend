import { SVGGermany } from "@/app/_components/RegionSearch/SVGGermany";
import React from "react";
import { RegionSearchBox } from "@/app/_components/RegionSearch/RegionSearchBox";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { i18n } from "@/i18n";

export function RegionSearch() {
  return (
    <ContainerSection
      headline={i18n.t("regionsearch.title")}
      headlineLevel="h2"
      centerHeadline
      description={i18n.t("regionsearch.description")}
      containerWidth="930"
      modifier={[
        ContainerWrapperModifier.BG_WHITE,
        ContainerWrapperModifier.MARGIN_TOP,
        ContainerWrapperModifier.PADDING_Y,
      ]}
    >
      <div className="region-search">
        <div className="row">
          <div className="col-12 col-sm-5 align-content-center">
            <RegionSearchBox />
          </div>
          <div className="col-0 col-sm-7 d-none d-sm-block align-content-center">
            <SVGGermany />
          </div>
        </div>
      </div>
    </ContainerSection>
  );
}
