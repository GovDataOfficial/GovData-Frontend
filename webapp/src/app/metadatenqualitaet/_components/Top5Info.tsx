import { i18n } from "@/i18n";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";

export function Top5Info() {
  return (
    <ContainerSection
      headline="Top 5"
      headlineLevel="h2"
      containerWidth="lg"
      centerHeadline
      modifier={[
        ContainerWrapperModifier.BG_WHITE,
        ContainerWrapperModifier.PADDING_Y,
      ]}
    >
      <p>{i18n.t("metadataquality.top5info")}</p>
    </ContainerSection>
  );
}
