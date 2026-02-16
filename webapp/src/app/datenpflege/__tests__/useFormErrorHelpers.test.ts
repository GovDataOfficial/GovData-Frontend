import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePathname, useSearchParams } from "next/navigation";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";

import {
  formatTimestampForUser,
  useLoginRedirect,
} from "../_lib/useFormErrorHelpers";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe("formatTimestampForUser", () => {
  it("should format ISO timestamp correctly", () => {
    const isoTimestamp = "2026-01-27T14:30:45.123Z";
    const result = formatTimestampForUser(isoTimestamp);
    expect(result).toBe("27.01.2026 um 14:30:45 Uhr (UTC)");
  });

  it("should pad single digit days and months with zero", () => {
    const isoTimestamp = "2026-03-05T08:05:03.000Z";
    const result = formatTimestampForUser(isoTimestamp);
    expect(result).toBe("05.03.2026 um 08:05:03 Uhr (UTC)");
  });

  it("should handle midnight correctly", () => {
    const isoTimestamp = "2026-12-31T00:00:00.000Z";
    const result = formatTimestampForUser(isoTimestamp);
    expect(result).toBe("31.12.2026 um 00:00:00 Uhr (UTC)");
  });

  it("should handle end of day correctly", () => {
    const isoTimestamp = "2026-01-15T23:59:59.999Z";
    const result = formatTimestampForUser(isoTimestamp);
    expect(result).toBe("15.01.2026 um 23:59:59 Uhr (UTC)");
  });
});

describe("useLoginRedirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return login URL with pathname only when no search params", () => {
    vi.mocked(usePathname).mockReturnValue(PAGES_AUTH.manage_metadata_form_add);
    vi.mocked(useSearchParams).mockReturnValue({
      toString: () => "",
    } as any);

    const { result } = renderHook(() => useLoginRedirect());

    expect(result.current.currentPath).toBe(
      PAGES_AUTH.manage_metadata_form_add,
    );
    expect(result.current.loginUrl).toBe(
      `${API_ENDPOINTS.AUTH.LOGIN}?redirectTo=${encodeURIComponent(PAGES_AUTH.manage_metadata_form_add)}`,
    );
  });

  it("should return login URL with pathname and search params", () => {
    vi.mocked(usePathname).mockReturnValue(
      PAGES_AUTH.manage_showcases_form_edit,
    );
    vi.mocked(useSearchParams).mockReturnValue({
      toString: () => "id=123&status=draft",
    } as any);

    const { result } = renderHook(() => useLoginRedirect());

    expect(result.current.currentPath).toBe(
      `${PAGES_AUTH.manage_showcases_form_edit}?id=123&status=draft`,
    );
    expect(result.current.loginUrl).toBe(
      `${API_ENDPOINTS.AUTH.LOGIN}?redirectTo=${encodeURIComponent(`${PAGES_AUTH.manage_showcases_form_edit}?id=123&status=draft`)}`,
    );
  });

  it("should handle root path", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    vi.mocked(useSearchParams).mockReturnValue({
      toString: () => "",
    } as any);

    const { result } = renderHook(() => useLoginRedirect());

    expect(result.current.currentPath).toBe("/");
    expect(result.current.loginUrl).toBe(
      `${API_ENDPOINTS.AUTH.LOGIN}?redirectTo=${encodeURIComponent("/")}`,
    );
  });

  it("should properly encode special characters in path", () => {
    vi.mocked(usePathname).mockReturnValue(PAGES_AUTH.manage_metadata);
    vi.mocked(useSearchParams).mockReturnValue({
      toString: () => "query=test%20data&filter=a%26b",
    } as any);

    const { result } = renderHook(() => useLoginRedirect());

    expect(result.current.currentPath).toBe(
      `${PAGES_AUTH.manage_metadata}?query=test%20data&filter=a%26b`,
    );
    expect(result.current.loginUrl).toContain(encodeURIComponent("?"));
    expect(result.current.loginUrl).toContain(encodeURIComponent("&"));
  });

  it("should handle empty search params toString", () => {
    vi.mocked(usePathname).mockReturnValue(PAGES_AUTH.manage_metadata_form_add);
    vi.mocked(useSearchParams).mockReturnValue({
      toString: () => "",
    } as any);

    const { result } = renderHook(() => useLoginRedirect());

    expect(result.current.currentPath).not.toContain("?");
    expect(result.current.currentPath).toBe(
      PAGES_AUTH.manage_metadata_form_add,
    );
  });
});
