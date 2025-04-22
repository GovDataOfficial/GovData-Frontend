import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useResourcePreview } from "@/app/suche/_components/ResourceTable/ResourcePreview/useResourcePreview";

describe("useResourcePreview", () => {
  it("should initialize previewRef with null", () => {
    const { result } = renderHook(() => useResourcePreview());
    expect(result.current.previewRef.current).toBeNull();
  });

  it("should scroll to and focus the resource preview", () => {
    const { result } = renderHook(() => useResourcePreview());
    const div = document.createElement("div");
    document.body.appendChild(div);

    div.scrollIntoView = vi.fn();
    div.focus = vi.fn();

    result.current.previewRef.current = div;

    act(() => {
      result.current.scrollToResourcePreview();
    });

    expect(div.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "center",
    });
    expect(div.focus).toHaveBeenCalled();
  });
});
