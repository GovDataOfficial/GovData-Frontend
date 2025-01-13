import { ReactNode } from "react";

import { i18n } from "@/i18n";

type InputTextMultipleDescription = {
  descriptionTitle?: string;
  examples?: ReactNode[];
};

export function InputTextMultipleDescription({
  descriptionTitle = "Beispiel",
  examples,
}: InputTextMultipleDescription) {
  if (!examples || examples.length === 0) {
    return null;
  }

  return (
    <span className="paragraph-small my-0">
      {i18n.t("form.input.text.multiple.description")}.
      <br />
      <strong>{descriptionTitle}:&nbsp;</strong>
      <ul className="gd-list gd-list-comma">
        {examples.map((element, index) => (
          <li className="paragraph-small bold" key={index}>
            {element}
          </li>
        ))}
      </ul>
    </span>
  );
}
