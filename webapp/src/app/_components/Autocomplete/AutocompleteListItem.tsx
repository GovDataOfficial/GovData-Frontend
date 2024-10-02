import React, { PropsWithChildren } from "react";

export type PassedListItemProps = {
  index: number;
  isActive: boolean;
  onClick: () => void;
};
type AutocompleteListItem = PassedListItemProps;

export function AutocompleteListItem({
  index,
  isActive,
  onClick,
  children,
}: PropsWithChildren<AutocompleteListItem>) {
  return (
    <li
      key={index}
      className={`yui3-aclist-item ${isActive ? "yui3-aclist-item-active" : ""}`}
      role="option"
      id={"autocomplete-suggestion-" + index}
      aria-selected={isActive}
      onClick={onClick}
    >
      {children}
    </li>
  );
}
