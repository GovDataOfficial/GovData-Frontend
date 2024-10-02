"use client";

import React, { useEffect, useState } from "react";
import {
  LoadMoreResults,
  SearchResultHit as SearchResultHitType,
  SearchResults,
} from "@/types/types";
import { i18n } from "@/i18n";
import { Button } from "@/app/_components/Button/Button";
import {
  SearchResultHit,
  focusSearchResultHit,
} from "../SearchResultHit/SearchResultHit";
import { AlertBadge } from "@/app/_components/AlertBadge/AlertBadge";

type SearchResultsContainer = {
  data: SearchResults;
};

export function SearchResultsContainer({ data }: SearchResultsContainer) {
  const [hits, setHits] = useState<SearchResultHitType[]>(data.hits);

  const [fetchState, setFetchState] = useState<"ready" | "loading" | "error">();
  const [hitToFocus, setFocusTo] = useState<SearchResultHitType["id"]>();
  // scroll endpoint does not provide correct information for this, so we compare these two.
  const moreNextHitsAvailable = hits.length < data.hitsTotal;
  const remainingHits = data.hitsTotal - hits.length;
  const loadMoreAmount =
    remainingHits > data.pageSize ? data.pageSize : remainingHits;

  // focus the first new li item added to the list
  useEffect(() => {
    hitToFocus && focusSearchResultHit(hitToFocus);
  }, [hitToFocus]);

  const fetchNextHits = (scrollId: string) => {
    setFetchState("loading");
    fetch("/api/scroll?scrollId=" + scrollId)
      .then((res) => res.json())
      .then((r) => {
        const result = r as LoadMoreResults;
        setHits((p) => [...p, ...result.hits]);
        setFocusTo(result.hits[0].id);
        setFetchState("ready");
      })
      .catch(() => setFetchState("error"));
  };

  return (
    <>
      <h2 className="sr-only">{i18n.t("search.hits.list")}</h2>
      <ul className="p-0">
        {hits.map((hit) => (
          <SearchResultHit key={hit.id} hit={hit} />
        ))}
      </ul>
      {moreNextHitsAvailable && (
        <div className="search-results-more">
          <Button
            variant="secondary"
            onClick={() => fetchNextHits(data.scrollId)}
          >
            {i18n.t("search.more.button", { loadMoreAmount })}
          </Button>
        </div>
      )}
      {fetchState === "error" && (
        <AlertBadge>{i18n.t("error.alert.commonReload")}</AlertBadge>
      )}
      <span className="offscreen" aria-live="polite" role="status">
        {fetchState === "loading" ? i18n.t("search.more.isLoading") : ""}
      </span>
    </>
  );
}
