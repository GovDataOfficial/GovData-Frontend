import { describe, expect, it } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import { DLTags } from "@/app/suche/_components/SearchDetailsInfobox/partials/DLTags";
import userEvent from "@testing-library/user-event";

describe("DLTags", () => {
  it("should render a list with 3 items", () => {
    render(<DLTags tags={["te", "foo", "blaa"]} />);

    const term = screen.getByRole("term");
    expect(term).toHaveTextContent("Schlagwörter");

    const allDd = screen.getAllByRole("definition");

    expect(allDd).toHaveLength(3);
    expect(allDd[0].textContent).toBe("te");
    expect(allDd[1].textContent).toBe("foo");
    expect(allDd[2].textContent).toBe("blaa");

    const button = screen.queryByRole("button", {
      name: /mehr anzeigen/i,
    });
    expect(button).toBeNull();
  });

  it("should render a show more button if more than 10 tags", async () => {
    const user = userEvent.setup();

    render(
      <DLTags
        tags={[
          "te",
          "foo",
          "blaa",
          "das",
          "sind",
          "mehr",
          "als",
          "zehn",
          "tags",
          "glaube",
          "ich",
          "oder",
          "etwa",
          "nicht",
        ]}
      />,
    );

    const button = screen.getByRole("button", {
      name: /mehr anzeigen/i,
    });
    expect(button).toBeDefined();

    const allDd = screen.getAllByRole("definition");
    expect(allDd).toHaveLength(10);
    expect(allDd[9].textContent).toBe("glaube");

    await act(() => user.click(button));
    const allDdAfterOpenClick = screen.getAllByRole("definition");
    expect(allDdAfterOpenClick).toHaveLength(14);
    expect(allDdAfterOpenClick[13].textContent).toBe("nicht");

    await act(() => user.click(button));
    const allDdAfterCloseClick = screen.getAllByRole("definition");
    expect(allDdAfterCloseClick).toHaveLength(10);
    expect(allDdAfterCloseClick[9].textContent).toBe("glaube");
  });
});
