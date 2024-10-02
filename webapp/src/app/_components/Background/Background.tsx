import { PropsWithChildren } from "react";

import connectionmap from "./images/connectionmap.jpg";
import connectionmap_mini_blog from "./images/connectionmap_mini_blog.jpg";
import connectionmap_mini_data from "./images/connectionmap_mini_data.jpg";
import connectionmap_mini_devcorner from "./images/connectionmap_mini_devcorner.jpg";
import connectionmap_mini_document from "./images/connectionmap_mini_document.jpg";
import connectionmap_mini_info from "./images/connectionmap_mini_info.jpg";
import connectionmap_mini_metadataquality from "./images/connectionmap_mini_metadataquality.jpg";
import connectionmap_mini_showroom from "./images/connectionmap_mini_showroom.jpg";

type BackgroundImage =
  | "blog"
  | "data"
  | "devcorner"
  | "document"
  | "info"
  | "metadataquality"
  | "showroom"
  | "default";

export type Background = {
  backgroundImage?: BackgroundImage;
};

const getBackgroundImage = (image: BackgroundImage) => {
  switch (image) {
    case "blog":
      return connectionmap_mini_blog;
    case "data":
      return connectionmap_mini_data;
    case "devcorner":
      return connectionmap_mini_devcorner;
    case "document":
      return connectionmap_mini_document;
    case "info":
      return connectionmap_mini_info;
    case "metadataquality":
      return connectionmap_mini_metadataquality;
    case "showroom":
      return connectionmap_mini_showroom;
    case "default":
    default:
      return connectionmap;
  }
};

export function Background({
  children,
  backgroundImage = "default",
}: PropsWithChildren<Background>) {
  const image = getBackgroundImage(backgroundImage);

  return (
    <div className="gd-search-container">
      <div
        className={`gd-search`}
        style={{
          backgroundImage: `url(${image.src})`,
        }}
      >
        {children ? children : <div className="searchFormPlaceholder" />}
      </div>
    </div>
  );
}
