import { PortalNumbers, PostDto } from "@/types/types";

export const mockMastodonData = {
  text: "Schon gewusst? Die Tourismus Marketing GmbH ruft dazu auf",
  url: "https://mastodon.social/@opendata@social.bund.de",
  name: "GovData",
  username: "opendata",
  timestamp: "2024-07-22T09:10:34",
  type: "boosted",
  isRetweet: true,
  retweet: true,
  id: "123",
} satisfies PostDto;

export const mockDataNumbers = {
  hvdDatasets: 100,
  filterMap: {
    type: {
      facetList: [
        { docCount: 246500, name: "dataset" },
        { docCount: 5, name: "showcase" },
        { docCount: 34, name: "article" },
      ],
    },
  },
} satisfies PortalNumbers;
