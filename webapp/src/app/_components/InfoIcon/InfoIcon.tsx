"use client";

import { PropsWithChildren, useState } from "react";
import Image from "next/image";

type InfoIcon = {
  title: string;
};

export function InfoIcon({ title, children }: PropsWithChildren<InfoIcon>) {
  const [isInfoVisible, setInfoVisible] = useState(false);

  const toggleInfoMessage = () => {
    setInfoVisible(!isInfoVisible);
  };

  return (
    <>
      <button
        aria-controls="description-ext"
        aria-expanded={isInfoVisible}
        className="gd-info-icon-toggle"
        title={title}
        onClick={toggleInfoMessage}
      >
        <Image
          width={20}
          height={20}
          alt={""}
          src={"/images/info.svg"}
          className="lexicon-icon lexicon-icon-info-panel-closed"
        />
      </button>
      <div className="gd-info-icon">
        <div
          aria-hidden={!isInfoVisible}
          className="gd-info-icon-description"
          id="description-ext"
        >
          {children}
        </div>
      </div>
    </>
  );
}
