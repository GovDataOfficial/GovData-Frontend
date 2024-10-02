import { PropsWithChildren } from "react";
import { i18n } from "@/i18n";

type FilterListItem = {
  type: string;
  onClick: (type: string) => void;
};

export function FilterListItem({
  type,
  onClick,
  children,
}: PropsWithChildren<FilterListItem>) {
  const text = i18n.t("filter." + type + ".extended.title");
  const label = i18n.t("search.extended.field.label", { field: text });
  const removeFieldTitle = i18n.t("search.extended.field.remove", {
    field: text,
  });

  return (
    <li className="col-12">
      <div className={`row field field-${type}`}>
        <div className="col-12 col-sm-4 col-md-3">
          <div className="fieldtypelabel">{label}</div>
        </div>
        <div className="col-12 col-sm-8 col-md-9 fieldcontentarea">
          <div className="flex-grow-1">{children}</div>
          <button
            type="button"
            className="remove-field"
            title={removeFieldTitle}
            onClick={() => onClick(type)}
          />
        </div>
      </div>
    </li>
  );
}
