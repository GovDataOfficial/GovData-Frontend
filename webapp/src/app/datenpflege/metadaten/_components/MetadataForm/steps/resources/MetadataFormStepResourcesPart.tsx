import { Button } from "@/app/_components/Button/Button";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { Fieldset } from "@/app/_components/Inputs/Fieldset";
import { InputCheckbox } from "@/app/_components/Inputs/InputCheckbox";
import { InputDate } from "@/app/_components/Inputs/InputDate";
import { InputText } from "@/app/_components/Inputs/InputText";
import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";
import { InputUrl } from "@/app/_components/Inputs/InputUrl";
import { InputTextMultipleDescription } from "@/app/_components/Inputs/partials/InputTextMultipleDescription";
import { Select } from "@/app/_components/Inputs/Select";
import { TextArea } from "@/app/_components/Inputs/TextArea";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { Trans } from "@/app/_components/Trans/Trans";
import { defaultAvailability } from "@/app/_lib/defaultFormData";
import {
  METADATA_FORM_INPUTS,
  METADATA_FORM_MAX_LENGTH_LONG,
  METADATA_FORM_MAX_LENGTH_MEDIUM,
} from "@/app/datenpflege/metadaten/_components/MetadataForm/metadata-formConstants";
import { MetadataRessourceFormInfo } from "@/app/datenpflege/metadaten/_components/MetadataForm/steps/resources/useMetadataFormResources";
import { i18n } from "@/i18n";
import { isNotNullOrUndefined } from "@/types/typeGuards";
import { LicenseActiveSorted, MetadataResource } from "@/types/types";

type MetadataFormStepResourcesPart = {
  licenses: LicenseActiveSorted;
  resourceNumber: number;
  resourceInfo: MetadataRessourceFormInfo;
  deleteResource: (key: string) => void;
  totalResourceCount: number;
  ref?: React.Ref<HTMLInputElement>;
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

/**
 * Check if a MetadataResource has a valid license.
 * It is possible for resources to have unknown or outdated licenses,
 * in which case we need to prompt the user to choose a new one from the new dcat-ap list.
 */
function hasValidOrNoLicense(
  activeLicenseList: LicenseActiveSorted,
  resource?: MetadataResource,
) {
  const resourceLicenseId = resource?.license?.id;

  if (isNotNullOrUndefined(resourceLicenseId)) {
    return activeLicenseList.some(
      (activeLicense) => activeLicense.id === resourceLicenseId,
    );
  }
  // no license is a valid license
  return true;
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

export const MetadataFormStepResourcesPart = ({
  ref,
  licenses,
  resourceNumber,
  resourceInfo,
  deleteResource,
  totalResourceCount: resourceCount,
}: MetadataFormStepResourcesPart) => {
  const sortedLicenses = getSortedLicenses(licenses);
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
      >
        <InputTextMultipleDescription examples={["CSV", "JSON", "XML"]} />
      </InputText>
      <InputTextMultiple
        name={resourceInput.language}
        label={i18n.t("metadataform.field.resource.language.label")}
        examples={["deutsch", "englisch", "französisch"]}
        defaultValue={resource?.language}
        maxLength={METADATA_FORM_MAX_LENGTH_LONG}
      />

      {hasValidOrNoLicense(licenses, resource) ? (
        <Select
          label={i18n.t("metadataform.field.resource.license.label")}
          name={resourceInput.licenseId}
          required
          defaultValue={resource?.license?.id}
        >
          {sortedLicenses}
        </Select>
      ) : (
        <>
          <InfoBox
            className="mb-2"
            variant="error"
            title={i18n.t("metadataform.field.resource.license.help.title")}
          >
            <Trans
              i18nKey={"metadataform.field.resource.license.help.description"}
              params={{
                license: <strong>„{resource?.license?.title}“</strong>,
              }}
            />
          </InfoBox>
          <InputText
            label={i18n.t("metadataform.field.resource.license.old.label")}
            defaultValue={resource?.license?.title}
            readonly
          />
          <Select
            label={i18n.t("metadataform.field.resource.license.new.label")}
            name={resourceInput.licenseId}
            required
            showNoValueOption
          >
            {sortedLicenses}
          </Select>
        </>
      )}
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
};

MetadataFormStepResourcesPart.displayName = "ResourceFormPart";
