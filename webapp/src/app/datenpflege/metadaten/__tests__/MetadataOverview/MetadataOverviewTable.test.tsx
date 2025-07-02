import { render, screen } from "@testing-library/react";
import React from "react";

import "@testing-library/jest-dom";

import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { MetadataOverviewTable } from "@/app/datenpflege/metadaten/_components/MetadataOverview/MetadataOverviewTable";

vi.mock("@/app/_components/Time/TimeWithDate", () => ({
  TimeWithDate: ({ date }: { date: string }) => <span>{date}</span>,
}));

describe("MetadataOverviewTable", () => {
  const defaultProps: MetadataOverviewTable = {
    data: [
      {
        id: "1",
        title: "Test Title 1",
        created: "2023-03-01",
        metadataModified: "2023-02-01",
        name: "test-title-1",
      },
      {
        id: "2",
        title: "Test Title 2",
        created: "2023-01-01",
        metadataModified: "2023-04-01",
        name: "test-title-2",
      },
    ],
    options: [
      { key: "title", labelKey: "metadataoverview.table.title" },
      { key: "created", labelKey: "metadataoverview.table.created" },
    ],
    sortConfig: { key: "title", direction: "ascending" },
    sortByKeyAndDirection: vi.fn(),
  };

  it("renders table headers based on options", () => {
    render(<MetadataOverviewTable {...defaultProps} />);
    screen.getByRole("button", { name: "Titel" });
    screen.getByRole("button", { name: "erstellt" });
    screen.getByText("Aktionen");
  });

  it("renders table rows based on data", () => {
    render(<MetadataOverviewTable {...defaultProps} />);

    defaultProps.data.forEach((row) => {
      screen.getByText(row.title);
      screen.getByText(row.created!);
      screen.getByText(row.metadataModified!);
    });
  });

  it("calls sortByKeyAndDirection with correct arguments on header button click", async () => {
    const user = userEvent.setup();
    render(<MetadataOverviewTable {...defaultProps} />);

    const titleButton = screen.getByRole("button", { name: "Titel" });
    await user.click(titleButton);

    expect(defaultProps.sortByKeyAndDirection).toHaveBeenCalledWith("title");
  });

  it("renders edit and delete buttons for each data item", () => {
    render(<MetadataOverviewTable {...defaultProps} />);

    const editButtons = screen.getAllByRole("link", { name: /bearbeiten/i });
    const deleteButtons = screen.getAllByRole("button", { name: /löschen/i });
    const showButton = screen.getAllByRole("link", { name: /ansehen/i });

    expect(editButtons).toHaveLength(defaultProps.data.length);
    expect(deleteButtons).toHaveLength(defaultProps.data.length);
    expect(showButton).toHaveLength(defaultProps.data.length);
  });
});
