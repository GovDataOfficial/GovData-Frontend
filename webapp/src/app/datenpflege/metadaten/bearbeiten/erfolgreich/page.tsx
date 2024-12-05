import { Metadata } from "next";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import React from "react";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";

export const metadata: Metadata = {
  title: i18n.t("meta.managedata.edit.success"),
};

export default function Page() {
  return (
    <>
      <ContainerSection
        containerWidth="930"
        headline={i18n.t("metadataform.success.edit.headline")}
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <div className="my-2">
          <InfoBox
            title={i18n.t("metadataform.success.edit.box.title")}
            variant={"success"}
          />
        </div>
        <a href={PAGES_AUTH.manage_data}>
          {i18n.t("metadataform.success.edit.back")}
        </a>
      </ContainerSection>
    </>
  );
}
