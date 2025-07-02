import { render, screen } from "@testing-library/react";
import React from "react";

import "@testing-library/jest-dom";

import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { ShowcasesOverviewTable } from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewTable";

vi.mock("@/app/_components/Time/TimeWithDate", () => ({
  TimeWithDate: ({ date }: { date: string }) => <span>{date}</span>,
}));

describe("ShowcasesOverviewTable", () => {
  const defaultProps: ShowcasesOverviewTable = {
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

  it("renders table headers based on options", () => {
    render(<ShowcasesOverviewTable {...defaultProps} />);
    screen.getByRole("button", { name: "Titel" });
    screen.getByRole("button", { name: "erstellt" });
    screen.getByText("Aktionen");
  });

  it("renders table rows based on data", () => {
    render(<ShowcasesOverviewTable {...defaultProps} />);

    defaultProps.data.forEach((row) => {
      screen.getByText(row.title);
      screen.getByText(row.releaseDate!);
      screen.getByText(row.metadataModified!);
    });
  });

  it("calls sortByKeyAndDirection with correct arguments on header button click", async () => {
    const user = userEvent.setup();
    render(<ShowcasesOverviewTable {...defaultProps} />);

    const titleButton = screen.getByRole("button", { name: "Titel" });
    await user.click(titleButton);

    expect(defaultProps.sortByKeyAndDirection).toHaveBeenCalledWith("title");
  });

  it("renders edit and delete buttons for each data item", () => {
    render(<ShowcasesOverviewTable {...defaultProps} />);

    const editButtons = screen.getAllByRole("link", { name: /bearbeiten/i });
    const deleteButtons = screen.getAllByRole("button", { name: /löschen/i });
    const showButton = screen.getAllByRole("link", { name: /ansehen/i });

    expect(editButtons).toHaveLength(defaultProps.data.length);
    expect(deleteButtons).toHaveLength(defaultProps.data.length);
    expect(showButton).toHaveLength(defaultProps.data.length);
  });
});
