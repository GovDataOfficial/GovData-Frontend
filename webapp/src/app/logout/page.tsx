import { Metadata } from "next";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import React from "react";
import { hasSessionCookie } from "@/app/api/auth/_session";
import { redirect } from "next/navigation";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { HomePageLink } from "@/app/_components/HomePageLink/HomePageLink";
import { i18n } from "@/i18n";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";

export const metadata: Metadata = {
  title: i18n.t("meta.logout.title"),
};

export default async function Page() {
  // double checking if user manually calls this route,
  // redirect to logout api
  if (hasSessionCookie()) {
    redirect(API_ENDPOINTS.AUTH.LOGOUT);
  }

  return (
    <>
      <ContainerSection
        containerWidth="930"
        headline={i18n.t("logout.page.title")}
        centerHeadline
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <DesignBox>
          <HomePageLink />
          <div className="mt-2">
            <a href={PAGES_AUTH.manage_data}>
              {i18n.t("logout.page.loginAgain")}
            </a>
          </div>
        </DesignBox>
      </ContainerSection>
    </>
  );
}
