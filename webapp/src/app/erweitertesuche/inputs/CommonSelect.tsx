import { i18n } from "@/i18n";
import { useSearchParams } from "next/navigation";

type CommonSelect = {
  type: string;
  data?: { key: string; label: string }[];
};

export function CommonSelect({ type, data }: CommonSelect) {
  const searchParams = useSearchParams();

  if (!data || data.length === 0) {
    return null;
  }
  const text = i18n.t("filter." + type + ".extended.title");
  const id = "filter-field-" + type;
  return (
    <>
      <label className="offscreen" htmlFor={id}>
        {"in " + text}
      </label>
      <select
        name={type}
        id={id}
        defaultValue={searchParams.get(type) || undefined}
      >
        {data?.map((item) => (
          <option key={item.key} value={item.key}>
            {item.label}
          </option>
        ))}
      </select>
    </>
  );
}
