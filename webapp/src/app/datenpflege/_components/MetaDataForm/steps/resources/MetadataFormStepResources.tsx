import { InputText } from "@/app/_components/Inputs/InputText";
import { TextArea } from "@/app/_components/Inputs/TextArea";
import { InputCheckbox } from "@/app/_components/Inputs/InputCheckbox";
import { Fieldset } from "@/app/_components/Inputs/Fieldset";
import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";
import { Select } from "@/app/_components/Inputs/Select";
import { LicenseActiveSorted, MetaData } from "@/types/types";
import { InputDate } from "@/app/_components/Inputs/InputDate";

import { defaultAvailability } from "@/app/_lib/defaultFormData";
import { i18n } from "@/i18n";
import { MetaDataFormStepContainer } from "@/app/datenpflege/_components/MetaDataForm/partials/MetaDataFormStepContainer";
import {
  MAX_RESSOURCE_COUNT,
  METADATA_FORM_INPUTS,
  METADATA_FORM_MAX_LENGTH_LONG,
  METADATA_FORM_MAX_LENGTH_MEDIUM,
} from "@/app/datenpflege/_components/MetaDataForm/formConstants";
import { InputUrl } from "@/app/_components/Inputs/InputUrl";
import { Button } from "@/app/_components/Button/Button";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import {
  MetadataRessourceFormInfo,
  useMetadataFormResources,
} from "@/app/datenpflege/_components/MetaDataForm/steps/resources/useMetadataFormResources";
import { forwardRef, useRef } from "react";

type MetadataFormStepResources = Omit<MetaDataFormStepContainer, "headline"> & {
  licenses?: LicenseActiveSorted;
  defaultResources?: MetaData["resources"];
};

type ResourceFormPart = {
  licenses: MetadataFormStepResources["licenses"];
  resourceNumber: number;
  resourceInfo: MetadataRessourceFormInfo;
  isFirst: boolean;
  deleteResource: (key: string) => void;
  totalResourceCount: number;
};

function mapLicensesToOption(licenses: LicenseActiveSorted) {
  return licenses.map((license) => (
    <option key={license.id} value={license.id}>
      {license.title}
    </option>
  ));
}

function OptionDivider() {
  return <option disabled>──────────</option>;
}

function getSortedLicenses(licenses?: LicenseActiveSorted) {
  const firstCategory: LicenseActiveSorted = [];
  const secondCategory: LicenseActiveSorted = [];
  const otherCategory: LicenseActiveSorted = [];

  licenses?.forEach((license) => {
    if (license.id.endsWith("cc-zero") || license.id.endsWith("cc-by")) {
      firstCategory.push(license);
    } else if (license.id.includes("other-")) {
      otherCategory.push(license);
    } else {
      secondCategory.push(license);
    }
  });

  return [
    mapLicensesToOption(firstCategory),
    <OptionDivider key="divider1" />,
    mapLicensesToOption(secondCategory),
    <OptionDivider key="divider2" />,
    mapLicensesToOption(otherCategory),
  ];
}

const ResourceFormPart = forwardRef<HTMLInputElement, ResourceFormPart>(
  (
    {
      licenses,
      resourceNumber,
      resourceInfo,
      isFirst,
      deleteResource,
      totalResourceCount: resourceCount,
    },
    ref,
  ) => {
    const resourceInput = METADATA_FORM_INPUTS.RESSOURCE(resourceNumber);
    const { resource, id } = resourceInfo;

    return (
      <Fieldset
        legend={i18n.t("metadataform.fieldset.resource.label", {
          count: resourceNumber + 1,
        })}
      >
        {resourceCount > 1 && (
          <Button
            variant="secondary"
            onClick={() => {
              deleteResource(id);
            }}
            className="metadata-form-fieldset-legend-button"
          >
            <SVG icon={icons.trash} size="big" />
            <span className="ms-0_5">
              {i18n.t("metadataform.field.resource.delete", {
                count: resourceNumber + 1,
              })}
            </span>
          </Button>
        )}

        <InputUrl
          name={resourceInput.url}
          label={i18n.t("metadataform.field.resource.url.label")}
          required={true}
          defaultValue={resource?.url}
          maxLength={METADATA_FORM_MAX_LENGTH_MEDIUM}
          ref={ref}
        />
        <InputText
          name={resourceInput.name}
          label={i18n.t("metadataform.field.resource.name.label")}
          defaultValue={resource?.name}
          maxLength={METADATA_FORM_MAX_LENGTH_MEDIUM}
        />
        <TextArea
          name={resourceInput.description}
          label={i18n.t("metadataform.field.resource.description.label")}
          defaultValue={resource?.description}
          maxLength={METADATA_FORM_MAX_LENGTH_LONG}
        />
        <InputText
          name={resourceInput.format}
          label={i18n.t("metadataform.field.resource.format.label")}
          defaultValue={resource?.format}
          maxLength={METADATA_FORM_MAX_LENGTH_MEDIUM}
        />
        <InputTextMultiple
          name={resourceInput.language}
          label={i18n.t("metadataform.field.resource.language.label")}
          examples={["deutsch", "englisch", "französisch"]}
          defaultValue={resource?.language}
          maxLength={METADATA_FORM_MAX_LENGTH_LONG}
        />
        <Select
          label={i18n.t("metadataform.field.resource.license.label")}
          name={resourceInput.licenseId}
          required={isFirst}
          defaultValue={resource?.license?.id}
        >
          {getSortedLicenses(licenses)}
        </Select>
        <InputText
          name={resourceInput.licenseAttributionByText}
          label={i18n.t(
            "metadataform.field.resource.licenseAttributionByText.label",
          )}
          defaultValue={resource?.licenseAttributionByText}
          maxLength={METADATA_FORM_MAX_LENGTH_MEDIUM}
        />
        <InputDate
          name={resourceInput.modified}
          label={i18n.t("metadataform.field.resource.modified.label")}
          defaultValue={resource?.modified}
        />
        <Select
          showNoValueOption
          label={i18n.t("metadataform.field.resource.availability.label")}
          name={resourceInput.availability}
          defaultValue={resource?.shortendAvailability}
          recommended
        >
          {defaultAvailability?.map((availability) => (
            <option key={availability.key} value={availability.key}>
              {availability.label}
            </option>
          ))}
        </Select>
        <InputCheckbox
          name={resourceInput.hvd}
          label={i18n.t("metadataform.field.resource.hvd.label")}
          defaultChecked={resource?.hvd}
        />
      </Fieldset>
    );
  },
);

ResourceFormPart.displayName = "ResourceFormPart";

export { ResourceFormPart };

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
      {visibleResources?.map((resourceInfo, index) => (
        <ResourceFormPart
          key={resourceInfo.id}
          resourceNumber={index}
          licenses={licenses}
          resourceInfo={resourceInfo}
          isFirst={index === 0}
          deleteResource={() => deleteResource(resourceInfo.id, index + 1)}
          totalResourceCount={visibleResources.length}
          ref={index === visibleResources.length - 1 ? setFirstInputRef : null}
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
