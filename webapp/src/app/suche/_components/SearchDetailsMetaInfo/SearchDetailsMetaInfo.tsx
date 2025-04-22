import Image from "next/image";

import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import {
  ALLOWLIST_METADATA_NOTES,
  sanitizeHTML,
} from "@/app/_lib/sanitizer/sanitizeHtml";
import { MetaInfoHeadlineIcon } from "@/app/suche/_components/common/MetaInfoHeadlineIcon";
import { HitType, Metadata, ShowcaseData } from "@/types/types";

type SearchDetailsMetaInfo = {
  data: Metadata | ShowcaseData;
};

export function SearchDetailsMetaInfo({ data }: SearchDetailsMetaInfo) {
  const sanitizedNotes = sanitizeHTML(data.notes, ALLOWLIST_METADATA_NOTES);
  const type = "type" in data ? HitType.dataset : HitType.showcase;
  const hasImages = "images" in data && data.images.length > 0;

  return (
    <DesignBox extraClasses={["mb-3"]}>
      <MetaInfoHeadlineIcon type={type} />
      <h1 className="my-1">{data.title}</h1>
      {hasImages && (
        <div className="search-details-showcase-images-box">
          {data.images.map((image) => (
            <div key={image.id} className="search-details-showcase-image">
              <Image src={"data:image/png;base64," + image.image} alt="" fill />
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
