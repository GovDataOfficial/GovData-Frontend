import { TextArea } from "@/app/_components/Inputs/TextArea";
import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";
import { MetaDataFormStepContainer } from "@/app/datenpflege/metadaten/form/partials/MetaDataFormStepContainer";
import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";
import { Select } from "@/app/_components/Inputs/Select";
import { defaultPoliciticalGeocodingLevel } from "@/app/_lib/defaultFormData";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/metadaten/form/formConstants";
import { i18n } from "@/i18n";
import { Trans } from "@/app/_components/Trans/Trans";

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

type MetadataFormStepGeo = Omit<MetaDataFormStepContainer, "headline">;
export function MetadataFormStepGeo({
  currentStep,
  forStep,
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
        recommended
      >
        {defaultPoliciticalGeocodingLevel?.map((geo) => (
          <option key={geo.key} value={geo.key}>
            {geo.label}
          </option>
        ))}
      </Select>

      <InputTextMultiple
        name={METADATA_FORM_INPUTS.POLICITICAL_GEOCODING}
        label={i18n.t("metadataform.field.policiticalGeocoding.label")}
        recommended
        examples={["Wert1", "Wert2", "Wert3"]}
      />
      <InputTextMultiple
        name={METADATA_FORM_INPUTS.GEOCODING_TEXT}
        label={i18n.t("metadataform.field.geocodingText.label")}
        examples={["Wert1", "Wert2", "Wert3"]}
      />
      <div className="metadata-form-geolocation">
        <TextArea
          name={METADATA_FORM_INPUTS.SPATIAL}
          label={i18n.t("metadataform.field.spatial.label")}
          recommended
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
