import type { SearchResultHit as SearchResultHitType } from "@/types/types";
import { MetaInfoHeadline } from "@/app/suche/_components/common/MetaInfoHeadlineIcon";
import { Truncate } from "@/app/_components/Truncate/Truncate";
import Image from "next/image";
import { SearchResultHitDetailInfo } from "./SearchResultHitDetailInfo";
import { isNotNullOrUndefined } from "@/types/typeGuards";
import { PAGES } from "@/app/_lib/URLHelper";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { icons } from "@/app/_components/SVG/SVG";

const createHitLink = (hit: SearchResultHitType) => {
  switch (hit.type) {
    case "showcase":
      return `${PAGES.search_details_showcase}/${hit.name}`;
    case "dataset":
      return `${PAGES.search_details_dataset}/${hit.name}`;
    case "article":
    case "information":
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

function getDisplayImage(hit: SearchResultHitType) {
  if (isNotNullOrUndefined(hit.displayImage)) {
    return hit.displayImage;
  }

  if (hit.type === "showcase") {
    switch (hit.primaryShowcaseType) {
      case "concept":
        return icons.mediatype_concept_blue;
      case "website":
        return icons.mediatype_website_blue;
      case "tool":
        return icons.mediatype_tool_blue;
      case "publication":
        return icons.mediatype_publication_blue;
      case "mobile_app":
        return icons.mediatype_mobile_app_blue;
      case "other":
        return icons.mediatype_other_blue;
      case "visualization":
        return icons.mediatype_visualization_blue;
      default:
        return "";
    }
  }
  return null;
}

export function SearchResultHit({ hit }: { hit: SearchResultHitType }) {
  const hitLink = createHitLink(hit);

  const displayImage = getDisplayImage(hit);

  return (
    <li
      id={"search-result-hit-" + hit.id}
      className={`search-result-hit mb-2_5 ${hit.hasHvd ? " hvd" : ""}`}
    >
      <DesignBox extraClasses={["d-flex"]}>
        {displayImage && (
          <div className="resultentry-display-image me-5">
            <Image alt="" width={200} height={200} src={displayImage} />
          </div>
        )}
        <div>
          <MetaInfoHeadline type={hit.primaryShowcaseType || hit.type} />
          <h3 className="mb-1 mt-0 text-break">
            <a title={hit.title} href={hitLink}>
              {hit.title}
            </a>
          </h3>
          <p className="mb-3 text-break">
            <Truncate text={hit.content} maxLength={300} />
          </p>
          <SearchResultHitDetailInfo
            hasHvd={hit.hasHvd}
            resources={hit.resources}
            contact={hit.contact}
          />
        </div>
      </DesignBox>
    </li>
  );
}
