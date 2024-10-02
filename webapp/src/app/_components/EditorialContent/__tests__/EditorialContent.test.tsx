import { describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EditorialContent } from "@/app/_components/EditorialContent/EditorialContent";
import { T3Page } from "@/types/types.typo3";

describe("EditorialContent", () => {
  const pageData = {
    id: 1,
    meta: { title: "test", description: "" },
    content: {
      colPos0: [
        {
          type: "text",
          id: 1,
          content: { header: "head1", bodytext: "<div>hi</div>" },
        },
        {
          type: "html",
          id: 2,
          content: { header: "head2", bodytext: "<div>bin html</div>" },
        },
        {
          type: "text",
          id: 3,
          content: { header: "head3", bodytext: "<div>und text</div>" },
        },
      ],
    },
  } satisfies T3Page;

  it("should render the contents of Content Element as html", async () => {
    render(<EditorialContent pageData={pageData} />);

    screen.getByText("hi");
    screen.getByText("bin html");
    screen.getByText("und text");
  });
});
