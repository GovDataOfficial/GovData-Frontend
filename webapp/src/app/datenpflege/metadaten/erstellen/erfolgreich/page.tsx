import React from "react";
import { Metadata } from "next";

import { AnchorButton } from "@/app/_components/Button/AnchorButton";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";

export const metadata: Metadata = {
  title: i18n.t("meta.managedata.create.success"),
};

export default function Page() {
  return (
    <>
      <ContainerSection
        containerWidth="930"
        headline={i18n.t("metadataform.success.create.headline")}
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <InfoBox
          variant="success"
          title={i18n.t("metadataform.success.create.box.title")}
        >
          {i18n.t("metadataform.success.create.box.description")}
        </InfoBox>
        <div className="d-flex flex-column flex-sm-row justify-content-between">
          <a
            className="d-flex mt-2 text-center"
            href={PAGES_AUTH.manage_metadata_form_add}
          >
            <SVG icon={icons.plus} size={"14"} />
            {i18n.t("metadataform.navigation.createAnother")}
          </a>

          <AnchorButton
            className="mt-2 text-center"
            variant="primary"
            href={PAGES_AUTH.manage_metadata}
          >
            {i18n.t("metadataform.navigation.myDatasets")}
          </AnchorButton>
        </div>
      </ContainerSection>
    </>
  );
}
