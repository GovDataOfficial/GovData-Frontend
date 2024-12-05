import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { MetaDataOverviewContainer } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewContainer";
import { MetaDataRecord } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewTypes";
import userEvent from "@testing-library/user-event";

vi.mock("@/app/_components/Time/TimeWithDate", () => ({
  TimeWithDate: ({ date }: { date: string }) => <span>{date}</span>,
}));

describe("MetaDataOverviewContainer", () => {
  const testData: MetaDataRecord[] = [
    {
      id: "1",
      title: "Test Title 1",
      created: "2023-01-01",
      lastModified: "2023-02-01",
    },
    {
      id: "2",
      title: "Test Title 2",
      created: "2022-03-01",
      lastModified: "2022-04-01",
    },
  ];

  it("renders title", () => {
    render(<MetaDataOverviewContainer data={testData} />);
    screen.getByRole("heading", {
      name: "Metadatensätze meiner Organisation",
      level: 2,
    });
  });

  it("should sort the dates", async () => {
    const user = userEvent.setup();

    render(<MetaDataOverviewContainer data={testData} />);

    const table = screen.getByRole("table");
    const firstTitleBeforeSort = within(table).getAllByRole("cell")[0];
    expect(firstTitleBeforeSort.textContent).toEqual(testData[0].title);

    const createdButton = screen.getByRole("button", { name: /erstellt/i });
    await user.click(createdButton);

    const firstTitleAfterSort = within(table).getAllByRole("cell")[0];
    expect(firstTitleAfterSort.textContent).toEqual(testData[1].title);
  });
});
