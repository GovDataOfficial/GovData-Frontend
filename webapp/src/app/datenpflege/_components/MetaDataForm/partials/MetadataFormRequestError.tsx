import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { Trans } from "@/app/_components/Trans/Trans";
import { RequestError } from "@/app/datenpflege/_components/MetaDataForm/useMetadataForm";
import { i18n } from "@/i18n";

type MetaDataFormRequestError = {
  requestError: RequestError;
  mailFitko?: string;
};

export function MetaDataFormRequestError({
  requestError,
  mailFitko,
}: MetaDataFormRequestError) {
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
