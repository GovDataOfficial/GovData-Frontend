import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";
import { Trans } from "@/app/_components/Trans/Trans";
import { i18n } from "@/i18n";

export function UserSurveyHeader() {
  const { t } = i18n;
  const showUserSurveyHeader = process.env.show_user_survey_header;
  const showUserSurveyLink = process.env.user_survey_link;
  return showUserSurveyLink &&
    showUserSurveyHeader &&
    showUserSurveyHeader.toLowerCase() === "true" ? (
    <div className={`usersurvey-header mt-2`}>
      <div className="d-flex flex-nowrap">
        <p>
          <Trans
            i18nKey="usersurvey.text"
            params={{
              title: <strong>{t("usersurvey.title")}</strong>,
              description: <span>{t("usersurvey.description")}</span>,
              link: (
                <ExternalLink
                  href={showUserSurveyLink}
                  title={t("usersurvey.link")}
                />
              ),
            }}
          ></Trans>
        </p>
      </div>
    </div>
  ) : null;
}
