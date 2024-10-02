"use client";

import { stateListMap } from "@/app/_lib/stateList";
import { createLinkToSearchForState } from "@/app/_lib/URLHelper";

export function RegionSearchBox() {
  const getPathElement = (id: string) => {
    return id === "00"
      ? document.querySelectorAll("path")
      : document.querySelectorAll("#svg-germany-" + id);
  };

  const setHighlight = (id: string) => {
    const element = getPathElement(id);
    element.forEach((el) => el.setAttribute("data-active", "true"));
  };

  const removeHighlight = (id: string) => {
    const element = getPathElement(id);
    element.forEach((el) => el.removeAttribute("data-active"));
  };

  return (
    <div className="region-search-box">
      <ul>
        {stateListMap.map((state, index) => (
          <li key={state.id}>
            <a
              id={"state-link-" + state.id}
              href={createLinkToSearchForState(state.id)}
              onFocus={() => setHighlight(state.id)}
              onMouseEnter={() => setHighlight(state.id)}
              onBlur={() => removeHighlight(state.id)}
              onMouseLeave={() => removeHighlight(state.id)}
            >
              {state.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
