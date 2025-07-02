import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { after } from "node:test";

import { OverviewButtonDelete } from "@/app/datenpflege/common/OverviewButtonDelete";

vi.mock("@/app/_components/SVG/SVG", () => ({
  icons: { trash: "trash" },
  SVG: ({ icon }: { icon: string }) => <span>{icon}</span>,
}));

describe("MetadataOverviewButtonDelete", () => {
  const props = {
    dataTitle: "a title",
    id: "123",
    apiEndpoint: "api-endpoint",
    url: "http.//test.de",
    deleteConfirmText: "Are you sure?",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.spyOn(window, "confirm").mockImplementation(() => true);
    vi.spyOn(window, "location", "get").mockReturnValue({
      assign: vi.fn(),
    } as unknown as Location);
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders the component", () => {
    render(<OverviewButtonDelete {...props} />);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeInTheDocument();
  });

  test("calls confirm and deletes on user confirmation", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 200, ok: true } as any);
    const user = userEvent.setup();
    render(<OverviewButtonDelete {...props} />);
    const buttonElement = screen.getByRole("button");
    await user.click(buttonElement);

    const confirmMessage = vi.mocked(window.confirm).mock.calls[0][0];
    expect(confirmMessage).toContain(props.deleteConfirmText);

    expect(fetch).toHaveBeenCalledWith(`${props.apiEndpoint}/${props.id}`, {
      method: "DELETE",
    });

    expect(window.location.assign).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(800);

    expect(window.location.assign).toHaveBeenCalledWith(
      `${props.url}?title=${encodeURIComponent(props.dataTitle)}&deleteResult=success`,
    );
  });

  test("handles fetch failure by redirecting with error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 500 } as any);
    const user = userEvent.setup();
    render(<OverviewButtonDelete {...props} />);
    const buttonElement = screen.getByRole("button");
    await user.click(buttonElement);

    await vi.advanceTimersByTimeAsync(800);

    expect(window.location.assign).toHaveBeenCalledWith(
      `${props.url}?title=${encodeURIComponent(props.dataTitle)}&deleteResult=error`,
    );
  });

  test("does not delete if confirmation is false", async () => {
    vi.spyOn(window, "confirm").mockImplementation(() => false);
    const user = userEvent.setup();
    render(<OverviewButtonDelete {...props} />);
    const buttonElement = screen.getByRole("button");
    await user.click(buttonElement);

    expect(fetch).not.toHaveBeenCalled();
    expect(window.location.assign).not.toHaveBeenCalled();
  });
});
