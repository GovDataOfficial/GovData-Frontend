import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import { MetaDataOverviewTable } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewTable";
import userEvent from "@testing-library/user-event";

vi.mock("@/app/_components/Time/TimeWithDate", () => ({
  TimeWithDate: ({ date }: { date: string }) => <span>{date}</span>,
}));

describe("MetaDataOverviewTable", () => {
  const defaultProps: MetaDataOverviewTable = {
    data: [
      {
        id: "1",
        title: "Test Title 1",
        created: "2023-03-01",
        lastModified: "2023-02-01",
      },
      {
        id: "2",
        title: "Test Title 2",
        created: "2023-01-01",
        lastModified: "2023-04-01",
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
    render(<MetaDataOverviewTable {...defaultProps} />);
    screen.getByRole("button", { name: "Titel" });
    screen.getByRole("button", { name: "erstellt" });
    screen.getByText("Aktionen");
  });

  it("renders table rows based on data", () => {
    render(<MetaDataOverviewTable {...defaultProps} />);

    defaultProps.data.forEach((row) => {
      screen.getByText(row.title);
      screen.getByText(row.created!);
      screen.getByText(row.lastModified!);
    });
  });

  it("calls sortByKeyAndDirection with correct arguments on header button click", async () => {
    const user = userEvent.setup();
    render(<MetaDataOverviewTable {...defaultProps} />);

    const titleButton = screen.getByRole("button", { name: "Titel" });
    await user.click(titleButton);

    expect(defaultProps.sortByKeyAndDirection).toHaveBeenCalledWith("title");
  });
});
