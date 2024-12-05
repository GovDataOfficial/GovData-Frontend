import React, { useId } from "react";
import { RecommendedInfo } from "@/app/_components/Inputs/partials/RecommendedInfo";
import { Label } from "@/app/_components/Inputs/partials/Label";

type MultiCheckBox = {
  data?: { key: string; label: string; defaultChecked?: boolean }[];
  legend: string;
  recommended?: boolean;
  name: string;
};

export function MultiCheckBox({
  data,
  legend,
  recommended,
  name,
}: MultiCheckBox) {
  const id = useId();

  return (
    <div className="gd-input">
      <fieldset>
        <legend>
          {legend}
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
