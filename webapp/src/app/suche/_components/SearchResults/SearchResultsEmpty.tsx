"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { SPECIAL_FILTERS, URLHelper } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";
import { SearchResultSuggestion } from "@/types/types";

type SearchResultsEmpty = {
  suggestions?: SearchResultSuggestion[];
};
export function SearchResultsEmpty({ suggestions = [] }: SearchResultsEmpty) {
  const { t } = i18n;
  const searchParams = useSearchParams();
  const { createLinkToSearchWithSuggestion } = URLHelper(searchParams);
  const hasSuggestions = suggestions.length > 0;

  return (
    <div className="large-8">
      {hasSuggestions && (
        <div className="mb-3">
          <span className="fnt-h3">{t("search.empty.suggestion")}</span>
          <div>
            <ul className="gd-list gd-list-inline">
              {suggestions.map((suggestion) => (
                <li key={suggestion.name}>
                  <a
                    className="d-inline"
                    href={createLinkToSearchWithSuggestion(suggestion.name)}
                  >
                    {suggestion.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <p>{t("search.empty.explanation")}</p>
      <ul>
        <li>
          <strong>Suchbegriff</strong> überprüfen oder verändern
        </li>
        <li>
          einzelne gesetzte <strong>Filter entfernen</strong>
        </li>
        <li>
          alle <strong>Filter zurücksetzen</strong>
        </li>
      </ul>
    </div>
  );
}
