import { render, screen, waitFor, within } from "@testing-library/react";
import React from "react";

import "@testing-library/jest-dom";

import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { ShowcasesOverviewMobile } from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewMobile";

vi.mock("@/app/_components/Time/TimeWithDate", () => ({
  TimeWithDate: ({ date }: { date: string }) => <span>{date}</span>,
}));

describe("ShowcasesOverviewMobile", () => {
  const defaultProps: ShowcasesOverviewMobile = {
    data: [
      {
        id: "1",
        name: "1",
        title: "Test Title 1",
        releaseDate: "2023-01-01",
        metadataModified: "2023-02-01",
      },
      {
        id: "2",
        name: "2",
        title: "Test Title 2",
        releaseDate: "2023-03-01",
        metadataModified: "2023-04-01",
      },
    ],
    options: [
      { key: "title", labelKey: "showcasesoverview.table.title" },
      { key: "releaseDate", labelKey: "showcasesoverview.table.releaseDate" },
    ],
    sortConfig: { key: "title", direction: "ascending" },
    sortByKeyAndDirection: vi.fn(),
  };

  it("renders the list of data with the titles, created dates, and last modified dates", () => {
    render(<ShowcasesOverviewMobile {...defaultProps} />);

    defaultProps.data.forEach((d) => {
      screen.getByText(d.title);
      screen.getByText(d.releaseDate!);
      screen.getByText(d.metadataModified!);
    });
  });

  it("renders edit and delete buttons for each data item", () => {
    render(<ShowcasesOverviewMobile {...defaultProps} />);

    const editButtons = screen.getAllByRole("link", { name: /bearbeiten/i });
    const deleteButtons = screen.getAllByRole("button", { name: /löschen/i });
    const showButton = screen.getAllByRole("link", { name: /ansehen/i });

    expect(editButtons).toHaveLength(defaultProps.data.length);
    expect(deleteButtons).toHaveLength(defaultProps.data.length);
    expect(showButton).toHaveLength(defaultProps.data.length);
  });

  it("should handle sort with keyboard", async () => {
    const user = userEvent.setup();
    render(<ShowcasesOverviewMobile {...defaultProps} />);

    const toggleButton = screen.getByRole("button", {
      name: "Titel, alphabetisch A-Z",
    });
    // checking for class as we dont have a marker that tells us which is active.
    expect(toggleButton).toHaveClass("gd-dropdown-toggle");

    // get all listitems in the visible list of datasets
    const list = screen.getByRole("list");
    const listItems = within(list).getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent("Test Title 1");
    expect(listItems[1]).toHaveTextContent("Test Title 2");

    // opening the dropdown with keyboard, tab to button
    await user.tab();
    expect(toggleButton).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.tab();
    await user.tab();
    const buttonDesc = screen.getByRole("button", {
      name: "Titel, alphabetisch Z-A",
    });
    expect(buttonDesc).toHaveFocus();
    // selecting the new sort
    await user.keyboard("{Enter}");
    await waitFor(() => expect(toggleButton).toHaveFocus());

    expect(defaultProps.sortByKeyAndDirection).toHaveBeenCalledWith(
      "title",
      "descending",
    );
  });
});
