import { describe, expect, test, vi } from "vitest";
import { UserHeader } from "@/app/_components/UserHeader/UserHeader";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getUserInformation } from "@/app/api/auth/_session";

vi.mock("ioredis");
vi.mock("@/app/api/auth/_session");

describe("UserHeader", () => {
  test("should render nothing if there is no session", async () => {
    vi.mocked(getUserInformation).mockResolvedValue(null);

    const { container } = render(await UserHeader());

    expect(container).toBeEmptyDOMElement();
  });

  test("should correct markup", async () => {
    vi.mocked(getUserInformation).mockResolvedValue({
      username: "TestName",
    });
    const user = userEvent.setup();

    render(await UserHeader());

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Nutzerkonto");

    const summary = within(nav).getByText("TestName");
    expect(summary).toBeInstanceOf(HTMLSpanElement);

    const linkMeta = screen.queryByRole("link", {
      name: /metadatensätze meiner organisation/i,
    });

    const linkLogout = screen.queryByRole("link", { name: "abmelden" });

    expect(linkMeta).not.toBeVisible();
    expect(linkLogout).not.toBeVisible();

    await user.click(summary);

    expect(linkMeta).toBeVisible();
    expect(linkLogout).toBeVisible();
  });
});
