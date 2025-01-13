import React from "react";

import { RecommendedInfo } from "@/app/_components/Inputs/partials/RecommendedInfo";

type Label = {
  label: string;
  htmlFor: string;
  required?: boolean;
  recommended?: boolean;
  invisible?: boolean;
};

export function Label({
  label,
  required,
  recommended,
  htmlFor,
  invisible,
}: Label) {
  return (
    <label htmlFor={htmlFor} className={invisible ? "sr-only" : ""}>
      {label}
      {required && <strong aria-hidden="true">&nbsp;*</strong>}
      {recommended && <RecommendedInfo />}
    </label>
  );
}
