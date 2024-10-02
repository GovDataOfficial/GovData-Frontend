import { i18n } from "@/i18n";
import { useSearchParams } from "next/navigation";

type CommonInputText = {
  type: string;
  data?: { key: string; label: string }[];
};

export function CommonInputText({ type }: CommonInputText) {
  const searchParams = useSearchParams();
  const id = "filter-field-" + type;
  const text = i18n.t("filter." + type + ".extended.title");

  return (
    <>
      <label className="offscreen" htmlFor={id}>
        {"in " + text}
      </label>
      <input
        type="text"
        id={id}
        name={type}
        defaultValue={searchParams.get(type) || undefined}
        placeholder={i18n.t("search.extended.input.placeholder")}
      />
    </>
  );
}
