import React from "react";

import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { HomePageLink } from "@/app/_components/HomePageLink/HomePageLink";
import { metaDataGenerator } from "@/app/_lib/getMetaData";
import { i18n } from "@/i18n";

export const metadata = metaDataGenerator({
  title: i18n.t("meta.blog.title"),
});

export default function Page() {
  return (
    <>
      <ContainerSection
        containerWidth="930"
        headline={i18n.t("header.navigation.blog")}
        centerHeadline
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <DesignBox>
          <p className="m-0">
            {i18n.t("blog.underConstruction")}&nbsp;
            <HomePageLink />
          </p>
        </DesignBox>
      </ContainerSection>
    </>
  );
}
