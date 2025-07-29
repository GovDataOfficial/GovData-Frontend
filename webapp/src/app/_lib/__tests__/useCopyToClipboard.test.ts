// Import necessary components from testing library
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useCopyToClipboard } from "@/app/_lib/hooks/useCopyToClipboard";

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("checks if text is set correctly and resets after copying", async () => {
    const copyToClipboardText = "Link in Zwischenablage kopieren";
    const { result, rerender } = renderHook(() =>
      useCopyToClipboard(copyToClipboardText),
    );
    // mocks clipboard API
    userEvent.setup();

    expect(result.current.text).toEqual(copyToClipboardText);

    await act(() => {
      result.current.copyToClipboard("https://www.example.com");
    });

    expect(result.current.text).toEqual("Kopiert");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
      rerender();
    });

    expect(result.current.text).toEqual(copyToClipboardText);
  });
});
