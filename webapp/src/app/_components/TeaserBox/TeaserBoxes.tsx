import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { TeaserBoxNumber } from "@/app/_components/TeaserBox/partials/TeaserBoxNumber";
import { TeaserBoxMastodon } from "@/app/_components/TeaserBox/partials/TeaserBoxMastodon";
import React from "react";
import { fetchMastodonData, fetchPortalNumbers } from "@/app/_lib/getData";
import { i18n } from "@/i18n";
import { icons } from "@/app/_components/SVG/iconMap";
import { PortalNumbers } from "@/types/types";
import {
  createLinkToSearchWithHVD,
  createLinkToSearchWithType,
} from "@/app/_lib/URLHelper";

function findTypeByName(name: string, data?: PortalNumbers) {
  return data?.filterMap?.type?.facetList?.find((type) => type.name === name);
}

export async function TeaserBoxes() {
  const numbersData = await fetchPortalNumbers();
  const mastodonData = await fetchMastodonData();

  if (!numbersData && !mastodonData) {
    return null;
  }

  const dataset = findTypeByName("dataset", numbersData);
  const showcase = findTypeByName("showcase", numbersData);
  const hvd = numbersData
    ? { docCount: numbersData.hvdDatasets, name: "hvd" }
    : undefined;

  return (
    <ContainerSection
      modifier={[
        ContainerWrapperModifier.BG_WHITE,
        ContainerWrapperModifier.PADDING_Y,
      ]}
      headline={i18n.t("home.teaserbox.headline")}
      headlineLevel="h2"
      containerWidth="930"
      headlineInvisible
    >
      <div className="gd-teaser-box-container">
        {dataset && (
          <TeaserBoxNumber
            docCount={dataset.docCount}
            name={i18n.t(`home.teaserbox.numbers.dataset`)}
            icon={icons.mediatype_dataset_inverted}
            href={createLinkToSearchWithType("dataset")}
          />
        )}
        {hvd && (
          <TeaserBoxNumber
            docCount={hvd.docCount}
            name={i18n.t(`home.teaserbox.numbers.hvd`)}
            icon={icons.hvd}
            href={createLinkToSearchWithHVD()}
          />
        )}
        {showcase && (
          <TeaserBoxNumber
            docCount={showcase.docCount}
            name={i18n.t(`home.teaserbox.numbers.showcase`)}
            icon={icons.tool}
            href={createLinkToSearchWithType("showcase")}
          />
        )}
        {mastodonData && <TeaserBoxMastodon data={mastodonData} />}
      </div>
    </ContainerSection>
  );
}
