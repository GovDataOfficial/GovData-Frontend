import { Select } from "@/app/_components/Inputs/Select";
import { i18n } from "@/i18n";
import { endpointOptions } from "@/app/sparql-assistent/SparqlEditor/data";

import { EndpointType } from "@/app/sparql-assistent/SparqlEditor/types";

type SelectEndpoint = {
  value: string;
  onChange: (value: EndpointType) => void;
  className?: string;
};

export function SelectEndpoint({
  value,
  onChange,
  className = "",
}: SelectEndpoint) {
  return (
    <Select
      label={i18n.t("sparql.endpoint.select.label")}
      value={value}
      onChange={onChange}
      labelInvisible
      className={className}
    >
      {endpointOptions?.map((item) => (
        <option key={item.key} value={item.key}>
          {item.label}
        </option>
      ))}
    </Select>
  );
}
