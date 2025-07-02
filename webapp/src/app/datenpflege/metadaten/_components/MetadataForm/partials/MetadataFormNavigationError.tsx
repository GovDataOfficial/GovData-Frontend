import { i18n } from "@/i18n";

export function MetadataFormNavigationError({ step }: { step: number }) {
  return (
    <span role="alert" className="sticky-nav-error">
      <span className={"sr-only"}>
        {i18n.t("metadataform.stepInfo.stepNumber", { step })}
      </span>
      {i18n.t("metadataform.errors.fieldValidation")}
    </span>
  );
}
