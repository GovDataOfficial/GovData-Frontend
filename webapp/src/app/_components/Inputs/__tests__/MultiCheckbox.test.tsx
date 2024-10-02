import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MultiCheckBox } from "@/app/_components/Inputs/MultiCheckBox";

describe("MultiCheckBox", () => {
  const testData = [
    { key: "key1", label: "label1" },
    { key: "key2", label: "label2" },
  ];

  it("should render correct markup for multiple items input", async () => {
    render(<MultiCheckBox legend="myLegend" name="test" data={testData} />);
    // group as we have a fieldset
    const group = screen.getByRole("group", { name: /mylegend/i });
    // inside the group we list the inputs
    const list = within(group).getByRole("list");
    const listItems = within(list).getAllByRole("listitem");

    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveClass("gd-input-multi-checkbox-item");
    expect(listItems[1]).toHaveClass("gd-input-multi-checkbox-item");

    const firstCheckbox = within(listItems[0]).getByRole("checkbox");
    expect(firstCheckbox).toHaveAttribute("name", "test");
    expect(firstCheckbox).toHaveAttribute("value", "key1");
    expect(firstCheckbox).toHaveAttribute("type", "checkbox");

    const secondCheckbox = within(listItems[1]).getByRole("checkbox");
    expect(secondCheckbox).toHaveAttribute("name", "test");
    expect(secondCheckbox).toHaveAttribute("value", "key2");
    expect(secondCheckbox).toHaveAttribute("type", "checkbox");
  });

  it("should show recommended info", () => {
    render(
      <MultiCheckBox
        legend="myLegend"
        name="test"
        data={testData}
        recommended
      />,
    );
    screen.getByRole("group", {
      name: /mylegend \(empfohlen\)/i,
    });
  });
});
