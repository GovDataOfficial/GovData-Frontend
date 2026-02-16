import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { Trans } from "@/app/_components/Trans/Trans";
import { useLoginRedirect } from "@/app/datenpflege/_lib/useFormErrorHelpers";
import { ShowcaseRequestError } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/useShowcaseForm";
import { i18n } from "@/i18n";

type ShowcaseFormRequestError = {
  requestError: ShowcaseRequestError;
};

export function ShowcaseFormRequestError({
  requestError,
}: ShowcaseFormRequestError) {
  const { loginUrl } = useLoginRedirect();

  const loginLink = (
    <a href={loginUrl}>
      {i18n.t(
        "showcaseform.errors.request.description.sessionTimeout.loginLink",
      )}
    </a>
  );

  return (
    <InfoBox
      variant="error"
      title={i18n.t(`showcaseform.errors.request.title.${requestError}`)}
      className="mb-5"
    >
      <Trans
        i18nKey={`showcaseform.errors.request.description.${requestError}`}
        params={{ loginLink }}
      />
    </InfoBox>
  );
}
