"use client";

import { Accordion } from "@/app/_components/Accordion/Accordion";
import { ContainerDiv } from "@/app/_components/Container";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { Trans } from "@/app/_components/Trans/Trans";
import { useOutsideClick } from "@/app/_lib/hooks/useOutsideClick";
import { PAGES, PAGES_AUTH } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";

type UserHeaderNavigation = {
  userName: string;
  isShowcaseEditor?: boolean;
};

/**
 * Navigation for logged-in Users.
 * Using Accordion (Details/Summary) Component to create a flyout.
 *  - not reliant on JS, so user can log out even if js is not enabled.
 *  - outside click closes only enhancement.
 */
export function UserHeaderNavigation({
  userName,
  isShowcaseEditor,
}: UserHeaderNavigation) {
  const { t } = i18n;
  const ref = useOutsideClick<HTMLDetailsElement>((r) => {
    r.current?.removeAttribute("open");
  });

  return (
    <nav
      aria-label={t("header.user.navigation.label")}
      className="gd-user-header-navigation"
    >
      <ContainerDiv containerWidth="lg">
        <div className="gd-user-header-accordion-container">
          <Accordion
            ref={ref}
            title={<span>{userName}</span>}
            variant="link"
            rotateArrows
          >
            <ul className="gd-list gd-user-header-accordion-flyout">
              <li>
                <a href={PAGES_AUTH.manage_metadata}>
                  <Trans
                    i18nKey="header.user.navigation.myDatasets"
                    params={{ break: <br /> }}
                  />
                </a>
              </li>
              {isShowcaseEditor && (
                <li>
                  <a href={PAGES_AUTH.manage_showcases}>
                    <Trans
                      i18nKey="header.user.navigation.myShowcases"
                      params={{ break: <br /> }}
                    />
                  </a>
                </li>
              )}
              <li>
                <a href={PAGES.logout} className="d-flex">
                  <SVG icon={icons.login} size="big" className="primary" />
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
