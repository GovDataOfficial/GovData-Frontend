import Image from "next/image";

import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { Time } from "@/app/_components/Time/Time";
import { Trans } from "@/app/_components/Trans/Trans";
import { Truncate } from "@/app/_components/Truncate/Truncate";
import { PAGES } from "@/app/_lib/URLHelper";
import { MetaInfoHeadline } from "@/app/suche/_components/common/MetaInfoHeadlineIcon";
import { isNotNullOrUndefined } from "@/types/typeGuards";
import {
  HitType,
  type UnknownSearchResultHit as SearchResultHitType,
} from "@/types/types";

import { SearchResultHitDetailInfo } from "./SearchResultHitDetailInfo";

const createHitLink = (hit: SearchResultHitType) => {
  switch (hit.type) {
    case HitType.showcase:
      return `${PAGES.search_details_showcase}/${hit.name}`;
    case HitType.dataset:
      return `${PAGES.search_details_dataset}/${hit.name}`;
    case HitType.article:
      return hit.targetLink;
    default:
      return undefined;
  }
};

// focus the first new li item added to the list
export function focusSearchResultHit(id: string) {
  const hitLiId = "#search-result-hit-" + id;
  const item = document.querySelector(hitLiId) as HTMLLIElement;
  if (item) {
    item.setAttribute("tabIndex", "-1");
    item.focus();
    item.scrollIntoView({ behavior: "smooth", block: "center" });
    item.addEventListener(
      "blur",
      () => {
        item.removeAttribute("tabIndex");
      },
      { once: true },
    );
  }
}

function getDisplayImage(
  hit: SearchResultHitType,
  hasDisplayImage: boolean,
  isShowcase: boolean,
) {
  if (hasDisplayImage) {
    return hit.displayImage;
  }

  if (isShowcase) {
    return "/images/showcase-default.png";
  }

  return null;
}

export function SearchResultHit({ hit }: { hit: SearchResultHitType }) {
  const hitLink = createHitLink(hit);
  const hasDisplayImage = isNotNullOrUndefined(hit.displayImage);
  const isShowcase = hit.type === HitType.showcase;
  const displayImage = getDisplayImage(hit, hasDisplayImage, isShowcase);

  return (
    <li
      id={"search-result-hit-" + hit.id}
      className={`search-result-hit mb-2_5 ${hit.hasHvd ? " hvd" : ""}`}
    >
      <DesignBox extraClasses={["d-flex"]}>
        {displayImage && (
          <div className={`resultentry-display-image me-5`}>
            <Image alt="" width={200} height={200} src={displayImage} />
          </div>
        )}
        <div className="d-flex flex-column flex-grow-1">
          <div className="d-flex justify-content-between">
            <MetaInfoHeadline type={hit.type} />
            <span className="paragraph-small">
              <Trans
                className="paragraph-small"
                i18nKey="search.hits.hit.lastModifiedDate"
                params={{
                  date: <Time date={hit.lastModified} />,
                }}
              />
            </span>
          </div>
          <h3 className="mb-1 mt-0 text-break">
            <a title={hit.title} href={hitLink}>
              {hit.title}
            </a>
          </h3>
          <p className="mb-3 text-break">
            <Truncate text={hit.content} maxLength={300} />
          </p>
          <SearchResultHitDetailInfo
            hasHvd={!!hit.hasHvd}
            resources={hit.resources}
            contact={hit.contact}
            allShowcaseTypes={hit.allShowcaseTypes}
          />
        </div>
      </DesignBox>
    </li>
  );
}
