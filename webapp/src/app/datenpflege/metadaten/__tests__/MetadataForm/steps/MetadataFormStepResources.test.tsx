import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  METADATA_FORM_INPUTS,
  METADATA_FORM_MAX_LENGTH_LONG,
  METADATA_FORM_MAX_LENGTH_MEDIUM,
} from "@/app/datenpflege/metadaten/_components/MetadataForm/metadata-formConstants";
import { MetadataFormStepResources } from "@/app/datenpflege/metadaten/_components/MetadataForm/steps/resources/MetadataFormStepResources";
import { LicenseActiveSorted, MetadataResource } from "@/types/types";

vi.mock("@/app/_components/SVG/SVG", () => ({
  icons: { trash: "trash", plus: "plus" },
  SVG: ({ icon }: { icon: string }) => <span>{icon}</span>,
}));

describe("MetadataFormStepResources", () => {
  const createLicense = (id: string) => ({
    id: "http://dcat-ap.de/def/licenses/" + id,
    title: "title-of-" + id,
    url: "url-of-" + id,
  });

  const licenses = [
    createLicense("officialWork"),
    createLicense("other-freeware"),
    createLicense("other-closed"),
    createLicense("other-commercial"),
    createLicense("other-open"),
    createLicense("other-opensource"),
    createLicense("bsd"),
    createLicense("cc-zero"),
    createLicense("cc-by"),
    createLicense("cc-by-nd"),
    createLicense("cc-by-nc"),
    createLicense("cc-by-sa"),
    createLicense("apache"),
    createLicense("gfdl"),
    createLicense("mozilla"),
    createLicense("odby"),
    createLicense("odbl"),
    createLicense("odcpddl"),
  ] satisfies LicenseActiveSorted;

  const createResource = () => ({
    id: "resourceid" + Math.random(),
    name: "test-resource",
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "confirm").mockImplementation(() => true);
  });

  test("should render correct headline", () => {
    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
      />,
    );
    screen.getByRole("heading", { name: "Ressourcen", level: 2 });
  });

  test("should render correct licenses", () => {
    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
      />,
    );

    const ressourceGroup1 = screen.getByRole("group", { name: /ressource 1/i });
    const select = within(ressourceGroup1).getByRole("combobox", {
      name: "Lizenz",
    });

    expect(select).toBeRequired();
    // cc-zero should be default
    expect(select).toHaveDisplayValue("title-of-cc-zero");

    const options = within(select).getAllByRole("option");

    expect(options[0]).toHaveTextContent("title-of-cc-zero");
    expect(options[1]).toHaveTextContent("title-of-cc-by");

    const dividers = within(select).getAllByRole("option", {
      name: "──────────",
    });

    expect(dividers).toHaveLength(2);
    expect(dividers[0]).not.toHaveAttribute("value");
    expect(dividers[0]).toBeDisabled();
    expect(dividers[1]).not.toHaveAttribute("value");
    expect(dividers[1]).toBeDisabled();
  });

  test("should render correct input markup", () => {
    const resourceObject = METADATA_FORM_INPUTS.RESSOURCE(0);

    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
      />,
    );

    const group1 = screen.getByRole("group", { name: /ressource 1/i });

    const resourceUrlInput = within(group1).getByRole("textbox", {
      name: "URL der Ressource",
    });

    expect(resourceUrlInput).toHaveAttribute("name", resourceObject.url);
    expect(resourceUrlInput).toBeRequired();
    expect(resourceUrlInput).toHaveDisplayValue("");
    expect(resourceUrlInput).toHaveAttribute("type", "url");
    expect(resourceUrlInput).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_MEDIUM.toString(),
    );

    const nameInput = within(group1).getByRole("textbox", {
      name: "Name",
    });
    expect(nameInput).toHaveAttribute("name", resourceObject.name);
    expect(nameInput).not.toBeRequired();
    expect(nameInput).toHaveDisplayValue("");
    expect(nameInput).toHaveAttribute("type", "text");
    expect(nameInput).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_MEDIUM.toString(),
    );

    const descriptionInput = within(group1).getByRole("textbox", {
      name: "Beschreibung",
    });
    expect(descriptionInput).toHaveAttribute(
      "name",
      resourceObject.description,
    );
    expect(descriptionInput).not.toBeRequired();
    expect(descriptionInput).toHaveDisplayValue("");
    expect(descriptionInput).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_LONG.toString(),
    );

    const formatInput = within(group1).getByRole("textbox", {
      name: "Format",
    });
    expect(formatInput).toHaveAttribute("name", resourceObject.format);
    expect(formatInput).not.toBeRequired();
    expect(formatInput).toHaveDisplayValue("");
    expect(formatInput).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_MEDIUM.toString(),
    );

    const languageInput = within(group1).getByRole("textbox", {
      name: "Sprache",
    });
    expect(languageInput).toHaveAttribute("name", resourceObject.language);
    expect(languageInput).not.toBeRequired();
    expect(languageInput).toHaveDisplayValue("");
    expect(languageInput).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_LONG.toString(),
    );

    const byClauseInput = within(group1).getByRole("textbox", {
      name: /namensnennungstext für/i,
    });
    expect(byClauseInput).toHaveAttribute(
      "name",
      resourceObject.licenseAttributionByText,
    );
    expect(byClauseInput).not.toBeRequired();
    expect(byClauseInput).toHaveDisplayValue("");
    expect(byClauseInput).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_MEDIUM.toString(),
    );

    const modifiedInput = within(group1).getByLabelText(
      /aktualisierungsdatum der ressource/i,
    );
    expect(modifiedInput).toHaveAttribute("name", resourceObject.modified);
    expect(modifiedInput).not.toBeRequired();

    const availabilityInput = within(group1).getByRole("combobox", {
      name: /verfügbarkeit/i,
    });
    expect(availabilityInput).toHaveAttribute(
      "name",
      resourceObject.availability,
    );
    expect(availabilityInput).not.toBeRequired();

    const hvdCheckbox = within(group1).getByRole("checkbox", {
      name: "Hochwertiger Datensatz",
    });
    expect(hvdCheckbox).toHaveAttribute("name", resourceObject.hvd);
    expect(hvdCheckbox).not.toBeChecked();
  });

  test("should render all resource groups if provided", () => {
    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
        defaultResources={Array(6).fill(createResource())}
      />,
    );

    const allGroups = screen.getAllByRole("group");
    expect(allGroups).toHaveLength(6);
  });

  test("should add a new ressource", async () => {
    const user = userEvent.setup();
    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
      />,
    );

    const allGroups = screen.getAllByRole("group");
    expect(allGroups).toHaveLength(1);

    const addButton = screen.getByRole("button", {
      name: /ressource hinzufügen/i,
    });

    await user.click(addButton);

    const newGroups = screen.getAllByRole("group");
    expect(newGroups).toHaveLength(2);
    screen.getByRole("group", { name: /ressource 2/i });
  });

  test("should delete a ressource", async () => {
    const user = userEvent.setup();
    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
        defaultResources={Array(3).fill(createResource())}
      />,
    );

    const allGroups = screen.getAllByRole("group");
    expect(allGroups).toHaveLength(3);

    const deleteRessource2Button = screen.getByRole("button", {
      name: /ressource 2 löschen/i,
    });

    await user.click(deleteRessource2Button);

    const newGroups = screen.getAllByRole("group");
    expect(newGroups).toHaveLength(2);
    screen.getByRole("group", { name: /ressource 1/i });
    screen.getByRole("group", { name: /ressource 2/i });
  });

  test("does not delete if not confirmed", async () => {
    vi.spyOn(window, "confirm").mockImplementation(() => false);
    const user = userEvent.setup();
    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
        defaultResources={Array(3).fill(createResource())}
      />,
    );

    const allGroups = screen.getAllByRole("group");
    expect(allGroups).toHaveLength(3);

    const deleteRessource2Button = screen.getByRole("button", {
      name: /ressource 2 löschen/i,
    });

    await user.click(deleteRessource2Button);

    const newGroups = screen.getAllByRole("group");
    expect(newGroups).toHaveLength(3);
  });

  test("should not offer a delete button if only one ressource is present", async () => {
    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
      />,
    );

    const allGroups = screen.getAllByRole("group");
    expect(allGroups).toHaveLength(1);

    expect(
      screen.queryByRole("button", { name: /ressource 1 löschen/i }),
    ).not.toBeInTheDocument();
  });

  test("should show live region message after delete", async () => {
    const user = userEvent.setup();
    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
        defaultResources={Array(2).fill(createResource())}
      />,
    );

    const deleteRessource2Button = screen.getByRole("button", {
      name: /ressource 2 löschen/i,
    });

    await user.click(deleteRessource2Button);

    const srOnlyText = screen.getByText("Ressource 2 gelöscht");
    expect(srOnlyText).toHaveClass("sr-only");
  });

  test("should show live region message after add", async () => {
    const user = userEvent.setup();
    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
        defaultResources={Array(2).fill(createResource())}
      />,
    );

    const addButton = screen.getByRole("button", {
      name: /ressource hinzufügen/i,
    });
    await user.click(addButton);

    const srOnlyText = screen.getByText("Ressource hinzugefügt");
    expect(srOnlyText).toHaveClass("sr-only");
  });

  test("should focus add button after delete", async () => {
    const user = userEvent.setup();
    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
        defaultResources={Array(2).fill(createResource())}
      />,
    );

    const deleteRessource2Button = screen.getByRole("button", {
      name: /ressource 2 löschen/i,
    });

    await user.click(deleteRessource2Button);
    const addButton = screen.getByRole("button", {
      name: /ressource hinzufügen/i,
    });
    expect(addButton).toHaveFocus();
  });

  test("should focus first input of the new resource after add", async () => {
    const user = userEvent.setup();
    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
        defaultResources={Array(1).fill(createResource())}
      />,
    );

    const addButton = screen.getByRole("button", {
      name: /ressource hinzufügen/i,
    });
    await user.click(addButton);

    const group2 = screen.getByRole("group", { name: /ressource 2/i });

    const firstInput = within(group2).getByRole("textbox", {
      name: /url der ressource/i,
    });
    expect(firstInput).toHaveFocus();
  });

  test("should render infobox if non valid resources are provided", async () => {
    const invalidLicenseInfoTitle = "Ungültige Lizenzinformationen";
    const oldLicenseTitle = "Alte Lizenz";
    const newLicenseTitle = "Neue Lizenz";
    render(
      <MetadataFormStepResources
        forStep={0}
        currentStep={0}
        licenses={licenses}
        defaultResources={
          [
            // undefined resource should be valid
            { id: "1", name: "test-res-1", license: undefined },
            // unknown license should be invalid
            {
              id: "2",
              name: "test-res-2",
              license: { id: "wef", title: "my-unknown-resource" },
            },
          ] as MetadataResource[]
        }
      />,
    );

    // resource 1 should have valid default license
    const resource1 = screen.getByRole("group", { name: /ressource 1/i });
    const licenseSelect1 = within(resource1).getByRole("combobox", {
      name: "Lizenz",
    });

    expect(licenseSelect1).toHaveDisplayValue("title-of-cc-zero");
    expect(licenseSelect1).toBeRequired();
    // the invalid text here should not be present
    const invalidText1 = within(resource1).queryByText(invalidLicenseInfoTitle);
    const selectOldLicense1 = within(resource1).queryByText(oldLicenseTitle);
    const selectNewLicense1 = within(resource1).queryByText(newLicenseTitle);
    expect(invalidText1).not.toBeInTheDocument();
    expect(selectOldLicense1).not.toBeInTheDocument();
    expect(selectNewLicense1).not.toBeInTheDocument();

    // resource 2 should have invalid license
    const resource2 = screen.getByRole("group", { name: /ressource 2/i });
    const invalidText2 = within(resource2).getByText(invalidLicenseInfoTitle);
    expect(invalidText2).toBeVisible();
    const licenseSelect2 = within(resource2).queryByRole("combobox", {
      name: "Lizenz",
    });
    // the normal "Lizenz" select is not available here
    expect(licenseSelect2).not.toBeInTheDocument();

    // a textbox with readonly and no name should be present
    const oldLicense = within(resource2).getByRole("textbox", {
      name: oldLicenseTitle,
    });
    expect(oldLicense).not.toHaveAttribute("name");
    expect(oldLicense).toHaveAttribute("readonly");
    expect(oldLicense).toHaveDisplayValue("my-unknown-resource");

    const selectNewLicense2 = within(resource2).getByRole("combobox", {
      name: newLicenseTitle,
    });
    expect(selectNewLicense2).toHaveDisplayValue(["Bitte wählen"]);
    expect(selectNewLicense2).toHaveAttribute("name", "resources[1].licenseId");
  });
});
