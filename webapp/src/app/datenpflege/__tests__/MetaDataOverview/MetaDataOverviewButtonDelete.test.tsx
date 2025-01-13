import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SVG } from "@/app/_components/SVG/SVG";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { MetaDataOverviewButtonDelete } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewButtonDelete";

vi.mock("@/app/_components/SVG/SVG", () => ({
  icons: { trash: "trash" },
  SVG: ({ icon }: { icon: string }) => <span>{icon}</span>,
}));

describe("MetaDataOverviewButtonDelete", () => {
  const props = {
    dataTitle: "a title",
    id: "123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "confirm").mockImplementation(() => true);
    vi.spyOn(window, "location", "get").mockReturnValue({
      assign: vi.fn(),
    } as unknown as Location);
    globalThis.fetch = vi.fn();
  });

  test("renders the component", () => {
    render(<MetaDataOverviewButtonDelete {...props} />);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeInTheDocument();
  });

  test("calls confirm and deletes on user confirmation", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 200, ok: true } as any);
    const user = userEvent.setup();
    render(<MetaDataOverviewButtonDelete {...props} />);
    const buttonElement = screen.getByRole("button");
    await user.click(buttonElement);

    const confirmMessage = vi.mocked(window.confirm).mock.calls[0][0];
    expect(confirmMessage).toContain(props.dataTitle);

    expect(fetch).toHaveBeenCalledWith(
      `${API_ENDPOINTS.METADATA.DELETE}/${props.id}`,
      {
        method: "DELETE",
      },
    );

    expect(window.location.assign).toHaveBeenCalledWith(
      `${PAGES_AUTH.manage_data}?title=${encodeURIComponent(props.dataTitle)}&deleteResult=success`,
    );
  });

  test("handles fetch failure by redirecting with error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 500 } as any);
    const user = userEvent.setup();
    render(<MetaDataOverviewButtonDelete {...props} />);
    const buttonElement = screen.getByRole("button");
    await user.click(buttonElement);

    expect(window.location.assign).toHaveBeenCalledWith(
      `${PAGES_AUTH.manage_data}?title=${encodeURIComponent(props.dataTitle)}&deleteResult=error`,
    );
  });

  test("does not delete if confirmation is false", async () => {
    vi.spyOn(window, "confirm").mockImplementation(() => false);
    const user = userEvent.setup();
    render(<MetaDataOverviewButtonDelete {...props} />);
    const buttonElement = screen.getByRole("button");
    await user.click(buttonElement);

    expect(fetch).not.toHaveBeenCalled();
    expect(window.location.assign).not.toHaveBeenCalled();
  });
});
