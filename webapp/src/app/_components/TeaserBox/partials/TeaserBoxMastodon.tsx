import { TeaserBox } from "@/app/_components/TeaserBox/partials/TeaserBox";
import { SVG, icons } from "@/app/_components/SVG/SVG";
import React from "react";
import { PostDto } from "@/types/types";
import { Time } from "@/app/_components/Time/Time";
import { i18n } from "@/i18n";

export function TeaserBoxMastodon({ data }: { data: PostDto }) {
  return (
    <TeaserBox theme="bright" target="_blank" href={data.url}>
      <div className="d-flex">
        <SVG size="32" icon={icons.mastodon} />
        <div className="ms-0_5">
          <div className="d-flex">
            <p className="paragraph-extra-small bold">{data.name}</p>
            <p className="paragraph-extra-small ms-1">
              <Time
                date={data.timestamp}
                format={{ day: "numeric", month: "short", year: "numeric" }}
              />
            </p>
          </div>
          <p className="paragraph-extra-small">
            {data.isRetweet
              ? i18n.t("home.teaserbox.mastodon.shared")
              : `@${data.username}`}
          </p>
        </div>
      </div>
      <p className="crop paragraph-extra-small mt-0_5">{data.text}</p>
    </TeaserBox>
  );
}
