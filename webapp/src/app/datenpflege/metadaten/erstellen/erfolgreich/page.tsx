import { Metadata } from "next";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import React from "react";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { ButtonLink } from "@/app/_components/Button/ButtonLink";
import { i18n } from "@/i18n";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { SuccessBox } from "@/app/_components/InfoBoxes/SuccessBox";

export const metadata: Metadata = {
  title: i18n.t("meta.managedata.create.success"),
};

export default function Page() {
  return (
    <>
      <ContainerSection
        containerWidth="930"
        headline={i18n.t("metadataform.success.headline")}
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <SuccessBox title={i18n.t("metadataform.success.box.title")}>
          {i18n.t("metadataform.success.box.description")}
        </SuccessBox>
        <ButtonLink variant="secondary" href={PAGES_AUTH.manage_data_form_add}>
          <SVG icon={icons.plus} size={"14"} />
          <span className="ms-1">
            {i18n.t("metadataform.navigation.createAnother")}
          </span>
        </ButtonLink>
      </ContainerSection>
    </>
  );
}
