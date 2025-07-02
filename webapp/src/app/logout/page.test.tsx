import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { hasSessionCookie } from "@/app/api/auth/_session";

import Page, { metadata } from "./page";

vi.mock("ioredis");
vi.mock("@/app/api/auth/_session");
vi.mock("next/navigation");

describe("Logout Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("should have correct meta info", () => {
    expect(metadata.title).toBe("Erfolgreich abgemeldet - GovData");
  });

  test("should redirect to logout api if user has a session", async () => {
    vi.mocked(hasSessionCookie).mockReturnValue(true);
    render(await Page());

    expect(vi.mocked(redirect)).toHaveBeenCalledWith("/api/auth/logout");
  });

  test("should show successfull logout info if user has no session", async () => {
    vi.mocked(hasSessionCookie).mockReturnValue(false);
    render(await Page());

    expect(vi.mocked(redirect)).not.toHaveBeenCalled();

    screen.getByRole("heading", { name: /erfolgreich abgemeldet/i, level: 1 });
    screen.getByText(/hier geht es/i);
    screen.getByRole("link", { name: /zur startseite von govdata\./i });

    const loginAgainLink = screen.getByRole("link", {
      name: /erneut anmelden/i,
    });
    expect(loginAgainLink).toHaveAttribute("href", PAGES_AUTH.manage_metadata);
  });
});
