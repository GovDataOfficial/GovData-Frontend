import { useId } from "react";
import { RecommendedInfo } from "@/app/_components/Inputs/partials/RecommendedInfo";

type MultiCheckBox = {
  data?: { key: string; label: string }[];
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
                  type="checkbox"
                />
                <label htmlFor={itemId}>{item.label}</label>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}
