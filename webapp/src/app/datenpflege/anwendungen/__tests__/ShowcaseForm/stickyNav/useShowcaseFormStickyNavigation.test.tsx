import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useShowcaseFormStickyNavigation } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/stickyNav/useShowcaseFormStickyNavigation";

let mockCallback: IntersectionObserverCallback;

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    mockCallback = callback;
  }
  observe = vi.fn();
  disconnect = vi.fn();
}

describe("useShowcaseFormStickyNavigation", () => {
  beforeAll(() => {
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("should update active section based on visibility", async () => {
    const { result } = renderHook(() => useShowcaseFormStickyNavigation());

    // Initially, no section is active
    expect(result.current.isActive("part1")).toBe(false);
    expect(result.current.isActive("part2")).toBe(false);
    expect(result.current.isActive("part3")).toBe(false);

    // Simulate intersecting with Section Part 1
    await act(() => {
      mockCallback(
        [{ isIntersecting: true, target: { id: "part1" } } as any],
        {} as any,
      );
    });

    // Assert Part 1 is active
    expect(result.current.isActive("part1")).toBe(true);
    expect(result.current.isActive("part2")).toBe(false);
    expect(result.current.isActive("part3")).toBe(false);

    // Simulate intersecting with Section Part 2
    await act(() => {
      mockCallback(
        [{ isIntersecting: true, target: { id: "part2" } } as any],
        {} as any,
      );
    });

    // Assert Part 2 is active
    expect(result.current.isActive("part1")).toBe(false);
    expect(result.current.isActive("part2")).toBe(true);
    expect(result.current.isActive("part3")).toBe(false);
  });
});
