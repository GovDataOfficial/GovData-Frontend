import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";
import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";
import { Select } from "@/app/_components/Inputs/Select";
import { TextArea } from "@/app/_components/Inputs/TextArea";
import { Trans } from "@/app/_components/Trans/Trans";
import { defaultPoliciticalGeocodingLevel } from "@/app/_lib/defaultFormData";
import {
  METADATA_FORM_INPUTS,
  METADATA_FORM_MAX_LENGTH_LONG,
} from "@/app/datenpflege/_components/MetaDataForm/formConstants";
import { MetaDataFormStepContainer } from "@/app/datenpflege/_components/MetaDataForm/partials/MetaDataFormStepContainer";
import { i18n } from "@/i18n";
import { MetaData } from "@/types/types";

const exampleCode = `{
  "type": "Polygon",
  "coordinates": [
    [
      [11.598079, 51.29537],
      [11.598079, 53.89386],
      [6.654667, 53.89386],
      [6.654667, 51.29537],
      [11.598079, 51.29537]
    ]
  ]
}`;

const getGeoJsonIoLink = () => {
  const url = `https://geojson.io/#data=data:application/json,`;
  const cleanedJSON = exampleCode.replaceAll(/\n|\s*/g, "");
  const encodedCode = encodeURIComponent(cleanedJSON);
  return `${url}${encodedCode}`;
};

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

type MetadataFormStepGeo = Omit<MetaDataFormStepContainer, "headline"> & {
  defaultPoliciticalGeocodingLevelURI?: string;
  defaultPoliciticalGeocodingURI?: MetaData["politicalGeocodingURI"];
  defaultGeocodingText?: MetaData["geocodingText"];
  defaultSpatial?: MetaData["spatial"];
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
    <MetaDataFormStepContainer
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
      <div className="metadata-form-geolocation">
        <TextArea
          name={METADATA_FORM_INPUTS.SPATIAL}
          label={i18n.t("metadataform.field.spatial.label")}
          defaultValue={defaultSpatial}
          recommended
          maxLength={METADATA_FORM_MAX_LENGTH_LONG}
        />
        <div className={"metadata-form-geolocation-code-example"}>
          <strong>{i18n.t("metadataform.field.spatial.example")}</strong>
          <code>
            <pre>{exampleCode}</pre>
          </code>
          <p className="mt-1">
            <Trans
              i18nKey={"metadataform.field.spatial.description"}
              params={{
                link: (
                  <ExternalLink href={getGeoJsonIoLink()} title="geojson.io" />
                ),
              }}
            />
          </p>
        </div>
      </div>
    </MetaDataFormStepContainer>
  );
}
