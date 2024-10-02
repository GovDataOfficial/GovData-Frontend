"use client";
import { PropsWithChildren } from "react";
import { createLinkToSearchForState } from "@/app/_lib/URLHelper";
import { findStateById } from "@/app/_lib/stateList";

export function StateAnchor({
  stateId,
  children,
}: PropsWithChildren<{ stateId: string }>) {
  const getStateLink = () => document.getElementById("state-link-" + stateId);

  const setHighlight = () => {
    getStateLink()?.setAttribute("data-active", "true");
  };

  const removeHighlight = () => {
    getStateLink()?.removeAttribute("data-active");
  };

  return (
    <a
      tabIndex={-1}
      href={createLinkToSearchForState(stateId)}
      title={findStateById(stateId)?.name}
      onMouseEnter={setHighlight}
      onMouseLeave={removeHighlight}
    >
      {children}
    </a>
  );
}
