import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useShowcaseFormStickyNavigation } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/stickyNav/useShowcaseFormStickyNavigation";

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
}));

describe("useShowcaseFormStickyNavigation", () => {
  beforeAll(() => {
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("should update active section based on visibility", async () => {
    const { result } = renderHook(() => useShowcaseFormStickyNavigation());

    const observerInstance = vi.mocked(global.IntersectionObserver) as any;

    // Initially, no section is active
    expect(result.current.isActive("part1")).toBe(false);
    expect(result.current.isActive("part2")).toBe(false);
    expect(result.current.isActive("part3")).toBe(false);

    // Simulate intersecting with Section Part 1 using the observer instance
    await act(() => {
      observerInstance.mock.calls[0][0]([
        { isIntersecting: true, target: { id: "part1" } },
      ]);
    });

    // Assert Part 1 is active
    expect(result.current.isActive("part1")).toBe(true);
    expect(result.current.isActive("part2")).toBe(false);
    expect(result.current.isActive("part3")).toBe(false);

    // Simulate intersecting with Section Part 2
    await act(() => {
      observerInstance.mock.calls[0][0]([
        { isIntersecting: true, target: { id: "part2" } },
      ]);
    });

    // Assert Part 2 is active
    expect(result.current.isActive("part1")).toBe(false);
    expect(result.current.isActive("part2")).toBe(true);
    expect(result.current.isActive("part3")).toBe(false);
  });
});
