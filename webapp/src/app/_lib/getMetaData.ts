import type { Metadata } from "next";

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
    if (description.length >= 160) {
      desc = description.substring(0, 157) + "...";
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
