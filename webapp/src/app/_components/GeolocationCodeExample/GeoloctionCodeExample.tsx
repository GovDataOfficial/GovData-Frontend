import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";
import { Trans } from "@/app/_components/Trans/Trans";
import { i18n } from "@/i18n";

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

export function GeolocationCodeExample() {
  return (
    <div className={"form-geolocation-code-example"}>
      <strong>{i18n.t("form.field.spatial.example")}</strong>
      <code>
        <pre>{exampleCode}</pre>
      </code>
      <p className="mt-1">
        <Trans
          i18nKey={"form.field.spatial.description"}
          params={{
            link: <ExternalLink href={getGeoJsonIoLink()} title="geojson.io" />,
          }}
        />
      </p>
    </div>
  );
}
