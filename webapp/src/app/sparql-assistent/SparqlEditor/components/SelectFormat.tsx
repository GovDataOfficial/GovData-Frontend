import { Select } from "@/app/_components/Inputs/Select";
import { formatOptions } from "@/app/sparql-assistent/SparqlEditor/data";
import { FormatType } from "@/app/sparql-assistent/SparqlEditor/types";
import { i18n } from "@/i18n";

type SelectFormat = {
  value: string;
  onChange: (value: FormatType) => void;
  className?: string;
};

export function SelectFormat({
  value,
  onChange,
  className = "",
}: SelectFormat) {
  return (
    <Select
      label={i18n.t("sparql.format.select.label")}
      onChange={onChange}
      value={value}
      labelInvisible
      className={className}
    >
      {formatOptions?.map((item) => (
        <option key={item.key} value={item.key}>
          {item.label}
        </option>
      ))}
    </Select>
  );
}
