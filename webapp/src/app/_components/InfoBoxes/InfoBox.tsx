import React, { PropsWithChildren } from "react";
import { icons, SVG } from "@/app/_components/SVG/SVG";

type InfoBox = {
  title: string;
};

export function InfoBox({ title, children }: PropsWithChildren<InfoBox>) {
  return (
    <div className="info-box">
      <div className="d-flex flex-nowrap">
        <SVG icon={icons.infoBlue} className="me-2 align-self-center" />
        <div>
          <p className="m-0">
            <span className="bold">{title}</span>
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
