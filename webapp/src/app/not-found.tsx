import React from "react";
import { Metadata } from "next";

import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { HomePageLink } from "@/app/_components/HomePageLink/HomePageLink";
import { i18n } from "@/i18n";

export const metadata: Metadata = {
  title: i18n.t("meta.notFound.title"),
};

export default function NotFound() {
  return (
    <ContainerSection
      containerWidth="930"
      headline={i18n.t("notFound.page.headline")}
      centerHeadline
      modifier={[ContainerWrapperModifier.MARGIN_TOP]}
    >
      <DesignBox>
        <p className="m-0">
          {i18n.t("notFound.page.cantShow")}&nbsp;
          <HomePageLink />
        </p>
      </DesignBox>
    </ContainerSection>
  );
}
