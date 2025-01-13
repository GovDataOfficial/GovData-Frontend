import { LicenseActiveSorted, MetaData } from "@/types/types";
import { i18n } from "@/i18n";
import { MetaDataFormStepContainer } from "@/app/datenpflege/_components/MetaDataForm/partials/MetaDataFormStepContainer";
import { MAX_RESSOURCE_COUNT } from "@/app/datenpflege/_components/MetaDataForm/formConstants";
import { Button } from "@/app/_components/Button/Button";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { useMetadataFormResources } from "@/app/datenpflege/_components/MetaDataForm/steps/resources/useMetadataFormResources";
import { MetaDataFormStepResourcesPart } from "@/app/datenpflege/_components/MetaDataForm/steps/resources/MetadataFormStepResourcesPart";

type MetadataFormStepResources = Omit<MetaDataFormStepContainer, "headline"> & {
  licenses?: LicenseActiveSorted;
  defaultResources?: MetaData["resources"];
};

export function MetadataFormStepResources({
  licenses,
  forStep,
  currentStep,
  defaultResources,
}: MetadataFormStepResources) {
  const {
    visibleResources,
    addNewResource,
    deleteResource,
    liveRegionMessage,
    addButtonRef,
    setFirstInputRef,
  } = useMetadataFormResources({
    defaultResources,
  });

  return (
    <MetaDataFormStepContainer
      currentStep={currentStep}
      forStep={forStep}
      headline={i18n.t("metadataform.step.resources")}
    >
      {licenses &&
        visibleResources?.map((resourceInfo, index) => (
          <MetaDataFormStepResourcesPart
            key={resourceInfo.id}
            resourceNumber={index}
            licenses={licenses}
            resourceInfo={resourceInfo}
            deleteResource={() => deleteResource(resourceInfo.id, index + 1)}
            totalResourceCount={visibleResources.length}
            ref={
              index === visibleResources.length - 1 ? setFirstInputRef : null
            }
          />
        ))}
      {visibleResources.length < MAX_RESSOURCE_COUNT && (
        <Button
          variant="secondary"
          onClick={() => addNewResource()}
          ref={addButtonRef}
        >
          <SVG icon={icons.plus} size="14" />
          <span className="ms-0_5">
            {i18n.t("metadataform.field.resource.add")}
          </span>
        </Button>
      )}
      <div aria-live="polite" className="sr-only">
        {liveRegionMessage}
      </div>
    </MetaDataFormStepContainer>
  );
}
