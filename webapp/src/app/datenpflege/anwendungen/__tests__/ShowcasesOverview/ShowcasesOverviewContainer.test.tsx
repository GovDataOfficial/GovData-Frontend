import { render, screen, within } from "@testing-library/react";
import React from "react";

import "@testing-library/jest-dom";

import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { ShowcasesOverviewContainer } from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewContainer";
import { ShowcaseRecord } from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewTypes";

vi.mock("@/app/_components/Time/TimeWithDate", () => ({
  TimeWithDate: ({ date }: { date: string }) => <span>{date}</span>,
}));

describe("ShowcasesOverviewContainer", () => {
  const testData: ShowcaseRecord[] = [
    {
      id: "1",
      name: "1",
      title: "Test Title 1",
      releaseDate: "2022-03-01",
      metadataModified: "2022-04-01",
    },
    {
      id: "2",
      name: "2",
      title: "Test Title 2",
      releaseDate: "2022-03-02",
      metadataModified: "2023-02-01",
    },
  ];

  it("renders title", () => {
    render(<ShowcasesOverviewContainer data={testData} />);
    screen.getByRole("heading", {
      name: "Anwendungen",
      level: 2,
    });
  });

  it("should sort data by last modified date as default", async () => {
    render(<ShowcasesOverviewContainer data={testData} />);

    const table = screen.getByRole("table");
    const firstTitle = within(table).getAllByRole("cell")[0];
    expect(firstTitle.textContent).toEqual(testData[1].title);
  });

  it("should sort the dates", async () => {
    const user = userEvent.setup();

    render(<ShowcasesOverviewContainer data={testData} />);

    const table = screen.getByRole("table");
    const firstTitleBeforeSort = within(table).getAllByRole("cell")[0];
    expect(firstTitleBeforeSort.textContent).toEqual(testData[1].title);

    const createdButton = screen.getByRole("button", { name: /erstellt/i });
    await user.click(createdButton);

    const firstTitleAfterSort = within(table).getAllByRole("cell")[0];
    expect(firstTitleAfterSort.textContent).toEqual(testData[0].title);
  });
});
