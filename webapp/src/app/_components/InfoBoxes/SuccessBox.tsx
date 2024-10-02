import { i18n } from "@/i18n";
import React, { PropsWithChildren } from "react";

type SuccessBox = {
  title: string;
};
export function SuccessBox({ title, children }: PropsWithChildren<SuccessBox>) {
  return (
    <div className="success-box mb-3">
      <p className="m-0">
        <span className="success-box-message">{title}</span>
      </p>
      <p className="mb-0">{children}</p>
    </div>
  );
}
