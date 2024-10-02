import React, { useState } from "react";
import { isNotNullOrUndefined } from "@/types/typeGuards";
import { InputDescription } from "@/app/_components/Inputs/partials/InputDescription";
import { InputText } from "@/app/_components/Inputs/InputText";
import { i18n } from "@/i18n";

type InputTextMultiple = {
  name: string;
  label: string;
  required?: boolean;
  examples?: string[];
  recommended?: boolean;
};

const cleanTagValue = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/[^a-zäöüß0-9 \-_\.]/g, "")
    .trim();

/**
 * Input text that will comma separate values.
 * Input for extended Search has same logic but is different in style and markup.
 * needs refacotring.
 */
export function InputTextMultiple({
  label,
  name,
  required,
  examples,
  recommended,
}: InputTextMultiple) {
  const [tags, setTags] = useState<string>("");

  return (
    <InputText
      name={name}
      label={label}
      required={required}
      recommended={recommended}
      onChange={(e) => setTags(e.target.value)}
    >
      <InputDescription>
        {i18n.t("form.input.text.multiple.description")}
        <br />
        <strong>Beispiel: {examples?.join(", ")}</strong>
      </InputDescription>
      {tags
        .split(",")
        .map(cleanTagValue)
        .filter(isNotNullOrUndefined)
        .map((tag, index) => (
          <input key={index + tag} hidden name={name} defaultValue={tag} />
        ))}
    </InputText>
  );
}
