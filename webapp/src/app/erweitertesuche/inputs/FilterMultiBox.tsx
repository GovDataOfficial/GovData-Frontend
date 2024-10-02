import { i18n } from "@/i18n";
import { useSearchParams } from "next/navigation";

type FilterMultiBox = {
  type: string;
  data?: { key: string; label: string }[];
};

export function FilterMultiBox({ type, data }: FilterMultiBox) {
  const searchParams = useSearchParams();
  const text = i18n.t("filter." + type + ".extended.title");
  const activeParams = searchParams.getAll(type);
  return (
    <fieldset className="multiboxarea">
      <legend className="offscreen">{"in " + text}</legend>
      {data?.map((item) => {
        const id = `${type}_${item.key}`;
        return (
          <div key={item.key} className="checkboxitem">
            <input
              className="offscreen"
              id={id}
              value={item.key}
              name={type}
              type="checkbox"
              defaultChecked={activeParams.includes(item.key)}
            />
            <label className="checkbox" htmlFor={id}>
              {item.label}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
}
