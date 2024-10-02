import { useState } from "react";
import { i18n } from "@/i18n";
import { useSearchParams } from "next/navigation";
import { isNotNullOrUndefined } from "@/types/typeGuards";

const cleanTagValue = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/[^a-zäöüß0-9 \-_\.]/g, "")
    .trim();

export function FilterTags() {
  const searchParams = useSearchParams();
  const allTags = searchParams.getAll("tags");
  const cleanedInitValue = allTags.map(cleanTagValue).join(",");

  const [tags, setTags] = useState<string>(cleanedInitValue);
  const id = "filter-field-tags";
  const text = i18n.t("filter.tags.extended.title");

  return (
    <>
      <label className="offscreen" htmlFor={id}>
        {"in " + text}
      </label>
      <input
        type="text"
        id={id}
        placeholder={i18n.t("search.extended.tags.placeholder")}
        onChange={(e) => setTags(e.target.value)}
        value={tags}
      />
      {tags
        .split(",")
        .map(cleanTagValue)
        .filter(isNotNullOrUndefined)
        .map((tag, index) => (
          <input key={index + tag} hidden name={"tags"} defaultValue={tag} />
        ))}
    </>
  );
}
