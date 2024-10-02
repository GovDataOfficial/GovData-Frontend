import { describe, expect, it } from "vitest";
import { render, within } from "@testing-library/react";
import { T3ContentElements, T3Page } from "@/types/types.typo3";
import { EditorialContentMainPage } from "@/app/_components/EditorialContent/EditorialContentMainPage";

describe("EditorialContentMainPage", () => {
  const pageDataWith = (...elements: T3ContentElements[]) =>
    ({
      id: 1,
      meta: { title: "main page", description: "" },
      content: {
        colPos0: elements,
      },
    }) satisfies T3Page;

  const textWithoutHeader = {
    type: "text",
    id: 1,
    content: { header: "", bodytext: "<div>hi</div>" },
  } as const;

  const htmlWithHeader = {
    type: "html",
    id: 2,
    content: { header: "TestHTML", bodytext: "<div>bin html</div>" },
  } as const;

  const textWithHeader = {
    type: "text",
    id: 3,
    content: { header: "my first header", bodytext: "<div>und text</div>" },
  } as const;

  it("should render single content without header content", async () => {
    const pageData = pageDataWith(textWithoutHeader);
    const { queryByRole, getByText } = render(
      <EditorialContentMainPage pageData={pageData} />,
    );

    expect(queryByRole("heading")).not.toBeInTheDocument();
    expect(getByText("hi")).toBeInTheDocument();
  });

  it("should render single content with header", async () => {
    const pageData = pageDataWith(textWithHeader);
    const { queryByRole, getByText } = render(
      <EditorialContentMainPage pageData={pageData} />,
    );

    expect(
      queryByRole("heading", { level: 2, name: "my first header" }),
    ).toBeInTheDocument();
    expect(getByText("und text")).toBeInTheDocument();
  });

  it("should render multiple content elements in their own container", async () => {
    const pageData = pageDataWith(textWithHeader, htmlWithHeader);
    const { container } = render(
      <EditorialContentMainPage pageData={pageData} />,
    );

    const container930 = container.querySelectorAll(".gd-container-fluid-930");

    expect(container930).toHaveLength(2);

    within(container930.item(0) as HTMLElement).getByRole("heading", {
      name: "my first header",
      level: 2,
    });

    within(container930.item(1) as HTMLElement).getByRole("heading", {
      name: "TestHTML",
      level: 2,
    });
  });
});
