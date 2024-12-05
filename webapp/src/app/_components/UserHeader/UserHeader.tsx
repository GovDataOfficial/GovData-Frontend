"use server";

import { ContainerDiv } from "@/app/_components/Container";
import { getUserInformation } from "@/app/api/auth/_session";
import { PAGES, PAGES_AUTH } from "@/app/_lib/URLHelper";
import { Accordion } from "@/app/_components/Accordion/Accordion";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { i18n } from "@/i18n";
import { Trans } from "@/app/_components/Trans/Trans";

/**
 * Navigation for logged-in Users.
 *
 * Using Accordion (Details/Summary) Component to create a flyout.
 *  - not reliant on JS, so user can log out even if js is not enabled.
 */
export async function UserHeader() {
  const userInformation = await getUserInformation();
  if (!userInformation) {
    return null;
  }

  const { t } = i18n;

  return (
    <nav
      aria-label={t("header.user.navigation.label")}
      className="gd-user-header-navigation"
    >
      <ContainerDiv containerWidth="lg">
        <div className="gd-user-header-accordion-container">
          <Accordion
            title={<span>{userInformation.username}</span>}
            variant="link"
          >
            <ul className="gd-list gd-user-header-accordion-flyout">
              <li>
                <a href={PAGES_AUTH.manage_data}>
                  <Trans
                    i18nKey="header.user.navigation.myDatasets"
                    params={{ break: <br /> }}
                  />
                </a>
              </li>
              <li>
                <a href={PAGES.logout} className="d-flex">
                  <SVG icon={icons.login} size="big" />
                  <span>{t("header.user.navigation.logout")}</span>
                </a>
              </li>
            </ul>
          </Accordion>
        </div>
      </ContainerDiv>
    </nav>
  );
}
