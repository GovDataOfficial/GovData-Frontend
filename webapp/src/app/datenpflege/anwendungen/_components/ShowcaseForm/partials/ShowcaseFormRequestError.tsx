import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { ShowcaseRequestError } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/useShowcaseForm";
import { i18n } from "@/i18n";

type ShowcaseFormRequestError = {
  requestError: ShowcaseRequestError;
};

export function ShowcaseFormRequestError({
  requestError,
}: ShowcaseFormRequestError) {
  return (
    <InfoBox
      variant="error"
      title={i18n.t(`showcaseform.errors.request.title.${requestError}`)}
      className="mb-5"
    >
      {i18n.t(`showcaseform.errors.request.description.${requestError}`)}
    </InfoBox>
  );
}
