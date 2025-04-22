import { useCallback, useRef } from "react";

export function useResourcePreview() {
  const previewRef = useRef<HTMLDivElement | null>(null);

  const scrollToResourcePreview = useCallback(() => {
    if (previewRef.current) {
      previewRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      previewRef.current.focus();
    }
  }, []);
  return { previewRef, scrollToResourcePreview };
}
