import { useEffect, useRef } from "react";
import tippy, { Instance, Placement } from "tippy.js";

import "tippy.js/dist/tippy.css";

declare global {
  interface HTMLElement {
    _tippy?: Instance;
  }
}

/**
 * Hook to add a styled tooltip to an element based on the title attribute.
 */
export function useTooltip<T extends HTMLElement>(
  placement: Placement = "bottom",
  delay: number = 0,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current && ref.current.hasAttribute("title")) {
      const current = ref.current;
      const instance = tippy(current, {
        arrow: true,
        theme: "gd-theme",
        placement,
        hideOnClick: false,
        content: () => {
          const title = current.title;
          current.removeAttribute("title");
          return title as string;
        },
        delay,
      });
      return () => {
        current.setAttribute("title", instance.props.content as string);
        instance.destroy();
      };
    }
  }, [placement, delay]);

  useEffect(() => {
    const tippyInstance = ref.current?._tippy;
    const tippyContent = tippyInstance && tippyInstance.props.content;
    const title = ref.current?.title;

    if (tippyContent && tippyContent !== "" && title && title !== "") {
      tippyInstance.setContent(ref.current.title);
      ref.current.removeAttribute("title");
    }
  });

  return ref;
}
