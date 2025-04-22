"use client";

import { useRef, useState } from "react";

import { ContainerDiv } from "@/app/_components/Container";
import { SPECIAL_FILTERS, URLHelper } from "@/app/_lib/URLHelper";
import { LocationSearchAutocomplete } from "@/app/kartensuche/_components/LocationSearchAutocomplete";
import { LocationSearchMap } from "@/app/kartensuche/_components/LocationSearchMap";
import { i18n } from "@/i18n";
import { MappedSuggest, NextJSSearchParams } from "@/types/types";

export type LocationSearch = {
  isOSMActive: boolean;
  searchParams: NextJSSearchParams;
  tileUrl: string;
  sessionId?: string;
};

export default function LocationSearch({
  isOSMActive,
  searchParams,
  tileUrl,
  sessionId,
}: LocationSearch) {
  const [selectedMappedSuggest, setSelectedMappedSuggest] =
    useState<MappedSuggest>();
  const boundingboxInputRef = useRef<HTMLInputElement>(null);

  const {
    getActiveFiltersForHiddenInput,
    getBoundingBoxValueFromCurrentParams,
  } = URLHelper(searchParams);

  const boundingbox = getBoundingBoxValueFromCurrentParams();

  const hiddenInputs = getActiveFiltersForHiddenInput(
    SPECIAL_FILTERS.BOUNDING_BOX,
  ).map((input) => <input {...input} key={input.key} />);

  const onSearchItemSelected = (suggestion: MappedSuggest) => {
    setSelectedMappedSuggest(suggestion);
  };

  const onBoundingBoxChanged = (boundingBox: string) => {
    if (boundingboxInputRef.current) {
      boundingboxInputRef.current.value = boundingBox;
    }
  };

  return (
    <form action="/suche" method="get">
      {hiddenInputs}
      <input
        ref={boundingboxInputRef}
        type="hidden"
        name="boundingbox"
        id="boundingbox"
        defaultValue={boundingbox}
      />
      <LocationSearchMap
        isOSMActive={isOSMActive}
        tileUrl={tileUrl}
        boundingBox={boundingbox}
        mappedSuggest={selectedMappedSuggest}
        onBoundingBoxChanged={onBoundingBoxChanged}
      />
      <ContainerDiv containerWidth="lg">
        <div className="row searchmap-input-row align-items-center ">
          <div className="d-block mb-1 col-sm-6 mb-sm-0">
            <LocationSearchAutocomplete
              sessionId={sessionId}
              onSearchItemSelected={onSearchItemSelected}
            />
          </div>
          <div className="d-block col-sm-6 text-right">
            <button type="submit" className="button-search">
              {i18n.t("searchmap.form.send")}
            </button>
          </div>
        </div>
      </ContainerDiv>
    </form>
  );
}
