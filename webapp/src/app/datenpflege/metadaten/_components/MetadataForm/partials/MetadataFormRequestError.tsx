import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { Trans } from "@/app/_components/Trans/Trans";
import { MetadataRequestError } from "@/app/datenpflege/metadaten/_components/MetadataForm/useMetadataForm";
import { i18n } from "@/i18n";

type MetadataFormRequestError = {
  requestError: MetadataRequestError;
  mailFitko?: string;
};

export function MetadataFormRequestError({
  requestError,
  mailFitko,
}: MetadataFormRequestError) {
  const mail = <a href={`mailto:${mailFitko}`}>{mailFitko}</a>;

  return (
    <InfoBox
      variant="error"
      title={i18n.t(`metadataform.errors.request.title.${requestError}`)}
      className="mb-5"
    >
      <Trans
        i18nKey={`metadataform.errors.request.description.${requestError}`}
        params={{ mail }}
      />
    </InfoBox>
  );
}
