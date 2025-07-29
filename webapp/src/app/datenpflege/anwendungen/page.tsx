import React from "react";
import { Metadata } from "next";

import { AnchorButton } from "@/app/_components/Button/AnchorButton";
import { ContainerSection } from "@/app/_components/Container/ContainerSection";
import { ContainerWrapperModifier } from "@/app/_components/Container/partials/ContainerWrapper";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { fetchShowcases } from "@/app/_lib/getData";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import {
  getSessionOrRedirect,
  getUserInformation,
} from "@/app/api/auth/_session";
import { ShowcaseEditorError } from "@/app/datenpflege/anwendungen/_components/ShowcaseEditorError";
import { ShowcasesOverviewContainer } from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewContainer";
import { ShowcaseWelcome } from "@/app/datenpflege/anwendungen/_components/ShowcaseWelcome";
import { OverviewDeleteInfoBox } from "@/app/datenpflege/common/OverviewDeleteInfoBox";
import { i18n } from "@/i18n";
import { PageConstructor } from "@/types/types";

export const metadata: Metadata = {
  title: i18n.t("meta.manageshowcases.title"),
};

export default async function Page(props: PageConstructor) {
  const searchParams = await props.searchParams;
  const { t } = i18n;

  /*
   * searchParams are ignored in the redirectUrl, since they only manage the delete feedback
   */
  const session = await getSessionOrRedirect(PAGES_AUTH.manage_showcases);
  const searchResults = await fetchShowcases();
  const data = searchResults ? (searchResults.hits as any) : undefined;
  const userInformation = await getUserInformation();
  return (
    <>
      <OverviewDeleteInfoBox
        searchParams={searchParams}
        translationsKey="showcasesoverview"
      />
      <ContainerSection
        containerWidth="lg"
        headline={t("metadata.welcome.title", {
          name: session.username,
        })}
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        {!userInformation?.isShowcaseEditor ? (
          <ShowcaseEditorError />
        ) : (
          <>
            <ShowcaseWelcome />
            <AnchorButton
              href={PAGES_AUTH.manage_showcases_form_add}
              variant="primary"
            >
              <SVG icon={icons.plus} size="14" />
              <span className="ms-0_5">{t("showcaseform.create")}</span>
            </AnchorButton>
            {data && data.length > 0 && (
              <ShowcasesOverviewContainer data={data} />
            )}
          </>
        )}
      </ContainerSection>
    </>
  );
}
