import { Button } from "@/app/_components/Button/Button";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { MAX_RESSOURCE_COUNT } from "@/app/datenpflege/metadaten/_components/MetadataForm/metadata-formConstants";
import { MetadataFormStepContainer } from "@/app/datenpflege/metadaten/_components/MetadataForm/partials/MetadataFormStepContainer";
import { MetadataFormStepResourcesPart } from "@/app/datenpflege/metadaten/_components/MetadataForm/steps/resources/MetadataFormStepResourcesPart";
import { useMetadataFormResources } from "@/app/datenpflege/metadaten/_components/MetadataForm/steps/resources/useMetadataFormResources";
import { i18n } from "@/i18n";
import { LicenseActiveSorted, Metadata } from "@/types/types";

type MetadataFormStepResources = Omit<MetadataFormStepContainer, "headline"> & {
  licenses?: LicenseActiveSorted;
  defaultResources?: Metadata["resources"];
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
    <MetadataFormStepContainer
      currentStep={currentStep}
      forStep={forStep}
      headline={i18n.t("metadataform.step.resources")}
    >
      {licenses &&
        visibleResources?.map((resourceInfo, index) => (
          <MetadataFormStepResourcesPart
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
    </MetadataFormStepContainer>
  );
}
