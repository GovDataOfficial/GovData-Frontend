import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { fetchShowcase } from "@/app/_lib/getData";
import { ShowcaseForm } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/ShowcaseForm";
import Page, {
  metadata,
} from "@/app/datenpflege/anwendungen/bearbeiten/[id]/page";

vi.mock("@/app/_lib/getData");
vi.mock("next/navigation");
vi.mock("@/app/datenpflege/anwendungen/_components/ShowcaseForm/ShowcaseForm");

describe("Showcase Edit Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(ShowcaseForm).mockReturnValue(
      <div data-testid="mock-showcaseform" />,
    );
  });

  test("should export correct metadata data", () => {
    expect(metadata.title).toContain("Anwendung bearbeiten -");
  });

  test("should render error if requested showcase is not available", async () => {
    vi.mocked(fetchShowcase).mockResolvedValue(undefined);
    const Component = Page({ params: { id: "123" }, searchParams: {} });
    render(await Component);

    const alertMessage = screen.getByRole("alert");
    expect(alertMessage).toHaveTextContent(
      "Die Daten konnten nicht geladen werden oder Sie sind nicht berechtigt, die Daten zu bearbeiten.",
    );
  });

  test("should render MetadataForm", async () => {
    vi.mocked(fetchShowcase).mockResolvedValue({ title: "testTitle" } as any);
    const Component = Page({ params: { id: "123" }, searchParams: {} });
    render(await Component);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    expect(screen.getByTestId("mock-showcaseform")).toBeInTheDocument();
  });
});
