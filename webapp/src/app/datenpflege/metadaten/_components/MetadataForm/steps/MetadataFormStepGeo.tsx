import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";
import { GeolocationCodeExample } from "@/app/_components/GeolocationCodeExample/GeoloctionCodeExample";
import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";
import { Select } from "@/app/_components/Inputs/Select";
import { SpatialTextArea } from "@/app/_components/Inputs/SpatialTextArea";
import { defaultPoliciticalGeocodingLevel } from "@/app/_lib/defaultFormData";
import {
  METADATA_FORM_INPUTS,
  METADATA_FORM_MAX_LENGTH_LONG,
} from "@/app/datenpflege/metadaten/_components/MetadataForm/metadata-formConstants";
import { MetadataFormStepContainer } from "@/app/datenpflege/metadaten/_components/MetadataForm/partials/MetadataFormStepContainer";
import { i18n } from "@/i18n";
import { Metadata } from "@/types/types";

function getGeocodingUriLinks() {
  const geoCodingUriLinks = [
    { key: "municipalityKey", label: "Gemeindeschlüssel" },
    { key: "regionalKey", label: "Regionalschlüssel" },
    { key: "municipalAssociationKey", label: "Gemeindeverbände" },
    { key: "districtKey", label: "Kreise" },
    { key: "governmentDistrictKey", label: "Bezirke" },
    { key: "stateKey", label: "Bundesländer" },
  ];

  return geoCodingUriLinks.map((link) => (
    <ExternalLink
      key={link.key}
      className="paragraph-small bold"
      href={`https://www.dcat-ap.de/def/politicalGeocoding/${link.key}`}
      title={link.label}
    />
  ));
}

type MetadataFormStepGeo = Omit<MetadataFormStepContainer, "headline"> & {
  defaultPoliciticalGeocodingLevelURI?: string;
  defaultPoliciticalGeocodingURI?: Metadata["politicalGeocodingURI"];
  defaultGeocodingText?: Metadata["geocodingText"];
  defaultSpatial?: Metadata["spatial"];
};

export function MetadataFormStepGeo({
  currentStep,
  forStep,
  defaultPoliciticalGeocodingLevelURI,
  defaultPoliciticalGeocodingURI,
  defaultGeocodingText,
  defaultSpatial,
}: MetadataFormStepGeo) {
  return (
    <MetadataFormStepContainer
      currentStep={currentStep}
      forStep={forStep}
      headline={i18n.t("metadataform.step.geo")}
    >
      <Select
        showNoValueOption
        label={i18n.t("metadataform.field.policiticalGeocodingLevel.label")}
        name={METADATA_FORM_INPUTS.POLICITICAL_GEOCODING_LEVEL}
        defaultValue={defaultPoliciticalGeocodingLevelURI}
        recommended
      >
        {defaultPoliciticalGeocodingLevel?.map((geo) => (
          <option key={geo.key} value={geo.key}>
            {geo.label}
          </option>
        ))}
      </Select>
      <InputTextMultiple
        label={i18n.t("metadataform.field.policiticalGeocoding.label")}
        name={METADATA_FORM_INPUTS.POLICITICAL_GEOCODING}
        recommended
        defaultValue={defaultPoliciticalGeocodingURI}
        maxLength={METADATA_FORM_MAX_LENGTH_LONG}
        descriptionTitle={"URI-Listen"}
        examples={getGeocodingUriLinks()}
      />
      <InputTextMultiple
        name={METADATA_FORM_INPUTS.GEOCODING_TEXT}
        label={i18n.t("metadataform.field.geocodingText.label")}
        examples={[
          "Gemeinden des Wasserzweckverbands Straubing-Land",
          "Verband Region Rhein-Neckar",
        ]}
        defaultValue={defaultGeocodingText}
        maxLength={METADATA_FORM_MAX_LENGTH_LONG}
      />
      <div className="form-geolocation">
        <SpatialTextArea
          name={METADATA_FORM_INPUTS.SPATIAL}
          label={i18n.t("metadataform.field.spatial.label")}
          defaultValue={defaultSpatial}
          recommended
          maxLength={METADATA_FORM_MAX_LENGTH_LONG}
        />
        <GeolocationCodeExample />
      </div>
    </MetadataFormStepContainer>
  );
}
