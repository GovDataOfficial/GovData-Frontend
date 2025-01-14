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
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current && ref.current.hasAttribute("title")) {
      const instance = tippy(ref.current, {
        arrow: true,
        theme: "gd-theme",
        placement,
        hideOnClick: false,
        content: ref.current.title,
        onShow: () => {
          ref.current?.removeAttribute("title");
        },
        onHide: () => {
          ref.current?.setAttribute("title", instance.props.content as string);
        },
        onBeforeUpdate(instance) {
          if (instance.state.isVisible) {
            ref.current?.removeAttribute("title");
          }
        },
      });

      return () => {
        instance.destroy();
      };
    }
  }, [placement]);

  useEffect(() => {
    const tippyInstance = ref.current?._tippy;
    if (tippyInstance && tippyInstance.props.content !== ref.current.title) {
      tippyInstance.setContent(ref.current.title);
    }
  });

  return ref;
}
