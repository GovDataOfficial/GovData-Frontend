import React, { useId } from "react";

import { Label } from "@/app/_components/Inputs/partials/Label";
import { RecommendedInfo } from "@/app/_components/Inputs/partials/RecommendedInfo";
import { useCheckboxGroup } from "@/app/_components/Inputs/useCheckboxGroup";
import { i18n } from "@/i18n";

type MultiCheckBox = {
  data?: { key: string; label: string; defaultChecked?: boolean }[];
  legend: string;
  required?: boolean;
  recommended?: boolean;
  name: string;
};

export function MultiCheckBox({
  data,
  legend,
  recommended,
  name,
  required,
}: MultiCheckBox) {
  const id = useId();
  const errorMessage = i18n.t("form.checkboxgroup.atLeastOne.error");
  const { setElementRef, onCheckboxChange } = useCheckboxGroup(
    errorMessage,
    required ? 1 : 0,
    data?.filter((item) => item.defaultChecked).length,
  );

  return (
    <div className="gd-input">
      <fieldset>
        <legend>
          {legend}
          {required && <strong aria-hidden="true">&nbsp;*</strong>}
          {recommended && <RecommendedInfo />}
        </legend>
        <ul className="gd-list col-2">
          {data?.map((item) => {
            const itemId = `${id}_${item.key}`;
            return (
              <li key={item.key} className={"gd-input-multi-checkbox-item"}>
                <input
                  id={itemId}
                  value={item.key}
                  name={name}
                  defaultChecked={item.defaultChecked}
                  type="checkbox"
                  ref={setElementRef}
                  onChange={onCheckboxChange}
                />
                <Label label={item.label} htmlFor={itemId} />
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}
