"use client";

import {
  Autocomplete,
  AutocompleteHighlightedSuggestion,
  AutocompleteListItem,
} from "@/app/_components/Autocomplete";
import { i18n } from "@/i18n";

type LocationSearch = {
  sessionId?: string;
};

export type BaseMapSuggestResponse = {
  type: "FeatureCollection";
  features: {
    id: string;
    bbox: unknown[];
    properties: { text: string; typ: string };
  }[];
};

export type OSMSuggestResponse = {
  boundingbox: unknown[];
  display_name: string;
  osm_id: number;
  osm_type: string;
}[];

function isOSMSuggestResponse(
  res: BaseMapSuggestResponse | OSMSuggestResponse,
): res is OSMSuggestResponse {
  return Array.isArray(res) && "osm_id" in res[0] && "osm_type" in res[0];
}

type MappedSuggest = {
  id: string | number;
  display_name: string;
  boundingbox: any[];
  type?: string;
};

function toMappedSuggest(
  res: BaseMapSuggestResponse | OSMSuggestResponse,
): MappedSuggest[] {
  if (isOSMSuggestResponse(res)) {
    return res.map((osmItem) => ({
      id: osmItem.osm_id,
      display_name: osmItem.display_name,
      boundingbox: osmItem.boundingbox,
    }));
  }
  return res.features.map((basemapItem) => ({
    id: basemapItem.id,
    display_name: basemapItem.properties.text,
    type: basemapItem.properties.typ,
    boundingbox: basemapItem.bbox,
  }));
}

export function LocationSearch({ sessionId }: LocationSearch) {
  const fetchData = (input: string): Promise<MappedSuggest[]> => {
    const url = `/api/geocoding-suggest?sessionId=${sessionId}&q=${input}`;
    return fetch(url)
      .then((r) => r.json())
      .then(toMappedSuggest);
  };

  /**
   * func is given from ol-govdata.js which is loaded via <Script Tag
   * refactor this when updating ol.js
   */
  const zoomToSelectedLocation = (suggestion: MappedSuggest) => {
    // @ts-expect-error
    const funcFromInitMap = window.onAutocompleteListItemSelect;
    if (typeof funcFromInitMap === "function") {
      funcFromInitMap(suggestion);
      return suggestion.display_name;
    }
  };

  return (
    <div className="locationsearch">
      <Autocomplete
        label={i18n.t("searchmap.form.search.placeholder")}
        placeholder={i18n.t("searchmap.form.search.placeholder")}
        fetchData={fetchData}
        onItemSelect={zoomToSelectedLocation}
      >
        {(suggestion, requiredListProps, inputValue) => (
          <AutocompleteListItem key={suggestion.id} {...requiredListProps}>
            <AutocompleteHighlightedSuggestion
              suggestion={suggestion.display_name}
              inputValue={inputValue}
            />
            {suggestion.type && <span> {suggestion.type}</span>}
          </AutocompleteListItem>
        )}
      </Autocomplete>
    </div>
  );
}
