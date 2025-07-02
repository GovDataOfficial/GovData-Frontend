import { useMemo } from "react";
import Image from "next/image";

import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { processBase64ImageString } from "@/app/_lib/processBase64ImageString";
import {
  ALLOWLIST_METADATA_NOTES,
  sanitizeHTML,
} from "@/app/_lib/sanitizer/sanitizeHtml";
import { MetaInfoHeadlineIcon } from "@/app/suche/_components/common/MetaInfoHeadlineIcon";
import { HitType, Metadata, ShowcaseData } from "@/types/types";

const IMAGE_SIZE = 200;
const DEFAULT_IMAGE = "/images/showcase-default.png";

type SearchDetailsMetaInfo = {
  data: Metadata | ShowcaseData;
};

export function SearchDetailsMetaInfo({ data }: SearchDetailsMetaInfo) {
  const sanitizedNotes = sanitizeHTML(data.notes, ALLOWLIST_METADATA_NOTES);
  const type = "type" in data ? HitType.dataset : HitType.showcase;

  const sortedImages = useMemo(() => {
    if (!("images" in data) || !data.images?.length) {
      return [{ imageOrderId: 1, image: DEFAULT_IMAGE }];
    }

    return [...data.images]
      .sort((a, b) => a.imageOrderId - b.imageOrderId)
      .map((image) => ({
        ...image,
        image: processBase64ImageString(image.image),
      }));
  }, [data]);

  return (
    <DesignBox extraClasses={["mb-3"]}>
      <MetaInfoHeadlineIcon type={type} />
      <h1 className="my-1">{data.title}</h1>

      {type === HitType.showcase && (
        <div className="search-details-showcase-images-box">
          {sortedImages.map((image) => (
            <div
              key={image.imageOrderId}
              className="search-details-showcase-image"
            >
              <Image
                src={image.image}
                alt=""
                fill
                sizes={`(max-width: ${IMAGE_SIZE}px, min-width: ${IMAGE_SIZE}px)`}
              />
            </div>
          ))}
        </div>
      )}
      {sanitizedNotes && (
        <div
          className="paragraph"
          dangerouslySetInnerHTML={{ __html: sanitizedNotes }}
        />
      )}
    </DesignBox>
  );
}
