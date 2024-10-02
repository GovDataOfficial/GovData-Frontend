import { describe, expect, test } from "vitest";
import { getByRole, render, screen, within } from "@testing-library/react";
import { MetadataForm } from "@/app/datenpflege/metadaten/form/MetadataForm";
import userEvent from "@testing-library/user-event";
import { METADATA_FORM_ID } from "@/app/datenpflege/metadaten/form/formConstants";

describe("MetaDataForm", () => {
  const getDataOrg = () =>
    screen.getByRole("textbox", {
      name: /datenbereitstellende organisation/i,
    });

  const getGovDataContribId = () =>
    screen.getByRole("textbox", {
      name: /govdata\-contributorid/i,
    });

  const getForwardButton = () => screen.getByRole("button", { name: "Weiter" });

  const invalidClass = "gd-input-invalid";

  test("should have correct form attributes", () => {
    const { container } = render(
      <MetadataForm categories={[]} licenses={[]} />,
    );
    const form = container.querySelector("form");

    expect(form).toHaveAttribute("id", METADATA_FORM_ID);
    expect(form).toHaveAttribute(
      "action",
      "/api/datenpflege/metadaten/erstellen",
    );
  });

  test("should report validity of inputs and go to next step if all is valid", async () => {
    const user = userEvent.setup();
    render(<MetadataForm categories={[]} licenses={[]} />);

    const dataOrgInput = getDataOrg();
    const contribIdInput = getGovDataContribId();
    const forwardButton = getForwardButton();

    expect(dataOrgInput).not.toHaveClass(invalidClass);
    expect(contribIdInput).not.toHaveClass(invalidClass);

    screen.getByRole("heading", { name: "Datenbereitsteller", level: 2 });

    await user.click(forwardButton);

    expect(dataOrgInput).toHaveClass(invalidClass);
    expect(contribIdInput).toHaveClass(invalidClass);

    await user.type(dataOrgInput, "test");
    await user.type(contribIdInput, "test");
    await user.tab();

    expect(dataOrgInput).not.toHaveClass(invalidClass);
    expect(contribIdInput).not.toHaveClass(invalidClass);

    await user.click(forwardButton);

    await screen.findByRole("heading", {
      name: "Angaben zum Inhalt",
      level: 2,
    });
  });

  test("should correctly navigate with the sticky nav", async () => {
    const user = userEvent.setup();
    render(<MetadataForm categories={[]} licenses={[]} />);

    const nav = screen.getAllByRole("navigation");
    // we have two navs, for desk and mobile, hidden via css
    expect(nav).toHaveLength(2);

    // getting all items in first list
    const listItems = within(nav[0]).getAllByRole("listitem");

    //first is active
    expect(listItems[0]).toHaveClass("active");

    // filling out first formstep
    await user.type(getDataOrg(), "test");
    await user.type(getGovDataContribId(), "test");
    // clicking the go next button
    await user.click(getForwardButton());

    // nav should recognize this and move forward
    expect(listItems[0]).not.toHaveClass("active");
    expect(listItems[1]).toHaveClass("active");
  });
});
