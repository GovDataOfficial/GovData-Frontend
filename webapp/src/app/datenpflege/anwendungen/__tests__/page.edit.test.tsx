import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";

import { fetchShowcase } from "@/app/_lib/getData";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import {
  getSessionOrRedirect,
  getUserInformation,
} from "@/app/api/auth/_session";
import { ShowcaseForm } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/ShowcaseForm";
import Page, {
  metadata,
} from "@/app/datenpflege/anwendungen/bearbeiten/[id]/page";

vi.mock("ioredis");
vi.mock("@/app/api/auth/_session");
vi.mock("@/app/_lib/getData");
vi.mock("next/navigation");
vi.mock("@/app/datenpflege/anwendungen/_components/ShowcaseForm/ShowcaseForm");

describe("Showcase Edit Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    const mockSession = {
      username: "test",
      id_token: "123",
      access_token: "123",
      refresh_token: "123",
      iat: 0,
      roles: [],
    };
    vi.mocked(getSessionOrRedirect).mockResolvedValue(mockSession);
    vi.mocked(getUserInformation).mockResolvedValue({
      username: "test",
      isShowcaseEditor: true,
    });

    vi.mocked(ShowcaseForm).mockReturnValue(
      <div data-testid="mock-showcaseform" />,
    );
  });

  test("should export correct metadata data", () => {
    expect(metadata.title).toBe("Anwendung bearbeiten - GovData");
  });

  test("should render error if requested showcase is not available", async () => {
    vi.mocked(fetchShowcase).mockResolvedValue(undefined);
    const Component = Page({ params: { id: "123" }, searchParams: {} });
    render(await Component);
    expect(vi.mocked(redirect)).not.toHaveBeenCalled();

    const alertMessage = screen.getByRole("alert");
    expect(alertMessage).toHaveTextContent(
      "Die Daten konnten nicht geladen werden oder Sie sind nicht berechtigt, die Daten zu bearbeiten.",
    );
  });

  test("should render MetadataForm", async () => {
    vi.mocked(fetchShowcase).mockResolvedValue({ title: "testTitle" } as any);
    const Component = Page({ params: { id: "123" }, searchParams: {} });
    render(await Component);

    expect(vi.mocked(redirect)).not.toHaveBeenCalled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    expect(screen.getByTestId("mock-showcaseform")).toBeInTheDocument();
  });

  test("should redirect if the user is no showcase editor", async () => {
    vi.mocked(getUserInformation).mockResolvedValue({
      username: "test",
      isShowcaseEditor: false,
    });
    const Component = Page({ params: { id: "123" }, searchParams: {} });
    render(await Component);
    expect(vi.mocked(redirect)).toHaveBeenCalledWith(
      PAGES_AUTH.manage_showcases,
    );
  });
});
