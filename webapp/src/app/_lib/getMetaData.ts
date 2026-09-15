import type { Metadata } from "next";

const MAX_DESCRIPTION_LENGTH = 160;
const TRUNCATED_LENGTH = 157;

/**
 * Cut at the last word boundary so the snippet does not end mid-word - or
 * mid-URL, which happens with descriptions converted from Markdown.
 */
function truncate(description: string): string {
  const cut = description.substring(0, TRUNCATED_LENGTH);
  const lastSpace = cut.lastIndexOf(" ");
  const truncated = lastSpace > 0 ? cut.substring(0, lastSpace) : cut;

  return truncated.trimEnd() + "...";
}

type metaDataGenerator = {
  title: string;
  description?: string;
};
export function metaDataGenerator({
  title,
  description,
}: metaDataGenerator): Metadata {
  let desc = undefined;

  if (description) {
    if (description.length >= MAX_DESCRIPTION_LENGTH) {
      desc = truncate(description);
    } else {
      desc = description;
    }
  }
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
    },
  };
}
