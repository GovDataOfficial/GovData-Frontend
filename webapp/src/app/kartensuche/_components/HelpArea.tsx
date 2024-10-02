import { i18n } from "@/i18n";
import { Trans } from "@/app/_components/Trans/Trans";
import { ContainerDiv } from "@/app/_components/Container";

export function HelpArea() {
  const { t } = i18n;

  const helpSymbol = (
    <span className="icon-map-marker fa-location-dot fa-solid" />
  );

  return (
    <ContainerDiv containerWidth="lg">
      <div className="row">
        <div className="col-12 col-sm-4">
          <h2 className="mt-0">{t("searchmap.help.heading")}</h2>
        </div>
        <div className="col-12 col-sm-8 col-md-6">
          <Trans
            className="mt-0"
            i18nKey="searchmap.help.description1"
            htmlElement="paragraph"
          />
          <Trans
            i18nKey="searchmap.help.description2"
            htmlElement="paragraph"
          />
          <p>
            <strong>{t("searchmap.help.tip")}: </strong>
            <Trans
              i18nKey={"searchmap.help.description3"}
              params={{ helpSymbol: helpSymbol }}
            />
          </p>
          <Trans
            i18nKey="searchmap.help.description4"
            htmlElement="paragraph"
          />{" "}
          <Trans
            i18nKey="searchmap.help.description5"
            htmlElement="paragraph"
          />{" "}
          <p>
            <strong>{t("searchmap.help.notice")}: </strong>
            {t("searchmap.help.description6")}
          </p>
        </div>
      </div>
    </ContainerDiv>
  );
}
