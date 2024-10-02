"use client";

import { i18n } from "@/i18n";
import {
  Autocomplete,
  AutocompleteHighlightedSuggestion,
  AutocompleteListItem,
} from "@/app/_components/Autocomplete";
import { useSearchParams } from "next/navigation";
import { SPECIAL_FILTERS, URLHelper } from "@/app/_lib/URLHelper";

type SearchField = {
  keepFiltersForSearch?: boolean;
};

export function SearchField({ keepFiltersForSearch = false }: SearchField) {
  const searchParams = useSearchParams();
  const { getActiveFiltersForHiddenInput } = URLHelper(searchParams);

  const fetchData = (input: string) => {
    const url = "/api/search-suggest?q=" + input;
    return fetch(url)
      .then((r) => r.json())
      .then((r) => r as string[]);
  };

  const hiddenInputs = keepFiltersForSearch
    ? getActiveFiltersForHiddenInput(SPECIAL_FILTERS.QUERY).map((input) => (
        <input {...input} key={input.key} />
      ))
    : null;

  return (
    <div className="gd-search-q">
      <Autocomplete
        label={i18n.t("search.input.title")}
        placeholder={i18n.t("search.input.placeholder")}
        fetchData={fetchData}
        inputName={"q"}
        defaultValue={searchParams?.get("q") || undefined}
        onItemSelect={(item) => item}
      >
        {(suggestion, requiredListProps, inputValue) => (
          <AutocompleteListItem key={suggestion} {...requiredListProps}>
            <AutocompleteHighlightedSuggestion
              suggestion={suggestion}
              inputValue={inputValue}
            />
          </AutocompleteListItem>
        )}
      </Autocomplete>
      {hiddenInputs}
    </div>
  );
}
