import { i18n } from "@/i18n";
import React, { ReactNode, useRef, useState } from "react";
import { useOutsideClick } from "@/app/_lib/hooks/useOutsideClick";
import { PassedListItemProps } from "@/app/_components/Autocomplete/AutocompleteListItem";
import { debounce } from "@/app/_lib/debounce";
import { GlobalIds } from "@/app/_lib/globalIds";

type Autocomplete<T> = {
  label: string;
  fetchData(input: string): Promise<T[]>;
  placeholder: string;
  /**
   * Custom Selection behaviour.
   * @return string that will be shown in input after selection
   */
  onItemSelect?: (item: T) => string | undefined;
  children: (
    item: T,
    requiredListProps: PassedListItemProps,
    inputValue?: string,
  ) => ReactNode;
  inputName?: string;
  defaultValue?: string;
};

export function Autocomplete<T>({
  label,
  fetchData,
  placeholder,
  defaultValue,
  onItemSelect,
  inputName,
  children,
}: Autocomplete<T>) {
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<number | undefined>(undefined);

  const hasSuggestions = suggestions?.length > 0;
  const hasActiveItem = activeItem !== undefined;
  const openWithSuggestions = open && hasSuggestions;

  const ref = useOutsideClick(() => setOpen(false));
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const setInputRefValue = (val: string) => {
    if (inputRef.current) {
      inputRef.current.value = val;
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      fetchData(e.target.value)
        .then((r) => setSuggestions(r))
        .then(() => setOpen(true))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
      setActiveItem(undefined);
    }
  };

  const delayedOnChange = debounce(onChange, 200);

  const setItem = (dir: "up" | "down") => {
    if (dir === "down") {
      setActiveItem((p) => {
        if (p === undefined || p >= suggestions.length - 1) {
          return 0;
        }
        return p + 1;
      });
    } else {
      setActiveItem((p) => {
        if (p === undefined || p === 0) {
          return suggestions.length - 1;
        }
        return p - 1;
      });
    }
  };

  const handleKeyBoardNavigation = (e: React.KeyboardEvent) => {
    const isArrowUp = e.key === "ArrowUp";
    const isArrowDown = e.key === "ArrowDown";
    const isEscape = e.key === "Escape";
    switch (true) {
      case isEscape && !open:
        setInputRefValue("");
        setOpen(false);
        setActiveItem(undefined);
        break;
      case isEscape && open:
        e.preventDefault();
        setOpen(false);
        setActiveItem(undefined);
        break;
      case isArrowDown && hasSuggestions && !open:
        setOpen(true);
        break;
      case isArrowDown && hasSuggestions && open:
        e.preventDefault();
        setItem("down");
        break;
      case isArrowUp && hasSuggestions && !open:
        setOpen(true);
        break;
      case isArrowUp && hasSuggestions && open:
        e.preventDefault();
        setItem("up");
        break;
      default:
        break;
    }
  };

  const handleSelection = (suggestion: T) => {
    if (onItemSelect) {
      const text = onItemSelect(suggestion);
      if (text && inputRef.current) {
        setInputRefValue(text);
        inputRef.current.focus();
      }
      setOpen(false);
    }
  };

  const handleSelectionOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && open && hasActiveItem) {
      e.preventDefault();
      handleSelection(suggestions[activeItem]);
    }
  };

  const handleSelectionOnClick = (suggestion: T) => {
    handleSelection(suggestion);
  };

  return (
    <div
      ref={ref}
      className="gd-autocomplete"
      onKeyDown={handleKeyBoardNavigation}
    >
      <label htmlFor={GlobalIds.searchField} className="offscreen">
        {label}
      </label>
      <input
        ref={inputRef}
        autoComplete="off"
        type="search"
        id={GlobalIds.searchField}
        className="dropdown input-search"
        name={inputName}
        placeholder={placeholder}
        title={label}
        aria-autocomplete="list"
        defaultValue={defaultValue}
        aria-controls="autocomplete-suggestion-container"
        aria-activedescendant={
          hasActiveItem ? `autocomplete-suggestion-${activeItem}` : undefined
        }
        onChange={delayedOnChange}
        onKeyDown={handleSelectionOnEnter}
      />
      <span className="offscreen" aria-live="polite" role="status">
        {hasSuggestions &&
          i18n.t("autocomplete.hint", { count: suggestions.length })}
      </span>
      <div
        className={`yui3-widget yui3-aclist yui3-widget-positioned ${openWithSuggestions ? "" : "d-none"}`}
        id="autocomplete-suggestion-container"
        aria-hidden={openWithSuggestions ? "false" : "true"}
      >
        <div className="yui3-aclist-content">
          <ul ref={listRef} className="yui3-aclist-list" role="listbox">
            {suggestions?.map((suggestion, index) => {
              const isActive = open && index === activeItem;
              const listProps = {
                index,
                isActive,
                onClick: () => handleSelectionOnClick(suggestion),
              };
              const inputValue = inputRef.current?.value;
              return children(suggestion, listProps, inputValue);
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
