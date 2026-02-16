"use client";

import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { Trans } from "@/app/_components/Trans/Trans";
import { i18n } from "@/i18n";

export function SectionDatenzugriffUndSchnittstellen() {
  return (
    <ContainerSection
      containerWidth="lg"
      centerHeadline
      headlineLevel="h2"
      modifier={[
        ContainerWrapperModifier.BG_WHITE,
        ContainerWrapperModifier.BOTTOM_SEPARATOR,
        ContainerWrapperModifier.PADDING_Y,
      ]}
      headline={i18n.t("sparql.datenzugriffundschnittstellen.headline")}
    >
      <p>{i18n.t("sparql.datenzugriffundschnittstellen.text")}</p>
    </ContainerSection>
  );
}
