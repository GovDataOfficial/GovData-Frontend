import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { Trans } from "@/app/_components/Trans/Trans";
import {
  formatTimestampForUser,
  useLoginRedirect,
} from "@/app/datenpflege/_lib/useFormErrorHelpers";
import { MetadataRequestError } from "@/app/datenpflege/metadaten/_components/MetadataForm/useMetadataForm";
import { i18n } from "@/i18n";

type MetadataFormRequestError = {
  requestError: MetadataRequestError;
  mailFitko?: string;
  timeStamp?: string;
};

export function MetadataFormRequestError({
  requestError,
  mailFitko,
  timeStamp,
}: MetadataFormRequestError) {
  const { loginUrl } = useLoginRedirect();
  const mailtoHref = timeStamp
    ? `mailto:${mailFitko}?subject=${encodeURIComponent(
        i18n.t("metadataform.errors.mail.subject", { timeStamp }),
      )}`
    : `mailto:${mailFitko}`;

  const mail = <a href={mailtoHref}>{mailFitko}</a>;

  const timeStampText = (
    <strong>
      {i18n.t("metadataform.errors.request.description.general.timeStampText", {
        timeStamp: timeStamp ? formatTimestampForUser(timeStamp) : "",
      })}
    </strong>
  );

  const loginLink = (
    <a href={loginUrl}>
      {i18n.t(
        "metadataform.errors.request.description.sessionTimeout.loginLink",
      )}
    </a>
  );

  return (
    <InfoBox
      variant="error"
      title={i18n.t(`metadataform.errors.request.title.${requestError}`)}
      className="mb-5"
    >
      <Trans
        i18nKey={`metadataform.errors.request.description.${requestError}`}
        params={{ mail, break: <br />, timeStampText, loginLink }}
      />
    </InfoBox>
  );
}
