import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { Trans } from "@/app/_components/Trans/Trans";
import { MetadataRequestError } from "@/app/datenpflege/metadaten/_components/MetadataForm/useMetadataForm";
import { i18n } from "@/i18n";

type MetadataFormRequestError = {
  requestError: MetadataRequestError;
  mailFitko?: string;
  timeStamp?: string;
};

const formatTimestampForUser = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return i18n.t("time.format.dateTime", {
    date: `${day}.${month}.${year}`,
    time: `${hours}:${minutes}:${seconds}`,
    oClock: i18n.t("time.oClock"),
  });
};

export function MetadataFormRequestError({
  requestError,
  mailFitko,
  timeStamp,
}: MetadataFormRequestError) {
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
  return (
    <InfoBox
      variant="error"
      title={i18n.t(`metadataform.errors.request.title.${requestError}`)}
      className="mb-5"
    >
      <Trans
        i18nKey={`metadataform.errors.request.description.${requestError}`}
        params={{ mail, break: <br />, timeStampText }}
      />
    </InfoBox>
  );
}
