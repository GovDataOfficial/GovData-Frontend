"use client";

import { i18n } from "@/i18n";
import { useState } from "react";
import { Button } from "@/app/_components/Button/Button";
import { SearchDetailsInfoBoxGroup } from "@/app/suche/_components/SearchDetailsInfobox/partials/SearchDetailsInfoBoxGroup";

type TermCategories = {
  tags: string[];
};

/**
 * DefinitionList of Tags.
 * Its own DL construct as it needs a button to open more.
 */
export function DLTags({ tags }: TermCategories) {
  const { t } = i18n;
  const [more, showMore] = useState(false);

  if (tags?.length === 0) {
    return null;
  }

  const initialTags = tags.slice(0, 10);
  const showMoreTags = tags.slice(10);

  const hasInitialTags = initialTags.length > 0;
  const hasShowMoreTags = showMoreTags.length > 0;

  return (
    <div className="mt-3">
      <SearchDetailsInfoBoxGroup inline>
        <dl>
          <dt>{t("search.details.infobox.tags")}</dt>
          {hasInitialTags && initialTags.map((t) => <dd key={t}>{t}</dd>)}
          {more && showMoreTags.map((t) => <dd key={t}>{t}</dd>)}
        </dl>
      </SearchDetailsInfoBoxGroup>
      {hasShowMoreTags && (
        <Button
          variant="a"
          onClick={() => {
            showMore(!more);
          }}
        >
          {more
            ? t("search.details.infobox.tags.show.less")
            : t("search.details.infobox.tags.show.more")}
        </Button>
      )}
    </div>
  );
}
