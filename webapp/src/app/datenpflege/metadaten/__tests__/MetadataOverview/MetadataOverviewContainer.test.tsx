import { render, screen, within } from "@testing-library/react";
import React from "react";

import "@testing-library/jest-dom";

import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { MetadataOverviewContainer } from "@/app/datenpflege/metadaten/_components/MetadataOverview/MetadataOverviewContainer";
import { MetadataRecord } from "@/app/datenpflege/metadaten/_components/MetadataOverview/MetadataOverviewTypes";

vi.mock("@/app/_components/Time/TimeWithDate", () => ({
  TimeWithDate: ({ date }: { date: string }) => <span>{date}</span>,
}));

describe("MetadataOverviewContainer", () => {
  const testData: MetadataRecord[] = [
    {
      id: "1",
      title: "Test Title 1",
      created: "2022-03-01",
      metadataModified: "2022-04-01",
      name: "test-title-1",
    },
    {
      id: "2",
      title: "Test Title 2",
      created: "2022-03-02",
      metadataModified: "2023-02-01",
      name: "test-title-2",
    },
  ];

  it("renders title", () => {
    render(<MetadataOverviewContainer data={testData} />);
    screen.getByRole("heading", {
      name: "Metadatensätze meiner Organisation",
      level: 2,
    });
  });

  it("should sort data by last modiefied date as default", async () => {
    render(<MetadataOverviewContainer data={testData} />);

    const table = screen.getByRole("table");
    const firstTitle = within(table).getAllByRole("cell")[0];
    expect(firstTitle.textContent).toEqual(testData[1].title);
  });

  it("should sort the dates", async () => {
    const user = userEvent.setup();

    render(<MetadataOverviewContainer data={testData} />);

    const table = screen.getByRole("table");
    const firstTitleBeforeSort = within(table).getAllByRole("cell")[0];
    expect(firstTitleBeforeSort.textContent).toEqual(testData[1].title);

    const createdButton = screen.getByRole("button", { name: /erstellt/i });
    await user.click(createdButton);

    const firstTitleAfterSort = within(table).getAllByRole("cell")[0];
    expect(firstTitleAfterSort.textContent).toEqual(testData[0].title);
  });
});
